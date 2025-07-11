'use server';

/**
 * @fileOverview AI chatbot flow for managers to track task statuses and get results using prompts.
 *
 * - trackTasksWithChatbot - A function that handles the chatbot interaction to track tasks.
 * - TrackTasksWithChatbotInput - The input type for the trackTasksWithChatbot function.
 * - TrackTasksWithChatbotOutput - The return type for the trackTasksWithChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrackTasksWithChatbotInputSchema = z.object({
  query: z.string().describe('The query from the manager to track tasks.'),
});
export type TrackTasksWithChatbotInput = z.infer<typeof TrackTasksWithChatbotInputSchema>;

const TrackTasksWithChatbotOutputSchema = z.object({
  response: z.string().describe('The response from the AI chatbot based on the query.'),
});
export type TrackTasksWithChatbotOutput = z.infer<typeof TrackTasksWithChatbotOutputSchema>;

export async function trackTasksWithChatbot(input: TrackTasksWithChatbotInput): Promise<TrackTasksWithChatbotOutput> {
  return trackTasksWithChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trackTasksWithChatbotPrompt',
  input: {schema: TrackTasksWithChatbotInputSchema},
  output: {schema: TrackTasksWithChatbotOutputSchema},
  prompt: `You are an AI chatbot assistant for managers to track tasks and provide results.
  The manager will provide a query, and you should respond with the appropriate information about the tasks.
  
  Query: {{{query}}}
  `,
});

const trackTasksWithChatbotFlow = ai.defineFlow(
  {
    name: 'trackTasksWithChatbotFlow',
    inputSchema: TrackTasksWithChatbotInputSchema,
    outputSchema: TrackTasksWithChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
