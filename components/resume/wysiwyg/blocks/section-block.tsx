'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseBlock } from './block';
import type { Block, SectionBlockData } from '@/lib/resume/editor/block-types';

interface SectionBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: SectionBlockData) => void;
}

export function SectionBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: SectionBlockProps) {
  const data = block.data as SectionBlockData;
  const [localData, setLocalData] = useState<SectionBlockData>(data);

  const handleChange = (field: keyof SectionBlockData, value: unknown) => {
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
        className="p-4 border-2 border-primary rounded-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Section Title</label>
            <Input
              value={localData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Work Experience"
              className="mt-1"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Section Type</label>
            <Select
              value={localData.sectionType}
              onValueChange={(value) => handleChange('sectionType', value as SectionBlockData['sectionType'])}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="certifications">Certifications</SelectItem>
                <SelectItem value="languages">Languages</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
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
      <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
        {data.title || 'Section Title'}
      </h2>
    </BaseBlock>
  );
}



