import { getJob } from '@/lib/supabase/jobs-client';
import { getResume } from '@/lib/storage/resume-store';
import { createCoverLetter, getCoverLetter } from '@/lib/supabase/jobs-client';
import { createJobApplication, updateJobApplication } from '@/lib/supabase/jobs-client';
import { saveJobMatch } from '@/lib/supabase/jobs-client';
import { sendJobApplication } from '@/lib/services/email/email-service';
import { createCoverLetterAgent } from '@/lib/ai/cover-letter-agent';
import type { JobApplication } from '@/lib/models/job';
import type { Resume } from '@/lib/models/resume';

/**
 * Apply to a job
 */
export async function applyToJob(
  userId: string,
  jobId: string,
  resumeId: string,
  autoApply: boolean = false
): Promise<JobApplication> {
  try {
    // Get job and resume
    const job = await getJob(jobId);
    if (!job) {
      throw new Error(`Job with ID ${jobId} not found`);
    }

    const resume = getResume(resumeId);
    if (!resume) {
      throw new Error(`Resume with ID ${resumeId} not found`);
    }

    // Get or generate cover letter
    let coverLetterId: string | undefined;

    // Check if cover letter already exists for this job/resume combination
    // For MVP, we'll generate a new one each time
    // In production, you might want to check for existing cover letters

    // Generate cover letter using AI agent
    const coverLetterContent = await generateCoverLetterWithAI(
      userId,
      jobId,
      resumeId,
      'professional'
    );

    // Save cover letter
    const coverLetter = await createCoverLetter({
      user_id: userId,
      job_id: jobId,
      resume_id: resumeId,
      content: coverLetterContent,
      template: 'professional',
    });

    coverLetterId = coverLetter.id;

    // Get application email from job or resume
    const applicationEmail = extractApplicationEmail(job, resume);

    if (!applicationEmail) {
      throw new Error('No application email found. Please provide an email address in job posting or resume.');
    }

    // Send application email
    let emailId: string | undefined;
    let emailSent = false;

    try {
      emailId = await sendJobApplication(applicationEmail, job, resume, coverLetterContent);
      emailSent = true;
    } catch (error) {
      console.error('Error sending application email:', error);
      // Continue with application creation even if email fails
      // The application will be marked as email_sent: false
    }

    // Create job application record
    const application = await createJobApplication({
      user_id: userId,
      job_id: jobId,
      resume_id: resumeId,
      cover_letter_id: coverLetterId,
      status: 'applied',
      email_sent: emailSent,
      email_id: emailId,
    });

    // Update job match status to 'applied'
    // First, we need to find the job match
    // For MVP, we'll skip this if match doesn't exist
    try {
      // This would require a function to get job match by user_id and job_id
      // For now, we'll create/update it if needed
      // In production, you'd want to properly link the match
    } catch (error) {
      console.error('Error updating job match status:', error);
      // Continue even if match update fails
    }

    return application;
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
}

/**
 * Generate cover letter using AI agent
 */
async function generateCoverLetterWithAI(
  userId: string,
  jobId: string,
  resumeId: string,
  template: string = 'professional'
): Promise<string> {
  const agent = createCoverLetterAgent(userId, jobId, resumeId, template);

  // Create a message to trigger cover letter generation
  const message = {
    role: 'user' as const,
    content: `Please generate a professional cover letter for this job application. Use the job details and resume information to create a personalized, compelling cover letter.`,
  };

  // Use agent to generate cover letter
  // The agent will use its tools to fetch job and resume, then generate content
  const context = {
    userId,
    jobId,
    resumeId,
    template,
  };

  // For MVP, we'll use a simplified approach
  // In production, you'd use agent.toUIMessageStream or similar
  // For now, we'll return a placeholder that the API route will handle properly
  throw new Error('Cover letter generation should be handled via API route with proper agent streaming');
}

/**
 * Extract application email from job or resume
 */
function extractApplicationEmail(job: any, resume: Resume): string | null {
  // Try to extract from job description
  const jobEmailMatch = job.description?.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (jobEmailMatch) {
    return jobEmailMatch[0];
  }

  // Try to extract from job requirements
  const reqEmailMatch = job.requirements?.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (reqEmailMatch) {
    return reqEmailMatch[0];
  }

  // Use resume email as fallback (for testing)
  if (resume.personalInfo.email) {
    return resume.personalInfo.email;
  }

  return null;
}

/**
 * Simplified cover letter generation (for MVP)
 * This will be replaced by proper AI agent call in API route
 */
export async function generateCoverLetterSimple(
  jobTitle: string,
  company: string,
  resume: Resume
): Promise<string> {
  // Simple template-based generation for MVP
  // In production, this would use the AI agent

  const name = resume.personalInfo.name || 'Candidate';
  const email = resume.personalInfo.email || '';
  const phone = resume.personalInfo.phone || '';

  // Extract key skills from resume
  const skillsSection = resume.sections.find((s) => s.type === 'skills');
  const skills = skillsSection?.items
    .map((item: any) => (typeof item === 'object' ? item.name : item))
    .slice(0, 5)
    .join(', ') || 'various technical and professional skills';

  // Extract experience
  const experienceSection = resume.sections.find((s) => s.type === 'experience');
  const latestExp = experienceSection?.items[0] as any;
  const position = latestExp?.position || 'professional';
  const companyName = latestExp?.company || 'various companies';

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in ${position} and experience at ${companyName}, I am confident that I would be a valuable addition to your team.

My expertise includes ${skills}, which align well with the requirements for this role. I am particularly drawn to this opportunity because it allows me to leverage my experience while contributing to ${company}'s continued success.

I would welcome the opportunity to discuss how my skills and experience can contribute to your team. Thank you for considering my application.

Sincerely,
${name}
${email ? `Email: ${email}` : ''}
${phone ? `Phone: ${phone}` : ''}`;
}

