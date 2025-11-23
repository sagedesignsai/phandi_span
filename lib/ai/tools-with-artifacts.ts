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
export function getCurrentResume(): Resume | null {
  if (!currentResumeId) return null;
  return getResumeServer(currentResumeId);
}

/**
 * Enhanced AI SDK Tools with artifact streaming for resume operations
 * Updated for WYSIWYG editor compatibility
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
          message: `Created new resume: ${newResume.title}. You can now add sections and content.`,
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
    description: 'Update personal information fields (name, email, phone, location, links). Can update multiple fields at once.',
    inputSchema: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      website: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      portfolio: z.string().url().optional(),
    }),
    execute: async (updates) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined) {
            resume.personalInfo[key as keyof typeof resume.personalInfo] = value;
          }
        });
        const updated = saveResumeServer(resume);
        
        const updatedFields = Object.keys(updates).filter(key => updates[key as keyof typeof updates] !== undefined);
        return {
          success: true,
          message: `Updated personal information: ${updatedFields.join(', ')}`,
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
   * Update resume title
   */
  updateResumeTitle: tool({
    description: 'Update the resume title or target position',
    inputSchema: z.object({
      title: z.string().describe('New resume title'),
    }),
    execute: async ({ title }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        resume.title = title;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Updated resume title to: ${title}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update resume title',
        };
      }
    },
  }),

  /**
   * Change template
   */
  changeTemplate: tool({
    description: 'Change the resume template (default, modern, classic, minimalist)',
    inputSchema: z.object({
      template: z.enum(['default', 'modern', 'classic', 'minimalist']).describe('Template to use'),
    }),
    execute: async ({ template }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        resume.template = template;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Changed template to: ${template}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to change template',
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
   * Update section title
   */
  updateSectionTitle: tool({
    description: 'Update the title of an existing section',
    inputSchema: z.object({
      sectionId: z.string().describe('ID of the section to update'),
      title: z.string().describe('New section title'),
    }),
    execute: async ({ sectionId, title }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const section = resume.sections.find((s) => s.id === sectionId);
        if (!section) {
          return { success: false, error: 'Section not found' };
        }

        section.title = title;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Updated section title to: ${title}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update section title',
        };
      }
    },
  }),

  /**
   * Delete a section
   */
  deleteSection: tool({
    description: 'Delete a section from the resume',
    inputSchema: z.object({
      sectionId: z.string().describe('ID of the section to delete'),
    }),
    execute: async ({ sectionId }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const sectionIndex = resume.sections.findIndex((s) => s.id === sectionId);
        if (sectionIndex === -1) {
          return { success: false, error: 'Section not found' };
        }

        const sectionTitle = resume.sections[sectionIndex].title;
        resume.sections.splice(sectionIndex, 1);
        
        // Reorder remaining sections
        resume.sections.forEach((s, index) => {
          s.order = index;
        });

        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Deleted section: ${sectionTitle}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete section',
        };
      }
    },
  }),

  /**
   * Reorder sections
   */
  reorderSections: tool({
    description: 'Reorder sections in the resume',
    inputSchema: z.object({
      sectionIds: z.array(z.string()).describe('Array of section IDs in the desired order'),
    }),
    execute: async ({ sectionIds }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const reorderedSections = sectionIds
          .map((id) => resume.sections.find((s) => s.id === id))
          .filter((s): s is ResumeSection => s !== undefined);

        // Add any sections not in the list at the end
        resume.sections.forEach((section) => {
          if (!sectionIds.includes(section.id)) {
            reorderedSections.push(section);
          }
        });

        // Update order values
        reorderedSections.forEach((section, index) => {
          section.order = index;
        });

        resume.sections = reorderedSections;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: 'Reordered sections',
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to reorder sections',
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
   * Update an experience entry
   */
  updateExperience: tool({
    description: 'Update an existing work experience entry',
    inputSchema: experienceSchema.extend({
      sectionId: z.string().optional().describe('ID of the section containing the experience'),
    }),
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const section = resume.sections.find((s) => s.type === 'experience');
        if (!section) {
          return { success: false, error: 'Experience section not found' };
        }

        const itemIndex = section.items.findIndex(
          (item) => typeof item === 'object' && 'id' in item && item.id === data.id
        );
        if (itemIndex === -1) {
          return { success: false, error: 'Experience entry not found' };
        }

        section.items[itemIndex] = data;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Updated experience: ${data.position} at ${data.company}`,
          experience: data,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update experience',
        };
      }
    },
  }),

  /**
   * Delete an experience entry
   */
  deleteExperience: tool({
    description: 'Delete a work experience entry',
    inputSchema: z.object({
      experienceId: z.string().describe('ID of the experience to delete'),
    }),
    execute: async ({ experienceId }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const section = resume.sections.find((s) => s.type === 'experience');
        if (!section) {
          return { success: false, error: 'Experience section not found' };
        }

        const itemIndex = section.items.findIndex(
          (item) => typeof item === 'object' && 'id' in item && item.id === experienceId
        );
        if (itemIndex === -1) {
          return { success: false, error: 'Experience entry not found' };
        }

        const experience = section.items[itemIndex] as Experience;
        section.items.splice(itemIndex, 1);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Deleted experience: ${experience.position} at ${experience.company}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete experience',
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
   * Update an education entry
   */
  updateEducation: tool({
    description: 'Update an existing education entry',
    inputSchema: educationSchema,
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const section = resume.sections.find((s) => s.type === 'education');
        if (!section) {
          return { success: false, error: 'Education section not found' };
        }

        const itemIndex = section.items.findIndex(
          (item) => typeof item === 'object' && 'id' in item && item.id === data.id
        );
        if (itemIndex === -1) {
          return { success: false, error: 'Education entry not found' };
        }

        section.items[itemIndex] = data;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Updated education: ${data.degree} from ${data.institution}`,
          education: data,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update education',
        };
      }
    },
  }),

  /**
   * Add skills
   */
  addSkills: tool({
    description: 'Add skills to the skills section. Can add multiple skills at once.',
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
   * Remove a skill
   */
  removeSkill: tool({
    description: 'Remove a skill from the skills section',
    inputSchema: z.object({
      skillId: z.string().describe('ID of the skill to remove'),
    }),
    execute: async ({ skillId }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const section = resume.sections.find((s) => s.type === 'skills');
        if (!section) {
          return { success: false, error: 'Skills section not found' };
        }

        const itemIndex = section.items.findIndex(
          (item) => typeof item === 'object' && 'id' in item && item.id === skillId
        );
        if (itemIndex === -1) {
          return { success: false, error: 'Skill not found' };
        }

        const skill = section.items[itemIndex] as Skill;
        section.items.splice(itemIndex, 1);
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Removed skill: ${skill.name}`,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to remove skill',
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
   * Update a project
   */
  updateProject: tool({
    description: 'Update an existing project',
    inputSchema: projectSchema,
    execute: async (data) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        const section = resume.sections.find((s) => s.type === 'projects');
        if (!section) {
          return { success: false, error: 'Projects section not found' };
        }

        const itemIndex = section.items.findIndex(
          (item) => typeof item === 'object' && 'id' in item && item.id === data.id
        );
        if (itemIndex === -1) {
          return { success: false, error: 'Project not found' };
        }

        section.items[itemIndex] = data;
        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: `Updated project: ${data.name}`,
          project: data,
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update project',
        };
      }
    },
  }),

  /**
   * Add or update summary
   */
  updateSummary: tool({
    description: 'Add or update the professional summary section',
    inputSchema: z.object({
      summary: z.string().describe('Professional summary text'),
    }),
    execute: async ({ summary }) => {
      const resume = getCurrentResume();
      if (!resume) {
        return { success: false, error: 'No resume context. Please initialize a resume first.' };
      }

      try {
        let section = resume.sections.find((s) => s.type === 'summary');
        if (!section) {
          section = {
            id: `section-${Date.now()}`,
            type: 'summary',
            title: 'Professional Summary',
            items: [summary],
            order: resume.sections.length,
          };
          resume.sections.push(section);
        } else {
          section.items = [summary];
        }

        const updated = saveResumeServer(resume);
        
        return {
          success: true,
          message: 'Updated professional summary',
          resume: updated,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update summary',
        };
      }
    },
  }),

  /**
   * Get current resume context
   */
  getResumeContext: tool({
    description: 'Retrieve the current state of the resume being worked on. Use this to check what content exists before making changes.',
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
          template: resume.template,
          personalInfo: resume.personalInfo,
          sections: resume.sections.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            itemCount: s.items.length,
            order: s.order,
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
