import { Agent } from '@ai-sdk-tools/agents';
import { InMemoryProvider } from '@ai-sdk-tools/memory/in-memory';
import { chatModel } from './provider';
import { resumeToolsWithArtifacts, setCurrentResumeContext } from './tools-with-artifacts';
import { getResumeCreationPrompt, getResumeEditingPrompt } from './prompts';
import type { Resume } from '@/lib/models/resume';

/**
 * Resume Agent Context
 * Provides context about the current resume being worked on
 */
export interface ResumeAgentContext {
  resumeId?: string | null;
  userId?: string;
}

/**
 * Create Resume Agent
 * Uses @ai-sdk-tools/agents for proper agent implementation
 * Includes memory system for persistent context
 */
export function createResumeAgent(resumeId?: string | null): Agent<ResumeAgentContext> {
  // Set resume context for tools
  setCurrentResumeContext(resumeId);

  // Determine instructions based on whether we're editing or creating
  const instructions = resumeId
    ? getResumeEditingPrompt({
        id: resumeId,
        title: '',
        personalInfo: { name: '' },
        sections: [],
        template: 'default',
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastEdited: new Date().toISOString(),
          version: 1,
        },
      })
    : getResumeCreationPrompt();

  return new Agent<ResumeAgentContext>({
    name: resumeId ? 'Resume Editor' : 'Resume Creator',
    model: chatModel,
    instructions: (context) => {
      // Context-aware instructions
      if (context?.resumeId) {
        return `${instructions}\n\nYou are currently working on resume ID: ${context.resumeId}`;
      }
      return instructions;
    },
    tools: resumeToolsWithArtifacts,
    maxTurns: 10, // Maximum tool call iterations
    memory: {
      provider: new InMemoryProvider(),
      workingMemory: {
        enabled: true,
        scope: 'chat', // Chat-level memory for resume context
      },
      history: {
        enabled: true,
        limit: 20, // Keep last 20 messages for context
      },
      chats: {
        enabled: true,
        generateTitle: true, // Auto-generate chat titles
      },
    },
    onEvent: (event) => {
      // Log agent events for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('[Resume Agent Event]', {
          type: event.type,
          agent: event.agent?.name,
          ...(event.type === 'agent-handoff' && {
            from: event.from,
            to: event.to,
          }),
        });
      }
    },
  });
}

/**
 * Create specialized agents for different resume tasks
 * This enables handoff patterns for complex workflows
 */
export function createResumeAgents() {
  // Agent for gathering personal information
  const personalInfoAgent = new Agent<ResumeAgentContext>({
    name: 'Personal Info Collector',
    model: chatModel,
    instructions: 'Focus on collecting personal information: name, contact details, location, and professional links. Be thorough and ask clarifying questions.',
    tools: {
      initializeResume: resumeToolsWithArtifacts.initializeResume,
      updatePersonalInfo: resumeToolsWithArtifacts.updatePersonalInfo,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
    },
    maxTurns: 5,
    matchOn: ['name', 'email', 'phone', 'contact', 'personal', 'linkedin', 'github'],
  });

  // Agent for work experience
  const experienceAgent = new Agent<ResumeAgentContext>({
    name: 'Experience Specialist',
    model: chatModel,
    instructions: 'Focus on collecting and organizing work experience. Help users articulate their achievements and responsibilities clearly.',
    tools: {
      addExperience: resumeToolsWithArtifacts.addExperience,
      createResumeSection: resumeToolsWithArtifacts.createResumeSection,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
    },
    maxTurns: 5,
    matchOn: ['experience', 'work', 'job', 'employment', 'career', 'position', 'company'],
  });

  // Agent for education
  const educationAgent = new Agent<ResumeAgentContext>({
    name: 'Education Specialist',
    model: chatModel,
    instructions: 'Focus on collecting education details: degrees, institutions, dates, and academic achievements.',
    tools: {
      addEducation: resumeToolsWithArtifacts.addEducation,
      createResumeSection: resumeToolsWithArtifacts.createResumeSection,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
    },
    maxTurns: 5,
    matchOn: ['education', 'degree', 'university', 'college', 'school', 'gpa', 'graduation'],
  });

  // Agent for skills and projects
  const skillsAgent = new Agent<ResumeAgentContext>({
    name: 'Skills & Projects Specialist',
    model: chatModel,
    instructions: 'Focus on collecting technical skills, soft skills, and project details. Help users showcase their capabilities effectively.',
    tools: {
      addSkills: resumeToolsWithArtifacts.addSkills,
      addProject: resumeToolsWithArtifacts.addProject,
      createResumeSection: resumeToolsWithArtifacts.createResumeSection,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
    },
    maxTurns: 5,
    matchOn: ['skill', 'project', 'technology', 'programming', 'language', 'framework', 'tool'],
  });

  // Main orchestrator agent that routes to specialists
  const orchestrator = new Agent<ResumeAgentContext>({
    name: 'Resume Assistant',
    model: chatModel,
    instructions: (context) => {
      const basePrompt = context?.resumeId
        ? getResumeEditingPrompt({
            id: context.resumeId,
            title: '',
            personalInfo: { name: '' },
            sections: [],
            template: 'default',
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastEdited: new Date().toISOString(),
              version: 1,
            },
          })
        : getResumeCreationPrompt();

      return `${basePrompt}\n\nYou can route complex tasks to specialized agents, or handle them yourself for simple requests.`;
    },
    tools: resumeToolsWithArtifacts, // Full access to all tools
    handoffs: [personalInfoAgent, experienceAgent, educationAgent, skillsAgent],
    maxTurns: 10,
    maxRounds: 3, // Allow up to 3 handoffs
  });

  return {
    orchestrator,
    personalInfoAgent,
    experienceAgent,
    educationAgent,
    skillsAgent,
  };
}
