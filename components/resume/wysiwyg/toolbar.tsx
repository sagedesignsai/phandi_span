'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  FolderKanbanIcon,
  FileTextIcon,
  MinusIcon,
  MessageSquareIcon,
} from 'lucide-react';
import type { BlockType } from '@/lib/resume/editor/block-types';

interface ToolbarProps {
  onAddBlock: (type: BlockType) => void;
  onSave?: () => void;
  isDirty?: boolean;
  className?: string;
  showChatToggle?: boolean;
  onToggleChat?: () => void;
}

const blockTypes: Array<{ type: BlockType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { type: 'section', label: 'Section', icon: FileTextIcon },
  { type: 'experience', label: 'Experience', icon: BriefcaseIcon },
  { type: 'education', label: 'Education', icon: GraduationCapIcon },
  { type: 'skill', label: 'Skill', icon: CodeIcon },
  { type: 'project', label: 'Project', icon: FolderKanbanIcon },
  { type: 'summary', label: 'Summary', icon: FileTextIcon },
  { type: 'divider', label: 'Divider', icon: MinusIcon },
];

export function EditorToolbar({ onAddBlock, onSave, isDirty, className, showChatToggle, onToggleChat }: ToolbarProps) {
  return (
    <div className={`flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30 sticky top-0 z-10 overflow-x-auto ${className || ''}`}>
      {/* Block type buttons */}
      <div className="flex items-center gap-1">
        {blockTypes.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            onClick={() => onAddBlock(type)}
            title={label}
            className="h-8 w-8 p-0 shrink-0 hover:bg-accent"
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-border mx-1" />

      {/* Chat Toggle Button */}
      {showChatToggle && onToggleChat && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleChat}
            title="Toggle AI Chat"
            className="h-8 px-3 text-xs font-medium shrink-0 hover:bg-accent"
          >
            <MessageSquareIcon className="size-4 mr-1" />
            AI Chat
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Save Button */}
      {onSave && (
        <Button
          variant={isDirty ? 'default' : 'outline'}
          size="sm"
          onClick={onSave}
          disabled={!isDirty}
          className="h-8 px-3 text-xs font-medium shrink-0"
        >
          {isDirty ? 'Save Changes' : 'Saved'}
        </Button>
      )}
    </div>
  );
}



