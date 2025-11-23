"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditableText } from './editable-text';
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from 'lucide-react';
import type { Experience, Education, Project, Skill } from '@/lib/models/resume';
import { cn } from '@/lib/utils';

interface EditableItemProps {
  item: Experience | Education | Project | Skill | string;
  type: 'experience' | 'education' | 'project' | 'skill' | 'summary' | 'custom';
  onUpdate: (updates: Partial<Experience | Education | Project | Skill | string>) => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * Editable Item Component
 * Generic item editor that works for Experience, Education, Projects, etc.
 */
export function EditableItem({
  item,
  type,
  onUpdate,
  onDelete,
  className,
}: EditableItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (type === 'summary' || typeof item === 'string') {
    return (
      <div className={cn('space-y-2', className)}>
        <EditableText
          value={item as string}
          onChange={(value) => onUpdate(value)}
          multiline
          placeholder="Summary text..."
          fontSize={10}
          className="w-full"
        />
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <TrashIcon className="size-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    );
  }

  if (type === 'experience') {
    const exp = item as Experience;
    return (
      <div className={cn('space-y-2 border rounded-lg p-3', className)}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <EditableText
              value={exp.position || ''}
              onChange={(value) => onUpdate({ position: value } as Partial<Experience>)}
              placeholder="Job Title"
              fontSize={12}
              fontWeight="bold"
            />
            <EditableText
              value={exp.company || ''}
              onChange={(value) => onUpdate({ company: value } as Partial<Experience>)}
              placeholder="Company"
              fontSize={11}
            />
          </div>
          <div className="text-right">
            <EditableText
              value={`${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || 'Present'}`}
              onChange={(value) => {
                // Parse date string - simple implementation
                const parts = value.split(' - ');
                if (parts.length === 2) {
                  onUpdate({
                    startDate: parts[0],
                    endDate: parts[1] === 'Present' ? undefined : parts[1],
                    current: parts[1] === 'Present',
                  } as Partial<Experience>);
                }
              }}
              placeholder="Date Range"
              fontSize={10}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span className="text-xs text-muted-foreground">
            {isExpanded ? 'Hide details' : 'Show details'}
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </Button>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t">
            <EditableText
              value={exp.description || ''}
              onChange={(value) => onUpdate({ description: value } as Partial<Experience>)}
              multiline
              placeholder="Job description..."
              fontSize={10}
              className="w-full"
            />
            {exp.location && (
              <EditableText
                value={exp.location}
                onChange={(value) => onUpdate({ location: value } as Partial<Experience>)}
                placeholder="Location"
                fontSize={10}
              />
            )}
            {exp.achievements && exp.achievements.length > 0 && (
              <div className="space-y-1">
                {exp.achievements.map((achievement, idx) => (
                  <EditableText
                    key={idx}
                    value={achievement}
                    onChange={(value) => {
                      const newAchievements = [...(exp.achievements || [])];
                      newAchievements[idx] = value;
                      onUpdate({ achievements: newAchievements } as Partial<Experience>);
                    }}
                    placeholder="Achievement"
                    fontSize={10}
                  />
                ))}
              </div>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
                <TrashIcon className="size-4 mr-2" />
                Delete Experience
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'education') {
    const edu = item as Education;
    return (
      <div className={cn('space-y-2 border rounded-lg p-3', className)}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <EditableText
              value={`${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}`}
              onChange={(value) => {
                // Simple parsing - could be improved
                const parts = value.split(' in ');
                onUpdate({
                  degree: parts[0],
                  field: parts[1] || undefined,
                } as Partial<Education>);
              }}
              placeholder="Degree"
              fontSize={12}
              fontWeight="bold"
            />
            <EditableText
              value={edu.institution || ''}
              onChange={(value) => onUpdate({ institution: value } as Partial<Education>)}
              placeholder="Institution"
              fontSize={11}
            />
          </div>
          {edu.startDate && edu.endDate && (
            <EditableText
              value={`${edu.startDate} - ${edu.endDate}`}
              onChange={(value) => {
                const parts = value.split(' - ');
                if (parts.length === 2) {
                  onUpdate({
                    startDate: parts[0],
                    endDate: parts[1],
                  } as Partial<Education>);
                }
              }}
              placeholder="Date Range"
              fontSize={10}
            />
          )}
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t">
            {edu.gpa && (
              <EditableText
                value={edu.gpa}
                onChange={(value) => onUpdate({ gpa: value } as Partial<Education>)}
                placeholder="GPA"
                fontSize={10}
              />
            )}
            {edu.location && (
              <EditableText
                value={edu.location}
                onChange={(value) => onUpdate({ location: value } as Partial<Education>)}
                placeholder="Location"
                fontSize={10}
              />
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
                <TrashIcon className="size-4 mr-2" />
                Delete Education
              </Button>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span className="text-xs text-muted-foreground">
            {isExpanded ? 'Hide details' : 'Show details'}
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </Button>
      </div>
    );
  }

  if (type === 'project') {
    const proj = item as Project;
    return (
      <div className={cn('space-y-2 border rounded-lg p-3', className)}>
        <EditableText
          value={proj.name || ''}
          onChange={(value) => onUpdate({ name: value } as Partial<Project>)}
          placeholder="Project Name"
          fontSize={12}
          fontWeight="bold"
        />
        <EditableText
          value={proj.description || ''}
          onChange={(value) => onUpdate({ description: value } as Partial<Project>)}
          multiline
          placeholder="Project description..."
          fontSize={10}
          className="w-full"
        />
        {proj.technologies && proj.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {proj.technologies.map((tech, idx) => (
              <EditableText
                key={idx}
                value={tech}
                onChange={(value) => {
                  const newTechs = [...(proj.technologies || [])];
                  newTechs[idx] = value;
                  onUpdate({ technologies: newTechs } as Partial<Project>);
                }}
                placeholder="Technology"
                fontSize={10}
                className="px-2 py-1 bg-muted rounded"
              />
            ))}
          </div>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
            <TrashIcon className="size-4 mr-2" />
            Delete Project
          </Button>
        )}
      </div>
    );
  }

  if (type === 'skill') {
    const skill = item as Skill;
    return (
      <div className={cn('inline-flex items-center gap-2 px-2 py-1 bg-muted rounded', className)}>
        <EditableText
          value={skill.name || ''}
          onChange={(value) => onUpdate({ name: value } as Partial<Skill>)}
          placeholder="Skill name"
          fontSize={10}
        />
        {skill.level && (
          <span className="text-xs text-muted-foreground">({skill.level})</span>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-4 w-4 text-destructive"
          >
            <TrashIcon className="size-3" />
          </Button>
        )}
      </div>
    );
  }

  // Custom/unknown type
  return (
    <div className={cn('space-y-2', className)}>
      <EditableText
        value={typeof item === 'string' ? item : JSON.stringify(item)}
        onChange={(value) => onUpdate(value)}
        multiline
        placeholder="Custom content"
        fontSize={10}
        className="w-full"
      />
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
          <TrashIcon className="size-4 mr-2" />
          Delete
        </Button>
      )}
    </div>
  );
}

