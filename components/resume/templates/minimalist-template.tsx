"use client";

import type { Resume } from '@/lib/models/resume';
import type { Experience, Education, Skill, Project } from '@/lib/models/resume';
import { cn } from '@/lib/utils';

interface MinimalistTemplateProps {
  resume: Resume;
  className?: string;
}

export function MinimalistTemplate({ resume, className }: MinimalistTemplateProps) {
  return (
    <div className={cn('w-full max-w-3xl mx-auto bg-background', className)}>
      <div className="p-12 print:p-8">
        {/* Minimal Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light text-foreground mb-1 tracking-wide">
            {resume.personalInfo.name}
          </h1>
          {resume.title && (
            <p className="text-sm text-muted-foreground font-light mb-6">{resume.title}</p>
          )}
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground font-light">
            {resume.personalInfo.email && (
              <span>{resume.personalInfo.email}</span>
            )}
            {resume.personalInfo.phone && (
              <span>{resume.personalInfo.phone}</span>
            )}
            {resume.personalInfo.location && (
              <span>{resume.personalInfo.location}</span>
            )}
            {resume.personalInfo.linkedin && (
              <a
                href={resume.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                LinkedIn
              </a>
            )}
            {resume.personalInfo.github && (
              <a
                href={resume.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            )}
            {resume.personalInfo.website && (
              <a
                href={resume.personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Website
              </a>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {resume.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <MinimalistSection key={section.id} section={section} />
            ))}
        </div>
      </div>
    </div>
  );
}

interface MinimalistSectionProps {
  section: {
    id: string;
    type: string;
    title: string;
    items: unknown[];
  };
}

function MinimalistSection({ section }: MinimalistSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-light text-muted-foreground uppercase tracking-[0.2em] border-b border-border pb-1">
        {section.title}
      </h2>

      {section.type === 'experience' && (
        <div className="space-y-6">
          {(section.items as Experience[]).map((exp) => (
            <MinimalistExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>
      )}

      {section.type === 'education' && (
        <div className="space-y-6">
          {(section.items as Education[]).map((edu) => (
            <MinimalistEducationItem key={edu.id} education={edu} />
          ))}
        </div>
      )}

      {section.type === 'skills' && (
        <MinimalistSkillsList skills={section.items as Skill[]} />
      )}

      {section.type === 'projects' && (
        <div className="space-y-6">
          {(section.items as Project[]).map((proj) => (
            <MinimalistProjectItem key={proj.id} project={proj} />
          ))}
        </div>
      )}

      {section.type === 'summary' && (
        <p className="text-sm text-muted-foreground leading-relaxed font-light whitespace-pre-line">
          {section.items[0] as string}
        </p>
      )}
    </div>
  );
}

function MinimalistExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-sm font-normal text-foreground">
            {experience.position}
          </h3>
          <p className="text-xs text-muted-foreground font-light">{experience.company}</p>
        </div>
        <div className="text-right text-xs text-muted-foreground font-light">
          <div>
            {experience.startDate} -{' '}
            {experience.current ? 'Present' : experience.endDate || 'Present'}
          </div>
        </div>
      </div>
      {experience.description && (
        <p className="text-xs text-muted-foreground mt-2 font-light leading-relaxed">
          {experience.description}
        </p>
      )}
      {experience.achievements && experience.achievements.length > 0 && (
        <ul className="list-none mt-2 space-y-1">
          {experience.achievements.map((achievement, idx) => (
            <li key={idx} className="text-xs text-muted-foreground font-light">
              {achievement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MinimalistEducationItem({ education }: { education: Education }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-sm font-normal text-foreground">
            {education.degree}
            {education.field && `, ${education.field}`}
          </h3>
          <p className="text-xs text-muted-foreground font-light">{education.institution}</p>
        </div>
        {education.startDate && education.endDate && (
          <div className="text-xs text-muted-foreground font-light">
            {education.startDate} - {education.endDate}
          </div>
        )}
      </div>
      {education.gpa && (
        <p className="text-xs text-muted-foreground mt-1 font-light">GPA: {education.gpa}</p>
      )}
    </div>
  );
}

function MinimalistSkillsList({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          {category !== 'Other' && (
            <p className="text-xs text-muted-foreground font-light mb-1">
              {category}:
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <span
                key={skill.id}
                className="text-xs text-muted-foreground font-light"
              >
                {skill.name}
                {skill.level && ` (${skill.level})`}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MinimalistProjectItem({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-normal text-foreground">{project.name}</h3>
        <div className="flex gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground font-light transition-colors"
            >
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground font-light transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2 font-light leading-relaxed">
        {project.description}
      </p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs text-muted-foreground font-light"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

