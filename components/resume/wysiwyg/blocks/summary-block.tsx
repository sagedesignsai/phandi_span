'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { BaseBlock } from './block';
import type { Block, SummaryBlockData } from '@/lib/resume/editor/block-types';

interface SummaryBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: SummaryBlockData) => void;
}

export function SummaryBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: SummaryBlockProps) {
  const data = block.data as SummaryBlockData;
  const [localData, setLocalData] = useState<SummaryBlockData>(data);

  const handleChange = (value: string) => {
    const updated = { ...localData, content: value };
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
        <div>
          <label className="text-sm font-medium text-muted-foreground">Summary</label>
          <Textarea
            value={localData.content || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Write a brief professional summary..."
            className="mt-1"
            rows={4}
            autoFocus
          />
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
      <p className="text-muted-foreground whitespace-pre-line">
        {data.content || 'Click to add a professional summary...'}
      </p>
    </BaseBlock>
  );
}



