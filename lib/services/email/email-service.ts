import { Resend } from 'resend';
import type { Job, Resume } from '@/lib/models/job';
import type { Resume as ResumeType } from '@/lib/models/resume';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send job application email
 */
export async function sendJobApplication(
  email: string,
  job: Job,
  resume: ResumeType,
  coverLetter: string
): Promise<string> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  // Generate resume PDF (would need to import PDF generation utility)
  // For MVP, we'll send the resume as text in the email
  const resumeText = formatResumeAsText(resume);

  // Format email content
  const emailSubject = `Application for ${job.title} at ${job.company || 'Your Company'}`;
  const emailBody = formatApplicationEmail(job, resume, coverLetter, resumeText);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: emailSubject,
      html: emailBody,
      // In production, you might want to attach the PDF resume
      // attachments: [
      //   {
      //     filename: 'resume.pdf',
      //     content: resumePdfBuffer,
      //   },
      // ],
    });

    if (error) {
      throw new Error(`Resend API error: ${error.message}`);
    }

    if (!data?.id) {
      throw new Error('No email ID returned from Resend');
    }

    return data.id;
  } catch (error) {
    console.error('Error sending job application email:', error);
    throw error;
  }
}

/**
 * Format application email HTML
 */
function formatApplicationEmail(
  job: Job,
  resume: ResumeType,
  coverLetter: string,
  resumeText: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #f4f4f4;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .cover-letter {
      margin: 20px 0;
      padding: 20px;
      background-color: #f9f9f9;
      border-left: 4px solid #007bff;
    }
    .resume-section {
      margin: 20px 0;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>Application for ${job.title}</h2>
    <p><strong>Company:</strong> ${job.company || 'N/A'}</p>
    <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
  </div>

  <div class="cover-letter">
    <h3>Cover Letter</h3>
    ${coverLetter.split('\n').map(para => `<p>${para}</p>`).join('')}
  </div>

  <div class="resume-section">
    <h3>Resume</h3>
    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${resumeText}</pre>
  </div>

  <div class="footer">
    <p>This application was sent via Phandi'span Job Application System.</p>
    <p>If you have any questions, please contact the applicant directly.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Format resume as plain text
 */
function formatResumeAsText(resume: ResumeType): string {
  let text = `\n${resume.title}\n`;
  text += '='.repeat(50) + '\n\n';

  // Personal Info
  text += 'CONTACT INFORMATION\n';
  text += '-'.repeat(50) + '\n';
  if (resume.personalInfo.name) text += `Name: ${resume.personalInfo.name}\n`;
  if (resume.personalInfo.email) text += `Email: ${resume.personalInfo.email}\n`;
  if (resume.personalInfo.phone) text += `Phone: ${resume.personalInfo.phone}\n`;
  if (resume.personalInfo.location) text += `Location: ${resume.personalInfo.location}\n`;
  if (resume.personalInfo.linkedin) text += `LinkedIn: ${resume.personalInfo.linkedin}\n`;
  if (resume.personalInfo.github) text += `GitHub: ${resume.personalInfo.github}\n`;
  text += '\n';

  // Sections
  for (const section of resume.sections) {
    text += `${section.title.toUpperCase()}\n`;
    text += '-'.repeat(50) + '\n';

    for (const item of section.items) {
      if (section.type === 'experience') {
        const exp = item as any;
        text += `${exp.position || 'Position'} at ${exp.company || 'Company'}\n`;
        if (exp.location) text += `Location: ${exp.location}\n`;
        if (exp.startDate) {
          text += `Period: ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'N/A'}\n`;
        }
        if (exp.description) text += `Description: ${exp.description}\n`;
        if (exp.achievements) {
          text += 'Achievements:\n';
          for (const achievement of exp.achievements) {
            text += `  - ${achievement}\n`;
          }
        }
        text += '\n';
      } else if (section.type === 'education') {
        const edu = item as any;
        text += `${edu.degree || 'Degree'}\n`;
        if (edu.institution) text += `Institution: ${edu.institution}\n`;
        if (edu.field) text += `Field: ${edu.field}\n`;
        if (edu.endDate) text += `Graduated: ${edu.endDate}\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        text += '\n';
      } else if (section.type === 'skills') {
        const skill = item as any;
        if (typeof skill === 'object' && skill.name) {
          text += `- ${skill.name}${skill.level ? ` (${skill.level})` : ''}\n`;
        } else if (typeof skill === 'string') {
          text += `- ${skill}\n`;
        }
      } else if (section.type === 'projects') {
        const proj = item as any;
        text += `${proj.name || 'Project'}\n`;
        if (proj.description) text += `Description: ${proj.description}\n`;
        if (proj.technologies) {
          text += `Technologies: ${proj.technologies.join(', ')}\n`;
        }
        text += '\n';
      } else {
        // Generic item
        text += `${JSON.stringify(item)}\n\n`;
      }
    }
  }

  return text;
}

