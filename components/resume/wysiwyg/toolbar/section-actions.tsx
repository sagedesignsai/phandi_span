"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CopyIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SectionActionsProps {
  onAdd: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  className?: string;
}

/**
 * Section Actions Component
 * Actions for managing sections (add, delete, reorder, duplicate)
 */
export function SectionActions({
  onAdd,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  canMoveUp = false,
  canMoveDown = false,
  className,
}: SectionActionsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button variant="outline" size="sm" onClick={onAdd} className="gap-2">
        <PlusIcon className="size-4" />
        Add Section
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronUpIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onMoveUp && (
            <DropdownMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
              <ChevronUpIcon className="size-4 mr-2" />
              Move Up
            </DropdownMenuItem>
          )}
          {onMoveDown && (
            <DropdownMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
              <ChevronDownIcon className="size-4 mr-2" />
              Move Down
            </DropdownMenuItem>
          )}
          {onDuplicate && (
            <DropdownMenuItem onClick={onDuplicate}>
              <CopyIcon className="size-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <TrashIcon className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

