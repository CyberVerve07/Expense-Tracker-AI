'use server';

import { getGroqClient } from '../groq';
import { z } from 'zod';

const DiaryAnalysisOutputSchema = z.object({
  analysisSummary: z.string(),
  keyFindings: z.array(z.string()),
  actionableRecommendations: z.array(z.string()),
  celebratingWins: z.string(),
  gentleChallenges: z.string(),
  nextWeekForecast: z.string(),
});

export type DiaryAnalysisInput = { diaryEntries: string };
export type DiaryAnalysisOutput = z.infer<typeof DiaryAnalysisOutputSchema>;

export async function diaryAnalysisAndRecommendations(
  input: DiaryAnalysisInput
): Promise<DiaryAnalysisOutput> {
  const groq = getGroqClient();

  const systemPrompt = `You are a Personal AI Agent specialized in analyzing user diary entries.
Analyze diary entries to identify mood trends, work patterns, and stress triggers.
Provide personalized recommendations for improving productivity and overall well-being.
Be empathetic and supportive. Use emojis for readability.
You MUST respond with ONLY a valid JSON object, no markdown, no extra text.`;

  const userPrompt = `Diary Entries:
${input.diaryEntries}

Respond with a JSON object with these exact fields:
{
  "analysisSummary": "2-3 sentence overview of the diary analysis",
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "actionableRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"],
  "celebratingWins": "specific praise for positive patterns observed",
  "gentleChallenges": "areas to improve, phrased supportively",
  "nextWeekForecast": "predicted patterns and preventive suggestions"
}`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = DiaryAnalysisOutputSchema.parse(JSON.parse(raw));
  return parsed;
}

export const diaryAnalysisFlow = diaryAnalysisAndRecommendations;
