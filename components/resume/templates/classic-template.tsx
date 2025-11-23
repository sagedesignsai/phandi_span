"use client";

import type { Resume } from '@/lib/models/resume';
import type { Experience, Education, Skill, Project } from '@/lib/models/resume';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ClassicTemplateProps {
  resume: Resume;
  className?: string;
}

export function ClassicTemplate({ resume, className }: ClassicTemplateProps) {
  return (
    <div className={cn('w-full max-w-4xl mx-auto bg-background', className)}>
      <div className="p-10 print:p-8">
        {/* Centered Header */}
        <div className="text-center mb-8 border-b-2 border-foreground pb-6">
          <h1 className="text-4xl font-serif text-foreground mb-3 tracking-wide">
            {resume.personalInfo.name}
          </h1>
          {resume.title && (
            <p className="text-lg text-muted-foreground italic mb-4">{resume.title}</p>
          )}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {resume.personalInfo.email && (
              <span>{resume.personalInfo.email}</span>
            )}
            {resume.personalInfo.phone && (
              <span>{resume.personalInfo.phone}</span>
            )}
            {resume.personalInfo.location && (
              <span>{resume.personalInfo.location}</span>
            )}
          </div>
          {(resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website) && (
            <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm">
              {resume.personalInfo.linkedin && (
                <a
                  href={resume.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground underline"
                >
                  LinkedIn
                </a>
              )}
              {resume.personalInfo.github && (
                <a
                  href={resume.personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground underline"
                >
                  GitHub
                </a>
              )}
              {resume.personalInfo.website && (
                <a
                  href={resume.personalInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {resume.sections
            .sort((a, b) => a.order - b.order)
            .map((section, idx) => (
              <div key={section.id}>
                <ClassicSection section={section} />
                {idx < resume.sections.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

interface ClassicSectionProps {
  section: {
    id: string;
    type: string;
    title: string;
    items: unknown[];
  };
}

function ClassicSection({ section }: ClassicSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif text-foreground text-center uppercase tracking-wider border-b border-foreground pb-2 mb-4">
        {section.title}
      </h2>

      {section.type === 'experience' && (
        <div className="space-y-5">
          {(section.items as Experience[]).map((exp) => (
            <ClassicExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>
      )}

      {section.type === 'education' && (
        <div className="space-y-5">
          {(section.items as Education[]).map((edu) => (
            <ClassicEducationItem key={edu.id} education={edu} />
          ))}
        </div>
      )}

      {section.type === 'skills' && (
        <ClassicSkillsList skills={section.items as Skill[]} />
      )}

      {section.type === 'projects' && (
        <div className="space-y-5">
          {(section.items as Project[]).map((proj) => (
            <ClassicProjectItem key={proj.id} project={proj} />
          ))}
        </div>
      )}

      {section.type === 'summary' && (
        <p className="text-muted-foreground text-center leading-relaxed whitespace-pre-line italic">
          {section.items[0] as string}
        </p>
      )}
    </div>
  );
}

function ClassicExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div className="text-center">
      <div className="mb-2">
        <h3 className="text-lg font-serif text-foreground font-semibold">
          {experience.position}
        </h3>
        <p className="text-base text-muted-foreground italic">{experience.company}</p>
      </div>
      <div className="text-sm text-muted-foreground mb-2">
        {experience.startDate} -{' '}
        {experience.current ? 'Present' : experience.endDate || 'Present'}
        {experience.location && ` • ${experience.location}`}
      </div>
      {experience.description && (
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl mx-auto">
          {experience.description}
        </p>
      )}
      {experience.achievements && experience.achievements.length > 0 && (
        <ul className="list-none mt-3 space-y-1 max-w-2xl mx-auto">
          {experience.achievements.map((achievement, idx) => (
            <li key={idx} className="text-sm text-muted-foreground">
              • {achievement}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ClassicEducationItem({ education }: { education: Education }) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-serif text-foreground font-semibold">
        {education.degree}
        {education.field && ` in ${education.field}`}
      </h3>
      <p className="text-base text-muted-foreground italic mb-1">{education.institution}</p>
      {education.startDate && education.endDate && (
        <p className="text-sm text-muted-foreground">
          {education.startDate} - {education.endDate}
        </p>
      )}
      {education.gpa && (
        <p className="text-sm text-muted-foreground mt-1">GPA: {education.gpa}</p>
      )}
    </div>
  );
}

function ClassicSkillsList({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category} className="text-center">
          {category !== 'Other' && (
            <p className="text-sm font-semibold text-foreground mb-2">
              {category}:
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {categorySkills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm px-3 py-1 text-muted-foreground border border-border rounded"
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

function ClassicProjectItem({ project }: { project: Project }) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-serif text-foreground font-semibold mb-1">
        {project.name}
      </h3>
      {(project.url || project.github) && (
        <div className="flex justify-center gap-3 mb-2">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              GitHub
            </a>
          )}
        </div>
      )}
      <p className="text-sm text-muted-foreground mb-2 max-w-2xl mx-auto">
        {project.description}
      </p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 text-muted-foreground border border-border rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

