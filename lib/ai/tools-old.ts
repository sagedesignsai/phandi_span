import { tool } from 'ai';
import { z } from 'zod';
import type { BlockResume } from '@/lib/models/resume';
import type { Block, HeaderBlockData, ExperienceBlockData, EducationBlockData, SkillBlockData } from '@/lib/resume/editor/block-types';
import { createBlockResume, createDefaultBlock } from '@/lib/resume/editor/block-serialization';
import {
  getResume,
  saveResume,
  createResume,
} from '@/lib/storage/resume-store';

// Context to store current resume being worked on
// Note: This is a simple in-memory store for the current session
// In production, you'd want to use a proper session store or pass resumeId through context
let currentResumeId: string | null = null;

/**
 * Set the current resume context
 */
export function setCurrentResumeContext(resumeId: string | null) {
  currentResumeId = resumeId;
}

/**
 * Get the current resume context
 */
function getCurrentResume(): BlockResume | null {
  if (!currentResumeId) return null;
  return getResume(currentResumeId);
}

/**
 * AI SDK Tools for resume operations
 */
export const resumeTools = {
  /**
   * Create or initialize a new resume
   */
  initializeResume: tool({
    description: 'Initialize a new resume with basic information. Use this at the start of resume creation.',
    inputSchema: z.object({
      name: z.string().describe('Full name of the person'),
      title: z.string().optional().describe('Job title or target position'),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
    }),
    execute: async ({ name, title, email, phone, location }) => {
      try {
        const newResume = createResume({
          title: title || `${name}'s Resume`,
          personalInfo: {
            name,
            email,
            phone,
            location,
          },
          sections: [],
          template: 'default',
        });

        currentResumeId = newResume.id;
        return {
          success: true,
          resumeId: newResume.id,
          message: `Created new resume: ${newResume.title}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create resume',
        };
      }
    },
  }),

  /**
   * Update personal information
   */
  updatePersonalInfo: tool({
    description: 'Update personal information fields (name, email, phone, location, links)',
    inputSchema: z.object({
      field: z.enum(['name', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'portfolio']),
      value: z.string(),
    }),
    execute: async ({ field, value }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        resume.personalInfo[field] = value;
        const updated = saveResume(resume);
        return {
          success: true,
          message: `Updated ${field} to ${value}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update personal info',
        };
      }
    },
  }),

  /**
   * Create a new resume section
   */
  createResumeSection: tool({
    description: 'Add a new section to the resume (experience, education, skills, projects, etc.)',
    inputSchema: z.object({
      type: z.enum(['experience', 'education', 'skills', 'projects', 'summary', 'certifications', 'languages', 'custom']),
      title: z.string().describe('Section title (e.g., "Work Experience", "Education")'),
      items: z.array(z.any()).optional().describe('Initial items to add to the section'),
    }),
    execute: async ({ type, title, items = [] }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const newSection: ResumeSection = {
          id: `section-${Date.now()}`,
          type,
          title,
          items: items || [],
          order: resume.sections.length,
        };

        resume.sections.push(newSection);
        const updated = saveResume(resume);
        return {
          success: true,
          message: `Added section: ${title}`,
          section: newSection,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create section',
        };
      }
    },
  }),

  /**
   * Add an experience entry
   */
  addExperience: tool({
    description: 'Add a work experience entry to the experience section',
    inputSchema: experienceSchema.omit({ id: true }).extend({
      sectionId: z.string().optional().describe('ID of the section to add to (if section exists)'),
    }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const experience: Experience = {
          ...data,
          id: `exp-${Date.now()}`,
        };

        // Find or create experience section
        let section = resume.sections.find((s) => s.type === 'experience');
        if (!section) {
          section = {
            id: `section-${Date.now()}`,
            type: 'experience',
            title: 'Work Experience',
            items: [],
            order: resume.sections.length,
          };
          resume.sections.push(section);
        }

        section.items.push(experience);
        const updated = saveResume(resume);
        return {
          success: true,
          message: `Added experience: ${experience.position} at ${experience.company}`,
          experience,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to add experience',
        };
      }
    },
  }),

  /**
   * Add an education entry
   */
  addEducation: tool({
    description: 'Add an education entry to the education section',
    inputSchema: educationSchema.omit({ id: true }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const education: Education = {
          ...data,
          id: `edu-${Date.now()}`,
        };

        // Find or create education section
        let section = resume.sections.find((s) => s.type === 'education');
        if (!section) {
          section = {
            id: `section-${Date.now()}`,
            type: 'education',
            title: 'Education',
            items: [],
            order: resume.sections.length,
          };
          resume.sections.push(section);
        }

        section.items.push(education);
        const updated = saveResume(resume);
        return {
          success: true,
          message: `Added education: ${education.degree} from ${education.institution}`,
          education,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to add education',
        };
      }
    },
  }),

  /**
   * Add skills
   */
  addSkills: tool({
    description: 'Add skills to the skills section',
    inputSchema: z.object({
      skills: z.array(
        z.object({
          name: z.string(),
          category: z.string().optional(),
          level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
        })
      ),
    }),
    execute: async ({ skills }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        // Find or create skills section
        let section = resume.sections.find((s) => s.type === 'skills');
        if (!section) {
          section = {
            id: `section-${Date.now()}`,
            type: 'skills',
            title: 'Skills',
            items: [],
            order: resume.sections.length,
          };
          resume.sections.push(section);
        }

        const newSkills: Skill[] = skills.map((skill) => ({
          ...skill,
          id: `skill-${Date.now()}-${Math.random()}`,
        }));

        section.items.push(...newSkills);
        const updated = saveResume(resume);
        return {
          success: true,
          message: `Added ${newSkills.length} skill(s)`,
          skills: newSkills,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to add skills',
        };
      }
    },
  }),

  /**
   * Add a project
   */
  addProject: tool({
    description: 'Add a project to the projects section',
    inputSchema: projectSchema.omit({ id: true }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const project: Project = {
          ...data,
          id: `proj-${Date.now()}`,
        };

        // Find or create projects section
        let section = resume.sections.find((s) => s.type === 'projects');
        if (!section) {
          section = {
            id: `section-${Date.now()}`,
            type: 'projects',
            title: 'Projects',
            items: [],
            order: resume.sections.length,
          };
          resume.sections.push(section);
        }

        section.items.push(project);
        const updated = saveResume(resume);
        return {
          success: true,
          message: `Added project: ${project.name}`,
          project,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to add project',
        };
      }
    },
  }),

  /**
   * Get current resume context
   */
  getResumeContext: tool({
    description: 'Retrieve the current state of the resume being worked on',
    inputSchema: z.object({}),
    execute: async () => {
      const resume = getCurrentResume();
      if (!resume) {
        return {
          success: false,
          error: 'No resume context. Please initialize a resume first.',
        };
      }

      return {
        success: true,
        resume: {
          id: resume.id,
          title: resume.title,
          personalInfo: resume.personalInfo,
          sections: resume.sections.map((s) => ({
            type: s.type,
            title: s.title,
            itemCount: s.items.length,
          })),
        },
      };
    },
  }),

  /**
   * Suggest improvements
   */
  suggestImprovements: tool({
    description: 'Analyze the resume and suggest improvements',
    inputSchema: z.object({
      aspect: z.enum(['content', 'formatting', 'keywords', 'structure']).optional(),
    }),
    execute: async ({ aspect }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context available.' };
      }

      // This would typically use AI to analyze, but for MVP we return basic suggestions
      const suggestions: string[] = [];

      if (resume.sections.length === 0) {
        suggestions.push('Consider adding work experience and education sections');
      }

      if (!resume.personalInfo.email) {
        suggestions.push('Add an email address for contact');
      }

      if (resume.sections.find((s) => s.type === 'skills')?.items.length === 0) {
        suggestions.push('Add relevant skills to highlight your expertise');
      }

      return {
        success: true,
        suggestions,
        aspect: aspect || 'general',
      };
    },
  }),
};

