'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Block } from '@/lib/resume/editor/block-types';

interface BlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Base Block Component
 * Provides common block functionality (selection, editing, actions)
 */
export function BaseBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  children,
  className,
}: BlockProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.stopPropagation();
      onSelect();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      className={cn(
        'group relative',
        'transition-all duration-150',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        isEditing && 'ring-2 ring-primary',
        className
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Block Content */}
      <div className={cn(
        'min-h-[40px]',
        isSelected && 'bg-primary/5',
        isEditing && 'bg-primary/10'
      )}>
        {children}
      </div>

      {/* Block Actions (shown on hover/selection) */}
      {(isSelected || isEditing) && (
        <div className="absolute -top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 bg-background border border-border rounded shadow-sm hover:bg-muted text-xs"
            title="Duplicate"
          >
            📋
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 bg-background border border-border rounded shadow-sm hover:bg-destructive hover:text-destructive-foreground text-xs"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}



