import { createOpenAI } from '@ai-sdk/openai';

if (!process.env.OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY environment variable is not defined.');
}

export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  headers: {
    'HTTP-Referer': 'https://github.com/google-deepmind/antigravity',
    'X-Title': 'AI Code Reviewer',
  },
});

// Use google/gemini-2.5-flash for fast, reliable structured reviews without upstream idle timeouts
export const reviewModel = openrouter('google/gemini-2.5-flash');

// Use google/gemini-2.5-flash for fast targeted fixes
export const fixModel = openrouter('google/gemini-2.5-flash');
