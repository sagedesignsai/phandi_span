'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { BaseBlock } from './block';
import type { Block, EducationBlockData } from '@/lib/resume/editor/block-types';

interface EducationBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: EducationBlockData) => void;
}

export function EducationBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: EducationBlockProps) {
  const data = block.data as EducationBlockData;
  const [localData, setLocalData] = useState<EducationBlockData>(data);

  const handleChange = (field: keyof EducationBlockData, value: unknown) => {
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Degree</label>
              <Input
                value={localData.degree || ''}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder="Bachelor of Science"
                className="mt-1"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Field</label>
              <Input
                value={localData.field || ''}
                onChange={(e) => handleChange('field', e.target.value)}
                placeholder="Computer Science"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Institution</label>
            <Input
              value={localData.institution || ''}
              onChange={(e) => handleChange('institution', e.target.value)}
              placeholder="University Name"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Start Date</label>
              <Input
                value={localData.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                placeholder="2018"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">End Date</label>
              <Input
                value={localData.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                placeholder="2022"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">GPA</label>
              <Input
                value={localData.gpa || ''}
                onChange={(e) => handleChange('gpa', e.target.value)}
                placeholder="3.8"
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
          <div>
            <h3 className="font-semibold text-foreground">
              {data.degree || 'Degree'}
              {data.field && ` in ${data.field}`}
            </h3>
            <p className="text-muted-foreground">{data.institution || 'Institution'}</p>
          </div>
          {data.startDate && data.endDate && (
            <div className="text-right text-sm text-muted-foreground">
              {data.startDate} - {data.endDate}
            </div>
          )}
        </div>
        {data.gpa && <p className="text-sm text-muted-foreground mt-1">GPA: {data.gpa}</p>}
      </div>
    </BaseBlock>
  );
}



