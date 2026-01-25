'use client';

import React from 'react';
import { HeaderBlock } from './blocks/header-block';
import { ExperienceBlock } from './blocks/experience-block';
import { EducationBlock } from './blocks/education-block';
import { SkillBlock } from './blocks/skill-block';
import { ProjectBlock } from './blocks/project-block';
import { SummaryBlock } from './blocks/summary-block';
import { SectionBlock } from './blocks/section-block';
import { TableBlock } from './blocks/table-block';
import { ImageBlock } from './blocks/image-block';
import { DividerBlock } from './blocks/divider-block';
import type { Block } from '@/lib/resume/editor/block-types';

interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: unknown) => void;
}

export function BlockRenderer({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: BlockRendererProps) {
  const commonProps = {
    block,
    isSelected,
    isEditing,
    onSelect,
    onEdit,
    onDelete,
    onDuplicate,
    onUpdate,
  };

  switch (block.type) {
    case 'header':
      return <HeaderBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'experience':
      return <ExperienceBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'education':
      return <EducationBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'skill':
      return <SkillBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'project':
      return <ProjectBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'summary':
      return <SummaryBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'section':
      return <SectionBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'table':
      return <TableBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'image':
      return <ImageBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'divider':
      return <DividerBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;


    case 'education':
      return <EducationBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'skill':
      return <SkillBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'project':
      return <ProjectBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'summary':
      return <SummaryBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'section':
      return <SectionBlock {...commonProps} onUpdate={onUpdate as (data: typeof block.data) => void} />;

    case 'divider':
      return (
        <div className="py-4">
          <div className="border-t border-border" />
        </div>
      );

    case 'custom':
      return (
        <div className="p-4 border border-dashed rounded">
          <p className="text-sm text-muted-foreground">Custom block</p>
        </div>
      );

    default:
      return null;
  }
}



