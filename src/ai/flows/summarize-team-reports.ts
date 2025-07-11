'use server';

/**
 * @fileOverview Summarizes team reports using AI.
 *
 * - summarizeTeamReports - A function that summarizes team reports.
 * - SummarizeTeamReportsInput - The input type for the summarizeTeamReports function.
 * - SummarizeTeamReportsOutput - The return type for the summarizeTeamReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTeamReportsInputSchema = z.object({
  reports: z.array(z.string()).describe('An array of team reports to summarize.'),
});
export type SummarizeTeamReportsInput = z.infer<typeof SummarizeTeamReportsInputSchema>;

const SummarizeTeamReportsOutputSchema = z.object({
  summary: z.string().describe('A summary of the team reports.'),
});
export type SummarizeTeamReportsOutput = z.infer<typeof SummarizeTeamReportsOutputSchema>;

export async function summarizeTeamReports(input: SummarizeTeamReportsInput): Promise<SummarizeTeamReportsOutput> {
  return summarizeTeamReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTeamReportsPrompt',
  input: {schema: SummarizeTeamReportsInputSchema},
  output: {schema: SummarizeTeamReportsOutputSchema},
  prompt: `You are an AI assistant helping a manager summarize team reports.

  Please provide a concise summary of the following team reports:

  {{#each reports}}
  Report:
  {{this}}
  \n---\n
  {{/each}}
  `,
});

const summarizeTeamReportsFlow = ai.defineFlow(
  {
    name: 'summarizeTeamReportsFlow',
    inputSchema: SummarizeTeamReportsInputSchema,
    outputSchema: SummarizeTeamReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
