import { z } from 'zod';

/**
 * Zod schema for Alumni Search Result
 * Ensures no fake confidence scores & mandatory explainable match reasons.
 */
export const AlumniMatchSchema = z.object({
  alumniId: z.string(),
  name: z.string(),
  role: z.string(),
  company: z.string(),
  matchedSkills: z.array(z.string()),
  reason: z.string().min(1, "Must provide a clear, human-understandable reason for the match")
});

export const AlumniSearchResultSchema = z.object({
  query: z.string(),
  extractedIntent: z.object({
    studentSkills: z.array(z.string()),
    targetDomain: z.string()
  }),
  matches: z.array(AlumniMatchSchema)
});
