"use client";

import type { Resume } from '@/lib/models/resume';
import type { Experience, Education, Skill, Project } from '@/lib/models/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DefaultTemplateProps {
  resume: Resume;
  className?: string;
}

export function DefaultTemplate({ resume, className }: DefaultTemplateProps) {
  return (
    <Card className={cn('w-full max-w-4xl mx-auto bg-card', className)}>
      <CardContent className="p-8 print:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {resume.personalInfo.name}
          </h1>
          {resume.title && (
            <p className="text-lg text-muted-foreground">{resume.title}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
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
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            {resume.personalInfo.linkedin && (
              <a
                href={resume.personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
            )}
            {resume.personalInfo.github && (
              <a
                href={resume.personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub
              </a>
            )}
            {resume.personalInfo.website && (
              <a
                href={resume.personalInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Website
              </a>
            )}
            {resume.personalInfo.portfolio && (
              <a
                href={resume.personalInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Sections */}
        <div className="space-y-6">
          {resume.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
              <ResumeSection key={section.id} section={section} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface ResumeSectionProps {
  section: {
    id: string;
    type: string;
    title: string;
    items: unknown[];
  };
}

function ResumeSection({ section }: ResumeSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
        {section.title}
      </h2>

      {section.type === 'experience' && (
        <div className="space-y-4">
          {(section.items as Experience[]).map((exp) => (
            <ExperienceItem key={exp.id} experience={exp} />
          ))}
        </div>
      )}

      {section.type === 'education' && (
        <div className="space-y-4">
          {(section.items as Education[]).map((edu) => (
            <EducationItem key={edu.id} education={edu} />
          ))}
        </div>
      )}

      {section.type === 'skills' && (
        <SkillsList skills={section.items as Skill[]} />
      )}

      {section.type === 'projects' && (
        <div className="space-y-4">
          {(section.items as Project[]).map((proj) => (
            <ProjectItem key={proj.id} project={proj} />
          ))}
        </div>
      )}

      {section.type === 'summary' && (
        <p className="text-muted-foreground whitespace-pre-line">
          {section.items[0] as string}
        </p>
      )}

      {section.type === 'custom' && (
        <div className="text-muted-foreground">
          {section.items.map((item, idx) => (
            <div key={idx} className="mb-2">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-semibold text-foreground">
            {experience.position}
          </h3>
          <p className="text-muted-foreground">{experience.company}</p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>
            {experience.startDate} -{' '}
            {experience.current ? 'Present' : experience.endDate || 'Present'}
          </div>
          {experience.location && <div>{experience.location}</div>}
        </div>
      </div>
      {experience.description && (
        <p className="text-sm text-muted-foreground mt-2">
          {experience.description}
        </p>
      )}
      {experience.achievements && experience.achievements.length > 0 && (
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
          {experience.achievements.map((achievement, idx) => (
            <li key={idx}>{achievement}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EducationItem({ education }: { education: Education }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-semibold text-foreground">
            {education.degree}
            {education.field && ` in ${education.field}`}
          </h3>
          <p className="text-muted-foreground">{education.institution}</p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          {education.startDate && education.endDate && (
            <div>
              {education.startDate} - {education.endDate}
            </div>
          )}
          {education.location && <div>{education.location}</div>}
        </div>
      </div>
      {education.gpa && (
        <p className="text-sm text-muted-foreground mt-1">GPA: {education.gpa}</p>
      )}
      {education.honors && education.honors.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-foreground">Honors:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {education.honors.map((honor, idx) => (
              <li key={idx}>{honor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SkillsList({ skills }: { skills: Skill[] }) {
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
            <p className="text-sm font-medium text-foreground mb-1">
              {category}:
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm px-2 py-1 bg-muted rounded text-muted-foreground"
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

function ProjectItem({ project }: { project: Project }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-foreground">{project.name}</h3>
        <div className="flex gap-2">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

