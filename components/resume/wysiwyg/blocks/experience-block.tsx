'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { BaseBlock } from './block';
import type { Block, ExperienceBlockData } from '@/lib/resume/editor/block-types';

interface ExperienceBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: ExperienceBlockData) => void;
}

export function ExperienceBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: ExperienceBlockProps) {
  const data = block.data as ExperienceBlockData;
  const [localData, setLocalData] = useState<ExperienceBlockData>(data);

  const handleChange = (field: keyof ExperienceBlockData, value: unknown) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleAchievementChange = (index: number, value: string) => {
    const achievements = [...(localData.achievements || [])];
    achievements[index] = value;
    handleChange('achievements', achievements);
  };

  const addAchievement = () => {
    const achievements = [...(localData.achievements || []), ''];
    handleChange('achievements', achievements);
  };

  const removeAchievement = (index: number) => {
    const achievements = [...(localData.achievements || [])];
    achievements.splice(index, 1);
    handleChange('achievements', achievements);
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
              <label className="text-sm font-medium text-muted-foreground">Position</label>
              <Input
                value={localData.position || ''}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="Software Engineer"
                className="mt-1"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <Input
                value={localData.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company Name"
                className="mt-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Start Date</label>
              <Input
                value={localData.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                placeholder="Jan 2020"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">End Date</label>
              <Input
                value={localData.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                placeholder="Dec 2023"
                className="mt-1"
                disabled={localData.current}
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={localData.current}
                  onCheckedChange={(checked) => handleChange('current', checked === true)}
                />
                <label htmlFor="current" className="text-sm font-medium">
                  Current
                </label>
              </div>
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
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <Textarea
              value={localData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your role and responsibilities..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Achievements</label>
            <div className="space-y-2 mt-1">
              {(localData.achievements || []).map((achievement, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={achievement}
                    onChange={(e) => handleAchievementChange(idx, e.target.value)}
                    placeholder="Achievement or result"
                    className="flex-1"
                  />
                  <button
                    onClick={() => removeAchievement(idx)}
                    className="px-2 text-destructive hover:bg-destructive/10 rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={addAchievement}
                className="text-sm text-primary hover:underline"
              >
                + Add Achievement
              </button>
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
            <h3 className="font-semibold text-foreground">{data.position || 'Position'}</h3>
            <p className="text-muted-foreground">{data.company || 'Company'}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>
              {data.startDate} - {data.current ? 'Present' : data.endDate || 'Present'}
            </div>
            {data.location && <div>{data.location}</div>}
          </div>
        </div>
        {data.description && (
          <p className="text-sm text-muted-foreground mt-2">{data.description}</p>
        )}
        {data.achievements && data.achievements.length > 0 && (
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
            {data.achievements.map((achievement, idx) => (
              <li key={idx}>{achievement}</li>
            ))}
          </ul>
        )}
      </div>
    </BaseBlock>
  );
}

