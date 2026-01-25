import { tool } from 'ai';
import { z } from 'zod';
import { resumeToolsWithArtifacts, setCurrentResumeContext } from '../tools-with-artifacts';
import { getResumeServer } from '@/lib/storage/resume-store-server';
import type { BlockResume } from '@/lib/models/resume';

let currentResumeIdForTools: string | null = null;

export function setToolsResumeContext(resumeId: string | null) {
  currentResumeIdForTools = resumeId;
  setCurrentResumeContext(resumeId);
}

function getCurrentResume(): BlockResume | null {
  if (!currentResumeIdForTools) return null;
  return getResumeServer(currentResumeIdForTools);
}

/**
 * Workflow Progress Tracker
 */
export const checkWorkflowProgress = tool({
  description: 'Check what sections are complete and what needs to be added next. Use this frequently to guide the conversation.',
  inputSchema: z.object({}),
  execute: async () => {
    const resume = getCurrentResume();
    if (!resume) {
      return {
        stage: 'initialization',
        completed: [],
        missing: ['personal_info', 'experience', 'education', 'skills'],
        nextAction: 'Ask for name and target position to initialize resume',
        progress: 0,
      };
    }

    const completed: string[] = [];
    const missing: string[] = [];
    
    const headerBlock = resume.blocks.find(b => b.type === 'header');
    const headerData = headerBlock?.data as any;
    
    if (headerData?.name) completed.push('personal_info');
    else missing.push('personal_info');
    
    if (headerData?.email && headerData?.phone) completed.push('contact_details');
    else missing.push('contact_details');
    
    if (resume.blocks.some(b => b.type === 'experience')) completed.push('experience');
    else missing.push('experience');
    
    if (resume.blocks.some(b => b.type === 'education')) completed.push('education');
    else missing.push('education');
    
    if (resume.blocks.some(b => b.type === 'skill')) completed.push('skills');
    else missing.push('skills');
    
    const progress = (completed.length / (completed.length + missing.length)) * 100;
    
    let nextAction = '';
    if (missing.includes('personal_info')) {
      nextAction = 'Ask for email, phone, and location';
    } else if (missing.includes('contact_details')) {
      nextAction = 'Ask for complete contact information';
    } else if (missing.includes('experience')) {
      nextAction = 'Ask about most recent work experience';
    } else if (missing.includes('education')) {
      nextAction = 'Ask about education background';
    } else if (missing.includes('skills')) {
      nextAction = 'Ask about technical and soft skills';
    } else {
      nextAction = 'Review and suggest improvements';
    }
    
    return {
      stage: missing.length === 0 ? 'complete' : 'in_progress',
      completed,
      missing,
      nextAction,
      progress: Math.round(progress),
      resumeId: resume.id,
    };
  },
});

/**
 * Resume Analysis & Improvement Suggestions
 */
export const analyzeResume = tool({
  description: 'Analyze the current resume and provide specific improvement suggestions',
  inputSchema: z.object({
    focusArea: z.enum(['all', 'experience', 'skills', 'ats', 'impact']).optional(),
  }),
  execute: async ({ focusArea = 'all' }) => {
    const resume = getCurrentResume();
    if (!resume) {
      return { success: false, error: 'No resume to analyze' };
    }

    const suggestions: string[] = [];
    const strengths: string[] = [];
    
    const experienceBlocks = resume.blocks.filter(b => b.type === 'experience');
    if (experienceBlocks.length > 0) {
      strengths.push(`${experienceBlocks.length} work experience entries`);
      
      experienceBlocks.forEach((block) => {
        const data = block.data as any;
        if (!data.achievements || data.achievements.length === 0) {
          suggestions.push(`Add quantifiable achievements to "${data.position}" role`);
        }
      });
    } else if (focusArea === 'all' || focusArea === 'experience') {
      suggestions.push('Add work experience to strengthen your resume');
    }
    
    const skillBlocks = resume.blocks.filter(b => b.type === 'skill');
    if (skillBlocks.length > 0) {
      strengths.push(`${skillBlocks.length} skills listed`);
      if (skillBlocks.length < 5) {
        suggestions.push('Consider adding more relevant skills (aim for 8-12)');
      }
    }
    
    const hasSummary = resume.blocks.some(b => b.type === 'summary');
    if (!hasSummary) {
      suggestions.push('Add a professional summary to introduce yourself effectively');
    } else {
      strengths.push('Professional summary included');
    }
    
    if (focusArea === 'all' || focusArea === 'ats') {
      const headerBlock = resume.blocks.find(b => b.type === 'header');
      if (headerBlock) {
        const data = headerBlock.data as any;
        if (!data.email || !data.phone) {
          suggestions.push('Add complete contact information for ATS compatibility');
        }
      }
    }
    
    return {
      success: true,
      strengths,
      suggestions,
      score: Math.max(0, 100 - (suggestions.length * 10)),
      focusArea,
    };
  },
});

/**
 * Job Description Matching
 */
export const matchJobDescription = tool({
  description: 'Analyze how well the resume matches a job description and suggest improvements',
  inputSchema: z.object({
    jobDescription: z.string().describe('The job description to match against'),
  }),
  execute: async ({ jobDescription }) => {
    const resume = getCurrentResume();
    if (!resume) {
      return { success: false, error: 'No resume to analyze' };
    }

    const jdLower = jobDescription.toLowerCase();
    const commonKeywords = [
      'leadership', 'management', 'communication', 'teamwork',
      'python', 'javascript', 'react', 'node', 'aws', 'docker',
      'agile', 'scrum', 'ci/cd', 'testing', 'debugging'
    ];
    
    const requiredKeywords = commonKeywords.filter(kw => jdLower.includes(kw));
    const resumeText = JSON.stringify(resume.blocks).toLowerCase();
    const matchedKeywords = requiredKeywords.filter(kw => resumeText.includes(kw));
    const missingKeywords = requiredKeywords.filter(kw => !resumeText.includes(kw));
    
    const matchScore = requiredKeywords.length > 0 
      ? Math.round((matchedKeywords.length / requiredKeywords.length) * 100)
      : 0;
    
    return {
      success: true,
      matchScore,
      matchedKeywords,
      missingKeywords,
      suggestions: missingKeywords.length > 0 
        ? [`Consider adding these skills/keywords: ${missingKeywords.slice(0, 5).join(', ')}`]
        : ['Great match! Your resume aligns well with the job description.'],
    };
  },
});

/**
 * Export all autonomous tools
 */
export const autonomousResumeTools = {
  ...resumeToolsWithArtifacts,
  checkWorkflowProgress,
  analyzeResume,
  matchJobDescription,
};
