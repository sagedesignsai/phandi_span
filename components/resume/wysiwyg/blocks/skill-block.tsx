'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseBlock } from './block';
import type { Block, SkillBlockData } from '@/lib/resume/editor/block-types';

interface SkillBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: SkillBlockData) => void;
}

export function SkillBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: SkillBlockProps) {
  const data = block.data as SkillBlockData;
  const [localData, setLocalData] = useState<SkillBlockData>(data);

  const handleChange = (field: keyof SkillBlockData, value: unknown) => {
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
            <label className="text-sm font-medium text-muted-foreground">Skill Name</label>
            <Input
              value={localData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="JavaScript"
              className="mt-1"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <Input
                value={localData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="Programming Languages"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Level</label>
              <Select
                value={localData.level || ''}
                onValueChange={(value) => handleChange('level', value as SkillBlockData['level'])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
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
      className="p-2"
    >
      <span className="text-sm px-2 py-1 bg-muted rounded text-muted-foreground">
        {data.name || 'Skill'}
        {data.level && ` (${data.level})`}
      </span>
    </BaseBlock>
  );
}



