"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Editable Text Component
 * Inline text editor that appears when clicking on text in PDF preview
 */
export function EditableText({
  value,
  onChange,
  onBlur,
  multiline = false,
  placeholder,
  className,
  style,
  fontSize = 11,
  fontWeight = 'normal',
  textAlign = 'left',
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      } else if (!multiline && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalValue(value); // Revert changes
      handleBlur();
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <Textarea
          ref={textareaRef}
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('resize-none border-primary focus-visible:ring-2', className)}
          style={{
            fontSize: `${fontSize}pt`,
            fontWeight,
            textAlign,
            ...style,
          }}
        />
      );
    }

    return (
      <Input
        ref={inputRef}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn('border-primary focus-visible:ring-2', className)}
        style={{
          fontSize: `${fontSize}pt`,
          fontWeight,
          textAlign,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'cursor-text hover:bg-primary/5 rounded px-1 py-0.5 transition-colors',
        className
      )}
      style={{
        fontSize: `${fontSize}pt`,
        fontWeight,
        textAlign,
        minHeight: `${fontSize * 1.2}pt`,
        ...style,
      }}
    >
      {value || <span className="text-muted-foreground italic">{placeholder || 'Click to edit'}</span>}
    </div>
  );
}

