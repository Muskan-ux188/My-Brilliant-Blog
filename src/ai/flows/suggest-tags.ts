// This file holds the Genkit flow for suggesting relevant tags for a blog post using AI.

'use server';

/**
 * @fileOverview AI-powered tag suggestion for blog posts.
 *
 * - suggestPostTags - A function that suggests relevant tags for a given blog post content.
 * - SuggestPostTagsInput - The input type for the suggestPostTags function.
 * - SuggestPostTagsOutput - The return type for the suggestPostTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostTagsInputSchema = z.object({
  content: z
    .string()
    .describe('The content of the blog post to generate tags for.'),
});
export type SuggestPostTagsInput = z.infer<typeof SuggestPostTagsInputSchema>;

const SuggestPostTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the blog post.'),
});
export type SuggestPostTagsOutput = z.infer<typeof SuggestPostTagsOutputSchema>;

export async function suggestPostTags(input: SuggestPostTagsInput): Promise<SuggestPostTagsOutput> {
  return suggestPostTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostTagsPrompt',
  input: {schema: SuggestPostTagsInputSchema},
  output: {schema: SuggestPostTagsOutputSchema},
  prompt: `You are an AI assistant designed to suggest tags for blog posts.

  Given the content of a blog post, suggest relevant tags that can be used to categorize the content and improve discoverability.  Return a JSON array of strings.

  Blog Post Content: {{{content}}}`,
});

const suggestPostTagsFlow = ai.defineFlow(
  {
    name: 'suggestPostTagsFlow',
    inputSchema: SuggestPostTagsInputSchema,
    outputSchema: SuggestPostTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
