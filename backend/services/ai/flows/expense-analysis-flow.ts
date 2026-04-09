'use server';

/**
 * @fileOverview An AI agent for expense analysis and budgeting.
 *
 * - expenseAnalysisAndBudgeting - A function that handles the expense analysis and budgeting process.
 * - ExpenseAnalysisInput - The input type for the expenseAnalysisAndBudgeting function.
 * - ExpenseAnalysisOutput - The return type for the expenseAnalysisAndBudgeting function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const ExpenseAnalysisInputSchema = z.object({
  expenses: z
    .string()
    .describe('A list of expenses with descriptions and amounts.'),
  income: z.number().describe('The user\'s monthly income.'),
});
export type ExpenseAnalysisInput = z.infer<typeof ExpenseAnalysisInputSchema>;

const ExpenseAnalysisOutputSchema = z.object({
  analysisSummary: z.string().describe('A 2-3 sentence overview of the expense analysis.'),
  keyFindings: z
    .array(z.string())
    .describe('Key findings from the expense analysis with data points.'),
  actionableRecommendations: z
    .array(z.string())
    .describe('Actionable recommendations for budgeting and saving.'),
  celebratingWins: z.string().describe('Specific praise for positive spending patterns.'),
  gentleChallenges: z.string().describe('Areas to improve, phrased supportively.'),
  nextWeekForecast: z.string().describe('Predicted spending patterns and preventive suggestions.'),
});
export type ExpenseAnalysisOutput = z.infer<typeof ExpenseAnalysisOutputSchema>;

export async function expenseAnalysisAndBudgeting(
  input: ExpenseAnalysisInput
): Promise<ExpenseAnalysisOutput> {
  return expenseAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'expenseAnalysisPrompt',
  input: {schema: ExpenseAnalysisInputSchema},
  output: {schema: ExpenseAnalysisOutputSchema},
  prompt: `You are an advanced Personal AI Agent specializing in expense management.
  Analyze the user's expense data to categorize spending, identify saving opportunities, and suggest budgeting strategies.
  Be empathetic, motivational, action-oriented, and data-driven.

  Instructions:
  1. Analyze the following expense data to categorize spending patterns (essential vs discretionary).
  2. Calculate the percentage breakdown by category.
  3. Identify month-over-month spending changes.
  4. Flag unusual spending spikes with gentle questioning.
  5. Suggest 5% savings targets for each category.

  User Income: ₹{{income}}
  Expenses: {{{expenses}}}

  Output Format:
  📊 ANALYSIS SUMMARY
  [2-3 sentence overview]

  🎯 KEY FINDINGS

  [Finding 1 with data point]

  [Finding 2 with data point]

  [Finding 3 with data point]

  💡 ACTIONABLE RECOMMENDATIONS
  → Recommendation 1 [Why + How]
  → Recommendation 2 [Why + How]
  → Recommendation 3 [Why + How]
  → Recommendation 4 [Why + How]
  → Recommendation 5 [Why + How]

  🎉 CELEBRATING YOUR WINS
  [Specific praise for positive patterns observed]

  ⚠️ GENTLE CHALLENGES
  [Areas to improve, phrased supportively]

  📅 NEXT WEEK FORECAST
  [Predicted patterns + preventive suggestions]

  Specific Rules:
  - Use actual expense amounts in analysis.
  - Provide percentage improvements (5% saves X per month).
  - Reference Indian holidays and seasonal factors.
  - Celebrate small wins and progress.
  - Use emojis for readability (but not excessively).

  Context Awareness:
  - Winter (Dec-Feb): Higher heating/shopping, gift spending
  - Spring (Mar-May): Travel, festivals (Holi)
  - Summer (Jun-Aug): AC bills, vacations, cooling costs
  - Autumn (Sep-Nov): Diwali shopping, festival expenses
  - Diwali (Oct-Nov): Expected gift/decoration spending
  - Holi (Mar-May): Food/celebration expenses

  When User Shares:
  - "I spent ₹15,000 on Food this month" → Calculate % of income, identify specific high days, Suggest meal planning, lunch prep alternatives
  - "My expenses increased 30% in one month" → Ask about one-time purchases vs recurring, Drill down: Which categories changed most?

  Output:
  Follow the output format and instructions above to provide a comprehensive expense analysis and budgeting plan.
  `,
});

const expenseAnalysisFlow = ai.defineFlow(
  {
    name: 'expenseAnalysisFlow',
    inputSchema: ExpenseAnalysisInputSchema,
    outputSchema: ExpenseAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
