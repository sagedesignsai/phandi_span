import { z } from 'zod';

// Career Profile Context Schema - Additional context for AI tools
export const careerProfileContextSchema = z.object({
  // Career Goals
  careerGoals: z.object({
    shortTerm: z.string().optional(), // 1-2 years
    longTerm: z.string().optional(), // 5+ years
    targetRoles: z.array(z.string()).optional(),
    targetIndustries: z.array(z.string()).optional(),
    targetCompanies: z.array(z.string()).optional(),
  }).optional(),

  // Work Preferences
  workPreferences: z.object({
    workType: z.enum(['remote', 'hybrid', 'onsite', 'flexible']).optional(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'freelance']).optional(),
    salaryExpectation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().default('USD'),
    }).optional(),
    willingToRelocate: z.boolean().optional(),
    preferredLocations: z.array(z.string()).optional(),
  }).optional(),

  // Professional Summary
  professionalSummary: z.string().optional(),
  
  // Key Strengths & Unique Value Proposition
  keyStrengths: z.array(z.string()).optional(),
  uniqueValueProposition: z.string().optional(),

  // Career Highlights
  careerHighlights: z.array(z.string()).optional(),

  // Industry Knowledge
  industryExpertise: z.array(z.string()).optional(),
  
  // Soft Skills
  softSkills: z.array(z.string()).optional(),

  // Languages
  languages: z.array(z.object({
    language: z.string(),
    proficiency: z.enum(['basic', 'conversational', 'professional', 'native']),
  })).optional(),

  // Certifications & Licenses
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string().optional(),
    expiryDate: z.string().optional(),
    credentialId: z.string().optional(),
  })).optional(),

  // Additional Context for AI
  additionalContext: z.string().optional(), // Free-form text for any additional context
});

export type CareerProfileContext = z.infer<typeof careerProfileContextSchema>;

// Extended Resume with Career Profile Context
export const careerProfileSchema = z.object({
  context: careerProfileContextSchema,
});

export type CareerProfile = z.infer<typeof careerProfileSchema>;
