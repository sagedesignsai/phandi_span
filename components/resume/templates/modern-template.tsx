"use client";

import type { Resume } from '@/lib/models/resume';
import type { Experience, Education, Skill, Project } from '@/lib/models/resume';
import { cn } from '@/lib/utils';

interface ModernTemplateProps {
  resume: Resume;
  className?: string;
}

export function ModernTemplate({ resume, className }: ModernTemplateProps) {
  return (
    <div className={cn('w-full max-w-4xl mx-auto bg-background', className)}>
      <div className="p-8 print:p-6">
        {/* Header with accent bar */}
        <div className="mb-8 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" />
          <div className="ml-6">
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
              {resume.personalInfo.name}
            </h1>
            {resume.title && (
              <p className="text-xl text-muted-foreground font-medium">{resume.title}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              {resume.personalInfo.email && (
                <a href={`mailto:${resume.personalInfo.email}`} className="text-primary hover:underline font-medium">
                  {resume.personalInfo.email}
                </a>
              )}
              {resume.personalInfo.phone && (
                <span className="text-muted-foreground">{resume.personalInfo.phone}</span>
              )}
              {resume.personalInfo.location && (
                <span className="text-muted-foreground">{resume.personalInfo.location}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              {resume.personalInfo.linkedin && (
                <a
                  href={resume.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  LinkedIn
                </a>
              )}
              {resume.personalInfo.github && (
                <a
                  href={resume.personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  GitHub
                </a>
              )}
              {resume.personalInfo.website && (
                <a
                  href={resume.personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {resume.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <ModernSection key={section.id} section={section} />
            ))}
        </div>
      </div>
    </div>
  );
}

interface ModernSectionProps {
  section: {
    id: string;
    type: string;
    title: string;
    items: unknown[];
  };
}

function ModernSection({ section }: ModernSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide border-b-2 border-primary pb-2">
        {section.title}
      </h2>

      {section.type === 'experience' && (
        <div className="space-y-6">
          {(section.items as Experience[]).map((exp) => (
            <ModernExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>
      )}

      {section.type === 'education' && (
        <div className="space-y-6">
          {(section.items as Education[]).map((edu) => (
            <ModernEducationItem key={edu.id} education={edu} />
          ))}
        </div>
      )}

      {section.type === 'skills' && (
        <ModernSkillsList skills={section.items as Skill[]} />
      )}

      {section.type === 'projects' && (
        <div className="space-y-6">
          {(section.items as Project[]).map((proj) => (
            <ModernProjectItem key={proj.id} project={proj} />
          ))}
        </div>
      )}

      {section.type === 'summary' && (
        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {section.items[0] as string}
        </p>
      )}
    </div>
  );
}

function ModernExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div className="relative pl-6 border-l-2 border-primary/20">
      <div className="absolute left-[-6px] top-2 w-3 h-3 rounded-full bg-primary" />
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {experience.position}
          </h3>
          <p className="text-base text-primary font-medium">{experience.company}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted-foreground">
            {experience.startDate} -{' '}
            {experience.current ? 'Present' : experience.endDate || 'Present'}
          </div>
          {experience.location && (
            <div className="text-xs text-muted-foreground">{experience.location}</div>
          )}
        </div>
      </div>
      {experience.description && (
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {experience.description}
        </p>
      )}
      {experience.achievements && experience.achievements.length > 0 && (
        <ul className="list-none mt-3 space-y-1">
          {experience.achievements.map((achievement, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start">
              <span className="text-primary mr-2">▸</span>
              {achievement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ModernEducationItem({ education }: { education: Education }) {
  return (
    <div className="relative pl-6 border-l-2 border-primary/20">
      <div className="absolute left-[-6px] top-2 w-3 h-3 rounded-full bg-primary" />
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {education.degree}
            {education.field && ` in ${education.field}`}
          </h3>
          <p className="text-base text-primary font-medium">{education.institution}</p>
        </div>
        {education.startDate && education.endDate && (
          <div className="text-sm font-medium text-muted-foreground">
            {education.startDate} - {education.endDate}
          </div>
        )}
      </div>
      {education.gpa && (
        <p className="text-sm text-muted-foreground mt-1">GPA: {education.gpa}</p>
      )}
    </div>
  );
}

function ModernSkillsList({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          {category !== 'Other' && (
            <p className="text-sm font-bold text-foreground mb-2 uppercase tracking-wide">
              {category}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full font-medium border border-primary/20"
              >
                {skill.name}
                {skill.level && ` • ${skill.level}`}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ModernProjectItem({ project }: { project: Project }) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-foreground">{project.name}</h3>
        <div className="flex gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium"
            >
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-background border border-border rounded font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

