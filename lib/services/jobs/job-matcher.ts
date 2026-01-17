import type { Job, JobPreferences } from '@/lib/models/job';
import type { Resume } from '@/lib/models/resume';

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Calculate match score between a job and user's resume/preferences
 */
export function calculateMatchScore(
  job: Job,
  resume: Resume,
  preferences: JobPreferences | null
): MatchResult {
  let score = 0;
  const maxScore = 100;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Extract skills from resume
  const resumeSkills = extractResumeSkills(resume);
  const resumeSkillsLower = resumeSkills.map((s) => s.toLowerCase());

  // Extract skills from job description and requirements
  const jobText = `${job.description || ''} ${job.requirements || ''}`.toLowerCase();
  const jobSkills = extractJobSkills(jobText);

  // Calculate skill match (40 points)
  const skillScore = calculateSkillMatch(resumeSkillsLower, jobSkills);
  score += skillScore.score;
  matchedSkills.push(...skillScore.matched);
  missingSkills.push(...skillScore.missing);

  // Location match (15 points)
  if (preferences?.locations && preferences.locations.length > 0) {
    const locationMatch = checkLocationMatch(job.location || '', preferences.locations);
    score += locationMatch ? 15 : 0;
  }

  // Job type match (15 points)
  if (preferences?.job_types && preferences.job_types.length > 0) {
    const jobTypeMatch = checkJobTypeMatch(job.job_type || '', preferences.job_types);
    score += jobTypeMatch ? 15 : 0;
  }

  // Experience level match (20 points)
  if (preferences?.experience_level) {
    const experienceMatch = checkExperienceMatch(
      resume,
      preferences.experience_level,
      jobText
    );
    score += experienceMatch ? 20 : 10; // Partial match gets 10 points
  }

  // Salary range match (10 points)
  if (preferences?.salary_min || preferences?.salary_max) {
    const salaryMatch = checkSalaryMatch(job.salary_range || '', preferences);
    score += salaryMatch ? 10 : 0;
  }

  // Ensure score is between 0 and 100
  score = Math.min(Math.max(score, 0), maxScore);

  return {
    score: Math.round(score * 100) / 100, // Round to 2 decimal places
    matchedSkills: [...new Set(matchedSkills)], // Remove duplicates
    missingSkills: [...new Set(missingSkills)], // Remove duplicates
  };
}

/**
 * Extract skills from resume
 */
function extractResumeSkills(resume: Resume): string[] {
  const skills: string[] = [];

  // Get skills from skills section
  const skillsSection = resume.sections.find((s) => s.type === 'skills');
  if (skillsSection) {
    for (const item of skillsSection.items) {
      if (typeof item === 'object' && item !== null && 'name' in item) {
        skills.push(String(item.name));
      } else if (typeof item === 'string') {
        skills.push(item);
      }
    }
  }

  // Extract skills from experience descriptions
  const experienceSection = resume.sections.find((s) => s.type === 'experience');
  if (experienceSection) {
    for (const item of experienceSection.items) {
      if (typeof item === 'object' && item !== null) {
        const exp = item as any;
        if (exp.description) {
          const expSkills = extractSkillsFromText(exp.description);
          skills.push(...expSkills);
        }
        if (exp.achievements) {
          for (const achievement of exp.achievements || []) {
            const achSkills = extractSkillsFromText(achievement);
            skills.push(...achSkills);
          }
        }
      }
    }
  }

  // Extract skills from projects
  const projectsSection = resume.sections.find((s) => s.type === 'projects');
  if (projectsSection) {
    for (const item of projectsSection.items) {
      if (typeof item === 'object' && item !== null) {
        const proj = item as any;
        if (proj.technologies) {
          skills.push(...proj.technologies);
        }
        if (proj.description) {
          const projSkills = extractSkillsFromText(proj.description);
          skills.push(...projSkills);
        }
      }
    }
  }

  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Extract skills from job text
 */
function extractJobSkills(jobText: string): string[] {
  // Common technical skills keywords
  const skillKeywords = [
    'javascript',
    'typescript',
    'python',
    'java',
    'react',
    'vue',
    'angular',
    'node.js',
    'express',
    'sql',
    'mongodb',
    'postgresql',
    'aws',
    'docker',
    'kubernetes',
    'git',
    'html',
    'css',
    'sass',
    'less',
    'php',
    'ruby',
    'go',
    'rust',
    'c++',
    'c#',
    '.net',
    'django',
    'flask',
    'spring',
    'laravel',
    'rails',
    'agile',
    'scrum',
    'devops',
    'ci/cd',
    'microservices',
    'rest api',
    'graphql',
    'redux',
    'next.js',
    'vue.js',
    'angularjs',
    'jquery',
    'bootstrap',
    'tailwind',
    'figma',
    'adobe',
    'photoshop',
    'illustrator',
    'excel',
    'powerpoint',
    'word',
    'project management',
    'leadership',
    'communication',
    'problem solving',
    'analytical',
    'teamwork',
    'collaboration',
  ];

  const foundSkills: string[] = [];
  const lowerText = jobText.toLowerCase();

  for (const skill of skillKeywords) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  // Also look for patterns like "X years of experience with Y"
  const experiencePattern = /(\d+)\+?\s*years?\s*(?:of\s*)?experience\s*(?:with|in)\s*([a-z\s]+)/gi;
  let match;
  while ((match = experiencePattern.exec(jobText)) !== null) {
    const skill = match[2].trim();
    if (skill.length > 2 && skill.length < 30) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills)];
}

/**
 * Extract skills from text using common patterns
 */
function extractSkillsFromText(text: string): string[] {
  const skills: string[] = [];
  const lowerText = text.toLowerCase();

  // Common skill keywords
  const skillKeywords = [
    'javascript',
    'typescript',
    'python',
    'java',
    'react',
    'vue',
    'angular',
    'node',
    'sql',
    'mongodb',
    'postgresql',
    'aws',
    'docker',
    'git',
  ];

  for (const keyword of skillKeywords) {
    if (lowerText.includes(keyword)) {
      skills.push(keyword);
    }
  }

  return skills;
}

/**
 * Calculate skill match score
 */
function calculateSkillMatch(
  resumeSkills: string[],
  jobSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  if (jobSkills.length === 0) {
    return { score: 20, matched: [], missing: [] }; // Default score if no skills specified
  }

  const matched: string[] = [];
  const missing: string[] = [];

  for (const jobSkill of jobSkills) {
    const jobSkillLower = jobSkill.toLowerCase();
    const found = resumeSkills.some((resumeSkill) =>
      resumeSkill.includes(jobSkillLower) || jobSkillLower.includes(resumeSkill)
    );

    if (found) {
      matched.push(jobSkill);
    } else {
      missing.push(jobSkill);
    }
  }

  const matchRatio = matched.length / jobSkills.length;
  const score = Math.round(matchRatio * 40); // Max 40 points for skills

  return { score, matched, missing };
}

/**
 * Check location match
 */
function checkLocationMatch(jobLocation: string, preferredLocations: string[]): boolean {
  const jobLocationLower = jobLocation.toLowerCase();
  return preferredLocations.some((pref) =>
    jobLocationLower.includes(pref.toLowerCase()) ||
    pref.toLowerCase().includes(jobLocationLower)
  );
}

/**
 * Check job type match
 */
function checkJobTypeMatch(jobType: string, preferredTypes: string[]): boolean {
  if (!jobType) return false;
  const jobTypeLower = jobType.toLowerCase();
  return preferredTypes.some((pref) => jobTypeLower.includes(pref.toLowerCase()));
}

/**
 * Check experience level match
 */
function checkExperienceMatch(
  resume: Resume,
  preferredLevel: string,
  jobText: string
): boolean {
  // Count years of experience from resume
  const experienceSection = resume.sections.find((s) => s.type === 'experience');
  if (!experienceSection) return false;

  let totalYears = 0;
  for (const item of experienceSection.items) {
    if (typeof item === 'object' && item !== null) {
      const exp = item as any;
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        totalYears += Math.max(0, years);
      }
    }
  }

  // Check if experience matches job requirements
  const levelLower = preferredLevel.toLowerCase();
  const jobTextLower = jobText.toLowerCase();

  if (levelLower.includes('entry') || levelLower.includes('junior')) {
    return totalYears <= 2 && jobTextLower.includes('entry') || jobTextLower.includes('junior');
  } else if (levelLower.includes('mid') || levelLower.includes('intermediate')) {
    return totalYears >= 2 && totalYears <= 5;
  } else if (levelLower.includes('senior') || levelLower.includes('lead')) {
    return totalYears >= 5;
  }

  return false;
}

/**
 * Check salary match
 */
function checkSalaryMatch(
  jobSalaryRange: string,
  preferences: JobPreferences
): boolean {
  if (!jobSalaryRange) return false;

  // Extract numbers from salary range (e.g., "R50,000 - R80,000" or "R50000-R80000")
  const numbers = jobSalaryRange.match(/\d+/g);
  if (!numbers || numbers.length === 0) return false;

  const jobMin = parseInt(numbers[0].replace(/,/g, ''), 10);
  const jobMax = numbers.length > 1 ? parseInt(numbers[1].replace(/,/g, ''), 10) : jobMin;

  if (preferences.salary_min && jobMax < preferences.salary_min) {
    return false;
  }

  if (preferences.salary_max && jobMin > preferences.salary_max) {
    return false;
  }

  return true;
}

