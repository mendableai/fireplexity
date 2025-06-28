import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { CoreTool } from 'ai';

export type Provider = 'openai' | 'google' | 'groq';

export function getLLMProvider(provider: Provider, tools?: Record<string, CoreTool>) {
  switch (provider) {
    case 'openai':
      return createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    case 'google':
      return createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
      });
    case 'groq':
      return createGroq({
        apiKey: process.env.GROQ_API_KEY,
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
