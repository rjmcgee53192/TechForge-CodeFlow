import { z } from 'zod';

export const ChallengeSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.string(),
});

export const LibrarySchema = z.array(ChallengeSchema);

export type Challenge = z.infer<typeof ChallengeSchema>;
export type Library = z.infer<typeof LibrarySchema>;
