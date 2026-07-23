import { generateObject } from 'ai';
import { reviewModel, estimateCostUsd } from '@/lib/ai';
import { z } from 'zod';

// Define the Zod schema for structured output
export const reviewSchema = z.object({
  issues: z.array(
    z.object({
      line: z.number().describe('The 1-based line number in the code where the issue occurs. If it is a general issue, set to 1.'),
      severity: z.enum(['critical', 'warning', 'info']).describe('The severity of the issue: critical (errors, bugs, security flaws), warning (performance, readability, minor issues), info (style preferences, documentation)'),
      description: z.string().describe('Clear, actionable explanation of the issue and how to resolve it.')
    })
  ),
  suggestions: z.array(z.string()).describe('High-level constructive suggestions for improvement.'),
  score: z.number().min(1).max(10).describe('Overall quality score from 1 (terrible) to 10 (flawless).'),
  time_complexity: z.string().describe('Big-O Time Complexity of original code vs optimal solution, e.g. "O(N²) -> O(N)".'),
  space_complexity: z.string().describe('Big-O Auxiliary Space Complexity of original code vs optimal solution, e.g. "O(N) -> O(1)".'),
  complexity_analysis: z.string().describe('Concise Big-O time and space complexity evaluation explaining any algorithmic bottlenecks.'),
  refactored_code: z.string().describe('The complete refactored code with all identified issues resolved.')
});

export async function POST(request: Request) {
  try {
    const { code, language, style } = await request.json();

    if (!code) {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }

    let systemPrompt = '';
    
    switch (style) {
      case 'complexity':
        systemPrompt = `You are a World-Class Algorithmic & Big-O Complexity Specialist.
Your primary objective is to analyze the exact Time Complexity (Big-O, Big-Omega, Big-Theta) and Auxiliary Space Complexity of the code.
Highlight nested loops, unnecessary array allocations, data structure inefficiencies, and mathematical lower bounds.
Always explain how to optimize the algorithm from O(N²) to O(N) or O(N log N) whenever possible.
Provide an exact estimation for time_complexity and space_complexity fields, plus a complete refactored solution with optimal Big-O performance.`;
        break;
      case 'architect':
        systemPrompt = `You are a Principal Production System & Security Architect.
Your focus is strictly on Security Vulnerabilities (SQL injection, XSS, path traversal), Concurrency & Thread Safety (race conditions, deadlocks), Memory Leaks, and High-Throughput System Scalability.
Evaluate whether the code is production-ready for mission-critical enterprise workloads.
Provide an exact estimation for time_complexity and space_complexity fields, plus a complete secure, production-hardened refactored solution.`;
        break;
      case 'strict':
        systemPrompt = `You are an elite, brutally honest Senior Software Engineer reviewing a colleague's pull request.
Your feedback is extremely direct, blunt, and focused on finding every security flaw, performance bottleneck, architectural anti-pattern, and stylistic inconsistency.
Do not sugarcoat anything. Explain exactly what is wrong in a concise, authoritative tone.
Rate the code strictly (most typical code is 1-6).
Provide an exact estimation for time_complexity and space_complexity fields, plus a complete refactored version of the code.`;
        break;
      case 'friendly':
      default:
        systemPrompt = `You are an encouraging, supportive, and highly knowledgeable Technical Mentor.
Your feedback is warm, educational, and constructive. You want to help the developer grow.
Acknowledge what is done well, and explain the "why" behind every suggestion and Big-O efficiency choice.
Rate the code fairly while offering helpful guidance for improvement.
Provide an exact estimation for time_complexity and space_complexity fields, plus a clean, readable refactored solution.`;
        break;
    }

    const promptText = `Language: ${language || 'javascript'}
Code to review:
\`\`\`
${code}
\`\`\``;

    const result = await generateObject({
      model: reviewModel,
      schema: reviewSchema,
      system: systemPrompt,
      prompt: promptText,
    });

    const inputTokens = result.usage.inputTokens ?? 0;
    const outputTokens = result.usage.outputTokens ?? 0;

    return Response.json({
      ...result.object,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: result.usage.totalTokens ?? inputTokens + outputTokens,
        estimatedCostUsd: estimateCostUsd(inputTokens, outputTokens),
      },
    });
  } catch (error: unknown) {
    console.error('API Error in /api/review:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate review. Please check your credentials and configuration.';
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
