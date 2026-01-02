'use server';

/**
 * @fileOverview Analyzes user diary entries and expense data to provide wellness insights,
 * recommends low-cost alternatives, and generates a personalized wellness plan.
 *
 * - getWellnessInsights - A function that handles the wellness insights and personalized plan generation process.
 * - WellnessInsightsInput - The input type for the getWellnessInsights function.
 * - WellnessInsightsOutput - The return type for the getWellnessInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WellnessInsightsInputSchema = z.object({
  diaryEntries: z.string().describe('A string containing the user diary entries.'),
  expenseData: z.string().describe('A string containing the user expense data.'),
});
export type WellnessInsightsInput = z.infer<typeof WellnessInsightsInputSchema>;

const WellnessInsightsOutputSchema = z.object({
  analysisSummary: z.string().describe('A summary of the wellness insights analysis.'),
  keyFindings: z.array(z.string()).describe('Key findings from the analysis with data points.'),
  actionableRecommendations: z.array(z.string()).describe('Actionable recommendations for the user.'),
  celebratingWins: z.string().describe('Specific praise for positive patterns observed.'),
  gentleChallenges: z.string().describe('Areas to improve, phrased supportively.'),
  nextWeekForecast: z.string().describe('Predicted patterns and preventive suggestions for the next week.'),
});
export type WellnessInsightsOutput = z.infer<typeof WellnessInsightsOutputSchema>;

export async function getWellnessInsights(input: WellnessInsightsInput): Promise<WellnessInsightsOutput> {
  return wellnessInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellnessInsightsPrompt',
  input: {schema: WellnessInsightsInputSchema},
  output: {schema: WellnessInsightsOutputSchema},
  prompt: `You are an advanced Personal AI Agent specializing in analyzing user productivity patterns, expense management, and wellness insights from their diary and expense tracking data. You are empathetic, motivational, action-oriented, and data-driven.

  Analyze the following diary entries and expense data to provide wellness insights, recommend low-cost alternatives, and generate a personalized wellness plan.

  Diary Entries:
  {{diaryEntries}}

  Expense Data:
  {{expenseData}}

  Follow the instructions and rules below to generate wellness insights and a personalized plan.

  PRIMARY RESPONSIBILITIES
  WELLNESS COACHING - Recommend lifestyle improvements based on diary entries

  OUTPUT FORMAT (ALWAYS USE THIS)
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

  SPECIFIC RULES
  ✓ DO:
    - Always cite specific dates/entries from diary
    - Use actual expense amounts in analysis
    - Ask clarifying questions if data is ambiguous
    - Provide percentage improvements (5% saves X per month)
    - Reference Indian holidays and seasonal factors
    - Celebrate small wins and progress
    - Use emojis for readability (but not excessively)

  ✗ DON'T:
    - Share medical/legal advice (suggest consulting professionals)
    - Make assumptions without evidence from the data
    - Be judgmental about spending or lifestyle choices
    - Provide recommendations without data backup
    - Ignore context (e.g., seasonal spending for festivals)
    - Overload with jargon - keep it simple

  CONTEXT AWARENESS
  - Season Recognition:
    * Winter (Dec-Feb): Higher heating/shopping, gift spending
    * Spring (Mar-May): Travel, festivals (Holi)
    * Summer (Jun-Aug): AC bills, vacations, cooling costs
    * Autumn (Sep-Nov): Diwali shopping, festival expenses

  - Indian Festival Sensitivity:
    * Diwali (Oct-Nov): Expected gift/decoration spending
    * Holi (Mar-May): Food/celebration expenses
    * Birthdays/Anniversaries: Plan ahead

  - Work Cycle Awareness:
    * Salary days: Encourage planning/saving rituals
    * Exam seasons: Address stress spending
    * Project deadlines: Sleep/health impacts`,
});

const wellnessInsightsFlow = ai.defineFlow(
  {
    name: 'wellnessInsightsFlow',
    inputSchema: WellnessInsightsInputSchema,
    outputSchema: WellnessInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
