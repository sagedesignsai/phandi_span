'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { BaseBlock } from './block';
import type { Block, HeaderBlockData } from '@/lib/resume/editor/block-types';

interface HeaderBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: HeaderBlockData) => void;
}

export function HeaderBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: HeaderBlockProps) {
  const data = block.data as HeaderBlockData;
  const [localData, setLocalData] = useState<HeaderBlockData>(data);

  const handleChange = (field: keyof HeaderBlockData, value: string) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
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
        className="p-6 border-2 border-primary rounded-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <Input
              value={localData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <Input
              value={localData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Software Engineer"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                value={localData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <Input
                value={localData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <Input
              value={localData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
              <Input
                type="url"
                value={localData.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">GitHub</label>
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
      className="p-6"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{data.name || 'Your Name'}</h1>
        {data.title && <p className="text-lg text-muted-foreground">{data.title}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          {data.linkedin && (
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              LinkedIn
            </a>
          )}
          {data.github && (
            <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              GitHub
            </a>
          )}
          {data.website && (
            <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Website
            </a>
          )}
          {data.portfolio && (
            <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </div>
    </BaseBlock>
  );
}



