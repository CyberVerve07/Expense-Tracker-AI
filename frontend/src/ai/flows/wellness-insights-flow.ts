'use server';

import { getGroqClient } from '../groq';
import { z } from 'zod';

const WellnessInsightsOutputSchema = z.object({
  analysisSummary: z.string(),
  keyFindings: z.array(z.string()),
  actionableRecommendations: z.array(z.string()),
  celebratingWins: z.string(),
  gentleChallenges: z.string(),
  nextWeekForecast: z.string(),
});

export type WellnessInsightsInput = { wellnessData: string };
export type WellnessInsightsOutput = z.infer<typeof WellnessInsightsOutputSchema>;

export async function getWellnessInsights(
  input: WellnessInsightsInput
): Promise<WellnessInsightsOutput> {
  const groq = getGroqClient();

  const systemPrompt = `You are an advanced Personal AI Agent specializing in analyzing user productivity patterns, expense management, and wellness insights from their diary and expense tracking data.
Be empathetic, motivational, action-oriented, and data-driven.
Reference Indian holidays and seasonal factors when relevant. Celebrate small wins and progress.
Do NOT share medical or legal advice - suggest consulting professionals when needed.
You MUST respond with ONLY a valid JSON object, no markdown, no extra text.`;

  const userPrompt = `Wellness Data:
${input.wellnessData}

Respond with a JSON object with these exact fields:
{
  "analysisSummary": "2-3 sentence overview",
  "keyFindings": ["finding 1 with data point", "finding 2 with data point", "finding 3 with data point"],
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
  const parsed = WellnessInsightsOutputSchema.parse(JSON.parse(raw));
  return parsed;
}

export const wellnessInsightsFlow = getWellnessInsights;
