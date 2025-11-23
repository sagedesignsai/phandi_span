"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  ListIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TextFormattingProps {
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
  onBulletList?: () => void;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Text Formatting Component
 * Text formatting controls for custom sections
 */
export function TextFormatting({
  onBold,
  onItalic,
  onUnderline,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
  onBulletList,
  isBold = false,
  isItalic = false,
  isUnderline = false,
  alignment = 'left',
  className,
}: TextFormattingProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 border-r pr-2 ${className}`}>
        {onBold && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isBold ? 'default' : 'ghost'}
                size="icon"
                onClick={onBold}
                className="h-8 w-8"
              >
                <BoldIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold (Ctrl+B)</TooltipContent>
          </Tooltip>
        )}

        {onItalic && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isItalic ? 'default' : 'ghost'}
                size="icon"
                onClick={onItalic}
                className="h-8 w-8"
              >
                <ItalicIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic (Ctrl+I)</TooltipContent>
          </Tooltip>
        )}

        {onUnderline && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isUnderline ? 'default' : 'ghost'}
                size="icon"
                onClick={onUnderline}
                className="h-8 w-8"
              >
                <UnderlineIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Underline (Ctrl+U)</TooltipContent>
          </Tooltip>
        )}

        <div className="w-px h-6 bg-border mx-1" />

        {onAlignLeft && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={alignment === 'left' ? 'default' : 'ghost'}
                size="icon"
                onClick={onAlignLeft}
                className="h-8 w-8"
              >
                <AlignLeftIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>
        )}

        {onAlignCenter && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={alignment === 'center' ? 'default' : 'ghost'}
                size="icon"
                onClick={onAlignCenter}
                className="h-8 w-8"
              >
                <AlignCenterIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>
        )}

        {onAlignRight && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={alignment === 'right' ? 'default' : 'ghost'}
                size="icon"
                onClick={onAlignRight}
                className="h-8 w-8"
              >
                <AlignRightIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        )}

        {onBulletList && (
          <>
            <div className="w-px h-6 bg-border mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBulletList}
                  className="h-8 w-8"
                >
                  <ListIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

