'use server';

/**
 * @fileOverview A diary analysis AI agent that extracts productivity insights, mood patterns, and daily routines from diary entries.
 *
 * - diaryAnalysisAndRecommendations - A function that handles the diary analysis process.
 * - DiaryAnalysisInput - The input type for the diaryAnalysisAndRecommendations function.
 * - DiaryAnalysisOutput - The return type for the diaryAnalysisAndRecommendations function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const DiaryAnalysisInputSchema = z.object({
  diaryEntries: z
    .string()
    .describe('A string containing all the diary entries to analyze.'),
});
export type DiaryAnalysisInput = z.infer<typeof DiaryAnalysisInputSchema>;

const DiaryAnalysisOutputSchema = z.object({
  analysisSummary: z.string().describe('A 2-3 sentence overview of the diary analysis.'),
  keyFindings: z
    .array(z.string())
    .describe('Key findings from the diary analysis with data points.'),
  actionableRecommendations: z
    .array(z.string())
    .describe('Actionable recommendations based on the diary analysis.'),
  celebratingWins: z.string().describe('Specific praise for positive patterns observed.'),
  gentleChallenges: z.string().describe('Areas to improve, phrased supportively.'),
  nextWeekForecast: z.string().describe('Predicted patterns and preventive suggestions.'),
});
export type DiaryAnalysisOutput = z.infer<typeof DiaryAnalysisOutputSchema>;

export async function diaryAnalysisAndRecommendations(
  input: DiaryAnalysisInput
): Promise<DiaryAnalysisOutput> {
  return diaryAnalysisFlow(input);
}

const diaryAnalysisPrompt = ai.definePrompt({
  name: 'diaryAnalysisPrompt',
  input: {schema: DiaryAnalysisInputSchema},
  output: {schema: DiaryAnalysisOutputSchema},
  prompt: `You are a Personal AI Agent specialized in analyzing user diary entries.

Analyze the following diary entries to identify mood trends, work patterns, and stress triggers. Provide personalized recommendations for improving productivity and overall well-being.

Make sure the output is formatted as follows:

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

Diary Entries:
{{{diaryEntries}}}`,
});

const diaryAnalysisFlow = ai.defineFlow(
  {
    name: 'diaryAnalysisFlow',
    inputSchema: DiaryAnalysisInputSchema,
    outputSchema: DiaryAnalysisOutputSchema,
  },
  async input => {
    const {output} = await diaryAnalysisPrompt(input);
    return output!;
  }
);
