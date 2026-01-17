import { Agent } from '@ai-sdk-tools/agents';
import { InMemoryProvider } from '@ai-sdk-tools/memory/in-memory';
import { chatModel } from './provider';
import { resumeToolsWithArtifacts, setCurrentResumeContext } from './tools-with-artifacts';
import { getResumeCreationPrompt, getResumeEditingPrompt, getInitialGreeting } from './prompts';
import type { Resume } from '@/lib/models/resume';

/**
 * Resume Agent Context
 * Provides context about the current resume being worked on
 */
export interface ResumeAgentContext extends Record<string, unknown> {
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
  setCurrentResumeContext(resumeId ?? null);

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
      // Context-aware instructions with workflow guidance
      let baseInstructions = instructions;

      if (context?.resumeId) {
        baseInstructions += `\n\nYou are currently working on resume ID: ${context.resumeId}`;
      }

      // Add workflow guidance for proactive questioning
      baseInstructions += `\n\nWORKFLOW GUIDANCE:
- On FIRST message: Start with a warm greeting like: "${getInitialGreeting()}" Then immediately ask for name and target position.
- ALWAYS start your response by checking progress with checkWorkflowProgress tool (unless it's the very first message and no resume exists yet)
- After each check, ask the NEXT appropriate question from the workflow
- Be proactive: Don't wait for the user to tell you what to ask next
- After gathering information, immediately use the appropriate tool
- Celebrate milestones: "Great!", "Excellent!", "Perfect!", "That's impressive!"
- Guide naturally: "Now let's move on to..." or "Next, I'd like to know about..."
- Ask ONE question at a time to keep the conversation focused
- Use checkWorkflowProgress periodically (every 2-3 exchanges) to see what's missing and what to ask next
- When user provides name and target position, immediately use initializeResume tool, then continue with next questions

Remember: You're an enthusiastic guide, not a passive form filler. Lead the conversation with energy and encouragement!`;

      return baseInstructions;
    },
    tools: resumeToolsWithArtifacts,
    maxTurns: 15, // Increased for more conversational depth
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
    instructions: `You're the Personal Information Specialist! Your role is to collect contact details and professional links with enthusiasm.

APPROACH:
- Ask engagingly: "What's your email address?" (one at a time)
- After each answer, immediately use updatePersonalInfo tool
- Celebrate completion: "Perfect! Now let's get your phone number..."
- Be encouraging: "Great contact info! Any professional links you'd like to include?"

Ask for (in order):
1. Email address
2. Phone number  
3. Location/city
4. LinkedIn profile (if they have one)
5. GitHub/Portfolio links (if applicable)

Always use tools immediately after gathering each piece of information!`,
    tools: {
      initializeResume: resumeToolsWithArtifacts.initializeResume,
      updatePersonalInfo: resumeToolsWithArtifacts.updatePersonalInfo,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
      checkWorkflowProgress: resumeToolsWithArtifacts.checkWorkflowProgress,
    },
    maxTurns: 8,
    matchOn: ['name', 'email', 'phone', 'contact', 'personal', 'linkedin', 'github', 'location', 'address'],
  });

  // Agent for work experience
  const experienceAgent = new Agent<ResumeAgentContext>({
    name: 'Experience Specialist',
    model: chatModel,
    instructions: `You're the Work Experience Expert! Help users showcase their professional journey effectively.

APPROACH:
- Start with most recent position: "Tell me about your most recent job"
- Ask ONE question at a time, conversationally:
  1. "What was your job title?"
  2. "What company did you work for?"
  3. "When did you start? (and when did you end, or is it current?)"
  4. "What were your main responsibilities?"
  5. "Any achievements or results you're proud of? (quantify if possible!)"

- After collecting ALL details for a position, use addExperience tool immediately
- Celebrate: "That's impressive! Any other positions to add?"
- Encourage specifics: "Try to include numbers, percentages, or concrete results"

Be supportive and help them articulate their achievements!`,
    tools: {
      addExperience: resumeToolsWithArtifacts.addExperience,
      createResumeSection: resumeToolsWithArtifacts.createResumeSection,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
      checkWorkflowProgress: resumeToolsWithArtifacts.checkWorkflowProgress,
    },
    maxTurns: 10,
    matchOn: ['experience', 'work', 'job', 'employment', 'career', 'position', 'company', 'role', 'worked'],
  });

  // Agent for education
  const educationAgent = new Agent<ResumeAgentContext>({
    name: 'Education Specialist',
    model: chatModel,
    instructions: `You're the Education Expert! Help users highlight their educational background effectively.

APPROACH:
- Ask conversationally, one question at a time:
  1. "What's your highest level of education?"
  2. "What degree did you earn? (e.g., Bachelor of Science in Computer Science)"
  3. "Which institution did you attend?"
  4. "When did you graduate? (or expected graduation date)"
  5. "Any honors, GPA worth mentioning, or relevant coursework?"

- After gathering complete details, use addEducation tool immediately
- Ask: "Any other degrees or certifications from educational institutions?"
- Be encouraging: "Education is a strong foundation!"

Help them present their educational achievements professionally!`,
    tools: {
      addEducation: resumeToolsWithArtifacts.addEducation,
      createResumeSection: resumeToolsWithArtifacts.createResumeSection,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
      checkWorkflowProgress: resumeToolsWithArtifacts.checkWorkflowProgress,
    },
    maxTurns: 8,
    matchOn: ['education', 'degree', 'university', 'college', 'school', 'gpa', 'graduation', 'studied', 'major'],
  });

  // Agent for skills and projects
  const skillsAgent = new Agent<ResumeAgentContext>({
    name: 'Skills & Projects Specialist',
    model: chatModel,
    instructions: `You're the Skills & Projects Expert! Help users showcase their technical abilities and notable work.

FOR SKILLS:
- Ask engagingly: "What are your strongest technical or hard skills?"
- Follow up: "What soft skills or professional competencies would you highlight?"
- Categorize skills appropriately (technical vs soft)
- Use addSkills tool after gathering all skills
- Encourage: "Skills are crucial for getting noticed!"

FOR PROJECTS:
- Ask: "Do you have any notable projects or portfolio work?"
- For each project, gather:
  1. Project name
  2. Brief description
  3. Technologies used
  4. Key outcomes or results
- Use addProject tool for each project
- Ask: "Any other projects worth highlighting?"

Be enthusiastic about helping them showcase their capabilities!`,
    tools: {
      addSkills: resumeToolsWithArtifacts.addSkills,
      addProject: resumeToolsWithArtifacts.addProject,
      createResumeSection: resumeToolsWithArtifacts.createResumeSection,
      getResumeContext: resumeToolsWithArtifacts.getResumeContext,
      checkWorkflowProgress: resumeToolsWithArtifacts.checkWorkflowProgress,
    },
    maxTurns: 10,
    matchOn: ['skill', 'project', 'technology', 'programming', 'language', 'framework', 'tool', 'portfolio', 'built'],
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
  });

  return {
    orchestrator,
    personalInfoAgent,
    experienceAgent,
    educationAgent,
    skillsAgent,
  };
}
