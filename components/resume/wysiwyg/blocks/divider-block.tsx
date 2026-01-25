'use client';

import React from 'react';
import { BaseBlock } from './block';
import type { Block } from '@/lib/resume/editor/block-types';

interface DividerBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: unknown) => void;
}

export function DividerBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: DividerBlockProps) {
  return (
    <BaseBlock
      block={block}
      isSelected={isSelected}
      isEditing={isEditing}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
    >
      <hr className="border-t border-gray-300 my-4" />
    </BaseBlock>
  );
}
