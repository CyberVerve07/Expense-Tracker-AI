'use server';

import { getGroqClient } from '../groq';
import { z } from 'zod';

const PredictionOutputSchema = z.object({
  monthlyPredictions: z.array(z.object({
    month: z.string(),
    projectedExpense: z.number(),
    projectedSavings: z.number()
  })),
  summary: z.string()
});

export type PredictionOutput = z.infer<typeof PredictionOutputSchema>;

export async function generateForecast(expensesData: string, income: number): Promise<PredictionOutput> {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an AI financial forecaster. Based on the user's spending data and income, predict their expenses and savings for the next 6 months. Respond ONLY with valid JSON.`
      },
      {
        role: "user",
        content: `Monthly Income: ${income}\nRecent Expenses: ${expensesData}\n\nProvide 6 months of predictions. Formatted exactly like this JSON: { "monthlyPredictions": [{ "month": "Jan", "projectedExpense": 4000, "projectedSavings": 1000 }], "summary": "Short explanation" }`
      }
    ],
    temperature: 0.5,
    response_format: { type: 'json_object' }
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  return PredictionOutputSchema.parse(JSON.parse(raw));
}
