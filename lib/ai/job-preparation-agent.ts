import { generateText } from 'ai';
import { getModel } from './provider';
import type { Resume } from '@/lib/models/resume';
import type { Job } from '@/lib/models/job';

/**
 * AI-Powered Job Preparation Agent
 * Helps users prepare for job applications and interviews
 */

export interface InterviewPreparation {
  commonQuestions: Array<{ question: string; suggestedAnswer: string }>;
  technicalQuestions: Array<{ question: string; hints: string[] }>;
  behavioralQuestions: Array<{ question: string; starFramework: string }>;
  companyResearch: {
    overview: string;
    culture: string;
    recentNews: string[];
  };
}

export interface SkillGapAnalysis {
  matchedSkills: string[];
  missingSkills: Array<{ skill: string; priority: 'high' | 'medium' | 'low'; learningResources: string[] }>;
  recommendations: string[];
}

export interface CareerPathSuggestion {
  currentLevel: string;
  nextSteps: Array<{ role: string; timeframe: string; requiredSkills: string[] }>;
  industryTrends: string[];
}

/**
 * Generate interview preparation guide
 */
export async function generateInterviewPrep(
  job: Job,
  resume: Resume,
  companyInfo?: string
): Promise<InterviewPreparation> {
  const model = getModel();

  const prompt = `You are an expert career coach helping a candidate prepare for a job interview.

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description}
- Requirements: ${job.requirements}

Candidate Resume Summary:
${JSON.stringify(resume.sections, null, 2)}

${companyInfo ? `Company Information:\n${companyInfo}` : ''}

Generate a comprehensive interview preparation guide including:
1. 5 common interview questions specific to this role with suggested answers
2. 5 technical questions they might ask with hints for answering
3. 5 behavioral questions using the STAR framework
4. Company research insights and talking points

Format as JSON.`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.7,
  });

  return JSON.parse(text);
}

/**
 * Analyze skill gaps between resume and job requirements
 */
export async function analyzeSkillGap(
  job: Job,
  resume: Resume
): Promise<SkillGapAnalysis> {
  const model = getModel();

  const prompt = `Analyze the skill gap between this job and the candidate's resume.

Job Requirements:
${job.requirements || job.description}

Candidate Skills:
${JSON.stringify(resume.sections.find(s => s.type === 'skills')?.items || [])}

Provide:
1. Skills the candidate has that match the job
2. Missing skills with priority (high/medium/low) and learning resources
3. Actionable recommendations for bridging the gap

Format as JSON with structure: { matchedSkills: string[], missingSkills: Array<{skill, priority, learningResources}>, recommendations: string[] }`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.5,
  });

  return JSON.parse(text);
}

/**
 * Generate personalized career path suggestions
 */
export async function suggestCareerPath(
  resume: Resume,
  preferences: { industries?: string[]; targetRoles?: string[] }
): Promise<CareerPathSuggestion> {
  const model = getModel();

  const prompt = `Based on this resume, suggest a career progression path.

Resume:
${JSON.stringify(resume, null, 2)}

Preferences:
${JSON.stringify(preferences, null, 2)}

Provide:
1. Current career level assessment
2. Next 3 career steps with timeframes and required skills
3. Industry trends relevant to their career path

Format as JSON.`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.6,
  });

  return JSON.parse(text);
}

/**
 * Generate company research insights
 */
export async function researchCompany(
  companyName: string,
  jobTitle: string
): Promise<string> {
  const model = getModel();

  const prompt = `Research ${companyName} for a ${jobTitle} position.

Provide:
1. Company overview and mission
2. Company culture and values
3. Recent news and developments
4. Interview tips specific to this company
5. Questions to ask the interviewer

Keep it concise and actionable.`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.7,
  });

  return text;
}

/**
 * Generate salary negotiation insights
 */
export async function getSalaryInsights(
  job: Job,
  resume: Resume,
  location: string
): Promise<{
  marketRate: string;
  negotiationTips: string[];
  justification: string;
}> {
  const model = getModel();

  const prompt = `Provide salary negotiation insights for this position in ${location}.

Job: ${job.title} at ${job.company}
Salary Range: ${job.salary_range || 'Not specified'}
Location: ${location}

Candidate Experience:
${resume.sections.find(s => s.type === 'experience')?.items.length || 0} years

Provide:
1. Market rate for this role in ${location}
2. 5 negotiation tips
3. Justification points based on candidate's experience

Format as JSON.`;

  const { text } = await generateText({
    model,
    prompt,
    temperature: 0.6,
  });

  return JSON.parse(text);
}
