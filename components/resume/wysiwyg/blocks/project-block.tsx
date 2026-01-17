'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BaseBlock } from './block';
import type { Block, ProjectBlockData } from '@/lib/resume/editor/block-types';

interface ProjectBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: ProjectBlockData) => void;
}

export function ProjectBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: ProjectBlockProps) {
  const data = block.data as ProjectBlockData;
  const [localData, setLocalData] = useState<ProjectBlockData>(data);

  const handleChange = (field: keyof ProjectBlockData, value: unknown) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleTechnologiesChange = (value: string) => {
    const technologies = value.split(',').map(t => t.trim()).filter(Boolean);
    handleChange('technologies', technologies);
  };

  if (isEditing) {
    return (
      <BaseBlock
        block={block}
        isSelected={isSelected}
        isEditing={isEditing}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        className="p-4 border-2 border-primary rounded-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Project Name</label>
            <Input
              value={localData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Project Name"
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <Textarea
              value={localData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the project..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Technologies (comma-separated)</label>
            <Input
              value={(localData.technologies || []).join(', ')}
              onChange={(e) => handleTechnologiesChange(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project URL</label>
              <Input
                type="url"
                value={localData.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">GitHub URL</label>
              <Input
                type="url"
                value={localData.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="https://github.com/..."
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </BaseBlock>
    );
  }

  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      isEditing={isEditing}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      className="p-4"
    >
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-foreground">{data.name || 'Project Name'}</h3>
          <div className="flex gap-2">
            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Live
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
        {data.description && (
          <p className="text-sm text-muted-foreground mb-2">{data.description}</p>
        )}
        {data.technologies && data.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.technologies.map((tech, idx) => (
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
    </BaseBlock>
  );
}



