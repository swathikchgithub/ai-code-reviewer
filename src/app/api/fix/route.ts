import { generateObject } from 'ai';
import { fixModel } from '@/lib/ai';
import { z } from 'zod';

const fixSchema = z.object({
  fixed_code: z.string().describe('The complete code snippet that resolves the specified issue. Do not include markdown formatting or backticks in this code content, just the raw code.'),
  explanation: z.string().describe('A concise explanation (1-2 sentences) of how this fix resolves the issue.')
});

export async function POST(request: Request) {
  try {
    const { code, language, issue, style } = await request.json();

    if (!code || !issue) {
      return Response.json({ error: 'Code and issue details are required' }, { status: 400 });
    }

    let systemPrompt = '';
    switch (style) {
      case 'complexity':
        systemPrompt = `You are a World-Class Algorithmic & Big-O Complexity Specialist.
Your task is to fix a specific issue in the code provided while optimizing time and space complexity bounds.
Issue description: "${issue.description}" on line ${issue.line} (severity: ${issue.severity}).
Provide the corrected code and a concise explanation of how the fix improves Big-O efficiency or correctness.`;
        break;
      case 'architect':
        systemPrompt = `You are a Principal Production System & Security Architect.
Your task is to fix a specific security or scalability vulnerability in the code provided.
Issue description: "${issue.description}" on line ${issue.line} (severity: ${issue.severity}).
Provide the corrected, production-hardened code and a concise security/architectural explanation.`;
        break;
      case 'strict':
        systemPrompt = `You are an elite, brutally direct Senior Software Engineer.
Your task is to fix a single, specific issue in the code provided.
Issue description: "${issue.description}" on line ${issue.line} (severity: ${issue.severity}).
Provide ONLY the corrected code and a brief explanation. Be concise and to the point.`;
        break;
      case 'friendly':
      default:
        systemPrompt = `You are an encouraging Technical Mentor.
Your task is to fix a single, specific issue in the code provided.
Issue description: "${issue.description}" on line ${issue.line} (severity: ${issue.severity}).
Explain the fix in an educational, friendly, and supportive way so the developer understands what was changed.`;
        break;
    }

    const promptText = `Language: ${language || 'javascript'}
Issue Description: ${issue.description}
Line: ${issue.line}
Severity: ${issue.severity}

Original Code:
\`\`\`
${code}
\`\`\``;

    const result = await generateObject({
      model: fixModel,
      schema: fixSchema,
      system: systemPrompt,
      prompt: promptText,
    });

    return Response.json(result.object);
  } catch (error: unknown) {
    console.error('API Error in /api/fix:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate fix. Please check your config and try again.';
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
