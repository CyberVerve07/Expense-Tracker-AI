'use server';

import { getGroqClient } from '../groq';
import { z } from 'zod';

const ExpenseAnalysisOutputSchema = z.object({
  analysisSummary: z.string(),
  keyFindings: z.array(z.string()),
  actionableRecommendations: z.array(z.string()),
  celebratingWins: z.string(),
  gentleChallenges: z.string(),
  nextWeekForecast: z.string(),
});

export type ExpenseAnalysisInput = {
  expenses: string;
  income: number;
};
export type ExpenseAnalysisOutput = z.infer<typeof ExpenseAnalysisOutputSchema>;

export async function expenseAnalysisAndBudgeting(
  input: ExpenseAnalysisInput
): Promise<ExpenseAnalysisOutput> {
  const groq = getGroqClient();

  const systemPrompt = `You are an advanced Personal AI Agent specializing in expense management.
Analyze the user's expense data to categorize spending, identify saving opportunities, and suggest budgeting strategies.
Be empathetic, motivational, action-oriented, and data-driven.
Reference Indian holidays and seasonal factors when relevant.
Celebrate small wins and progress. Use emojis for readability.
You MUST respond with ONLY a valid JSON object, no markdown, no extra text.`;

  const userPrompt = `User Income: ₹${input.income}
Expenses: ${input.expenses}

Respond with a JSON object with these exact fields:
{
  "analysisSummary": "2-3 sentence overview of the expense analysis",
  "keyFindings": ["finding 1 with data", "finding 2 with data", "finding 3 with data"],
  "actionableRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"],
  "celebratingWins": "specific praise for positive spending patterns",
  "gentleChallenges": "areas to improve, phrased supportively",
  "nextWeekForecast": "predicted spending patterns and preventive suggestions"
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
  const parsed = ExpenseAnalysisOutputSchema.parse(JSON.parse(raw));
  return parsed;
}
