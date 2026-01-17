import { tool } from 'ai';
import { z } from 'zod';
import type { Resume, ResumeSection, Experience, Education, Skill, Project } from '@/lib/models/resume';
import {
  getResumeServer,
  saveResumeServer,
  createResumeServer,
} from '@/lib/storage/resume-store-server';
import {
  experienceSchema,
  educationSchema,
  projectSchema,
} from '@/lib/models/resume';
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
function getCurrentResume(): Resume | null {
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
        const newResume = createResumeServer({
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
          resume: newResume,
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
        const updated = saveResumeServer(resume);
        
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
        const updated = saveResumeServer(resume);
        
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
        const updated = saveResumeServer(resume);
        
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
        const updated = saveResumeServer(resume);
        
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
        const updated = saveResumeServer(resume);
        
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

  /**
   * Check workflow progress and determine next steps
   */
  checkWorkflowProgress: tool({
    description: 'Check the current state of the resume and determine what information is missing or what stage of the workflow we\'re at. Use this to guide your next questions.',
    inputSchema: z.object({}),
    execute: async () => {
      const resume = getCurrentResume();
      if (!resume) {
        return {
          success: true,
          stage: 'introduction',
          completed: [],
          missing: ['name', 'target_position', 'all_sections'],
          nextSteps: ['Initialize the resume by asking for name and target position'],
          progress: 0,
        };
      }

      const completed: string[] = [];
      const missing: string[] = [];
      const recommendations: string[] = [];

      // Check personal info
      if (resume.personalInfo.name) completed.push('name');
      else missing.push('name');

      if (resume.personalInfo.email) completed.push('email');
      else missing.push('email');

      if (resume.personalInfo.phone) completed.push('phone');
      else recommendations.push('phone_number');

      if (resume.personalInfo.location) completed.push('location');
      else recommendations.push('location');

      // Check sections
      const sectionTypes = resume.sections.map(s => s.type);
      
      if (sectionTypes.includes('experience')) {
        completed.push('work_experience');
        const expSection = resume.sections.find(s => s.type === 'experience');
        if (expSection && expSection.items.length > 0) {
          completed.push('at_least_one_job');
        } else {
          recommendations.push('add_job_positions');
        }
      } else {
        missing.push('work_experience');
      }

      if (sectionTypes.includes('education')) {
        completed.push('education');
      } else {
        missing.push('education');
      }

      if (sectionTypes.includes('skills')) {
        completed.push('skills');
        const skillsSection = resume.sections.find(s => s.type === 'skills');
        if (skillsSection && skillsSection.items.length === 0) {
          recommendations.push('add_skills');
        }
      } else {
        missing.push('skills');
      }

      if (sectionTypes.includes('projects')) {
        completed.push('projects');
      } else {
        recommendations.push('projects');
      }

      // Determine stage
      let stage = 'introduction';
      let nextSteps: string[] = [];
      
      if (!resume.personalInfo.name) {
        stage = 'introduction';
        nextSteps = ['Ask for name and target position'];
      } else if (missing.includes('email')) {
        stage = 'personal_info';
        nextSteps = ['Gather email, phone, location, and professional links'];
      } else if (missing.includes('work_experience')) {
        stage = 'work_experience';
        nextSteps = ['Start collecting work experience, beginning with most recent position'];
      } else if (missing.includes('education')) {
        stage = 'education';
        nextSteps = ['Collect education details: degrees, institutions, dates'];
      } else if (missing.includes('skills')) {
        stage = 'skills';
        nextSteps = ['Gather technical and soft skills'];
      } else if (!sectionTypes.includes('projects') && !sectionTypes.includes('summary')) {
        stage = 'additional_sections';
        nextSteps = ['Ask about projects, summary, certifications, or other relevant sections'];
      } else {
        stage = 'review';
        nextSteps = ['Review the resume, suggest improvements, and confirm completion'];
      }

      // Calculate progress
      const totalCheckpoints = 8; // name, contact, experience, education, skills, projects, summary, complete
      const completedCheckpoints = 
        (resume.personalInfo.name ? 1 : 0) +
        (resume.personalInfo.email ? 1 : 0) +
        (sectionTypes.includes('experience') ? 1 : 0) +
        (sectionTypes.includes('education') ? 1 : 0) +
        (sectionTypes.includes('skills') ? 1 : 0) +
        (sectionTypes.includes('projects') ? 1 : 0) +
        (sectionTypes.includes('summary') ? 1 : 0) +
        (stage === 'review' || stage === 'complete' ? 1 : 0);
      
      const progress = Math.round((completedCheckpoints / totalCheckpoints) * 100);

      return {
        success: true,
        stage,
        completed,
        missing,
        recommendations,
        nextSteps,
        progress,
        summary: `Resume is ${progress}% complete. Currently at ${stage} stage.`,
      };
    },
  }),
};

