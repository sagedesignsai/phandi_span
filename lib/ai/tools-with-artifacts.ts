import { tool } from 'ai';
import { z } from 'zod';
import type { BlockResume } from '@/lib/models/resume';
import type { Block, HeaderBlockData, ExperienceBlockData, EducationBlockData, SkillBlockData, ProjectBlockData } from '@/lib/resume/editor/block-types';
import { createBlockResume, createDefaultBlock } from '@/lib/resume/editor/block-serialization';
import {
  getResumeServer,
  saveResumeServer,
  createResumeServer,
} from '@/lib/storage/resume-store-server';

// Context to store current resume being worked on
let currentResumeId: string | null = null;

/**
 * Set the current resume context
 */
export function setCurrentResumeContext(resumeId: string | null) {
  currentResumeId = resumeId;
}

/**
 * Get the current resume context (server-side)
 */
function getCurrentResume(): BlockResume | null {
  if (!currentResumeId) return null;
  return getResumeServer(currentResumeId);
}

/**
 * Enhanced AI SDK Tools with artifact streaming for resume operations
 */
export const resumeToolsWithArtifacts = {
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
        const newResume = createBlockResume(title || `${name}'s Resume`);
        
        // Update header block with personal info
        const headerBlock = newResume.blocks.find(b => b.type === 'header') as Block;
        if (headerBlock) {
          const headerData = headerBlock.data as HeaderBlockData;
          headerData.name = name;
          headerData.title = title || '';
          headerData.email = email;
          headerData.phone = phone;
          headerData.location = location;
        }

        const savedResume = saveResumeServer(newResume);
        currentResumeId = savedResume.id;
        
        return {
          success: true,
          resumeId: savedResume.id,
          resume: savedResume,
          message: `Created new resume: ${savedResume.title}`,
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
      field: z.enum(['name', 'title', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'portfolio']),
      value: z.string(),
    }),
    execute: async ({ field, value }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const headerBlock = resume.blocks.find(b => b.type === 'header') as Block;
        if (headerBlock) {
          const headerData = headerBlock.data as HeaderBlockData;
          (headerData as any)[field] = value;
        }
        
        const updated = saveResumeServer(resume);
        
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
   * Add an experience entry
   */
  addExperience: tool({
    description: 'Add a work experience entry to the resume',
    inputSchema: z.object({
      company: z.string(),
      position: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
      achievements: z.array(z.string()).optional(),
    }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        // Create experience block
        const expBlock = createDefaultBlock('experience', resume.blocks.length);
        const expData = expBlock.data as ExperienceBlockData;
        
        Object.assign(expData, {
          ...data,
          id: expData.id,
        });

        resume.blocks.push(expBlock);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Added experience: ${data.position} at ${data.company}`,
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
    description: 'Add an education entry to the resume',
    inputSchema: z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string().optional(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      gpa: z.string().optional(),
      honors: z.array(z.string()).optional(),
    }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const eduBlock = createDefaultBlock('education', resume.blocks.length);
        const eduData = eduBlock.data as EducationBlockData;
        
        Object.assign(eduData, {
          ...data,
          id: eduData.id,
        });

        resume.blocks.push(eduBlock);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Added education: ${data.degree} from ${data.institution}`,
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
    description: 'Add skills to the resume',
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
        const skillBlocks = skills.map((skill, index) => {
          const skillBlock = createDefaultBlock('skill', resume.blocks.length + index);
          const skillData = skillBlock.data as SkillBlockData;
          
          Object.assign(skillData, {
            ...skill,
            id: skillData.id,
          });
          
          return skillBlock;
        });

        resume.blocks.push(...skillBlocks);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Added ${skills.length} skill(s)`,
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
    description: 'Add a project to the resume',
    inputSchema: z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()).optional(),
      url: z.string().optional(),
      github: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const projectBlock = createDefaultBlock('project', resume.blocks.length);
        const projectData = projectBlock.data as ProjectBlockData;
        
        Object.assign(projectData, {
          ...data,
          id: projectData.id,
        });

        resume.blocks.push(projectBlock);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Added project: ${data.name}`,
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
   * Create a custom resume section
   */
  createResumeSection: tool({
    description: 'Create a custom section in the resume (e.g., Certifications, Languages, Volunteer Work)',
    inputSchema: z.object({
      title: z.string(),
      sectionType: z.enum(['certifications', 'languages', 'volunteer', 'awards', 'publications', 'custom']),
    }),
    execute: async ({ title, sectionType }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const sectionBlock = createDefaultBlock('section', resume.blocks.length);
        const sectionData = sectionBlock.data as any;
        
        sectionData.title = title;
        sectionData.sectionType = sectionType;

        resume.blocks.push(sectionBlock);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Created section: ${title}`,
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

      const headerBlock = resume.blocks.find(b => b.type === 'header');
      const headerData = headerBlock?.data as HeaderBlockData;

      return {
        success: true,
        resume: {
          id: resume.id,
          title: resume.title,
          personalInfo: headerData ? {
            name: headerData.name,
            email: headerData.email,
            phone: headerData.phone,
            location: headerData.location,
          } : {},
          blockCount: resume.blocks.length,
          blocks: resume.blocks.map(b => ({
            type: b.type,
            id: b.id,
          })),
        },
      };
    },
  }),
};

