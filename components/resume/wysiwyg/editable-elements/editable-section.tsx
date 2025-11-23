"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditableText } from './editable-text';
import { PlusIcon, TrashIcon, GripVerticalIcon } from 'lucide-react';
import type { ResumeSection, SectionType } from '@/lib/models/resume';

interface EditableSectionProps {
  section: ResumeSection;
  onUpdate: (updates: Partial<ResumeSection>) => void;
  onDelete: () => void;
  onAddItem: () => void;
  onDeleteItem: (itemId: string) => void;
  onReorderItems?: (itemId: string, direction: 'up' | 'down') => void;
  className?: string;
}

const sectionTypeLabels: Record<SectionType, string> = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  summary: 'Summary',
  certifications: 'Certifications',
  languages: 'Languages',
  custom: 'Custom',
};

/**
 * Editable Section Component
 * Section-level editor with title, type, and item management
 */
export function EditableSection({
  section,
  onUpdate,
  onDelete,
  onAddItem,
  onDeleteItem,
  onReorderItems,
  className,
}: EditableSectionProps) {
  return (
    <div className={className}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <EditableText
            value={section.title}
            onChange={(value) => onUpdate({ title: value })}
            placeholder="Section Title"
            fontSize={14}
            fontWeight="bold"
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={section.type}
            onValueChange={(value) => onUpdate({ type: value as SectionType })}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sectionTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Section Content */}
      <div className="space-y-2">
        {section.items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">No items in this section</p>
            <Button variant="outline" size="sm" onClick={onAddItem}>
              <PlusIcon className="size-4 mr-2" />
              Add Item
            </Button>
          </div>
        ) : (
          section.items.map((item, index) => {
            const itemId = typeof item === 'object' && 'id' in item ? item.id : `item-${index}`;
            return (
              <div key={itemId} className="flex items-start gap-2 group">
                {onReorderItems && (
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onReorderItems(itemId, 'up')}
                      disabled={index === 0}
                    >
                      <GripVerticalIcon className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onReorderItems(itemId, 'down')}
                      disabled={index === section.items.length - 1}
                    >
                      <GripVerticalIcon className="size-3" />
                    </Button>
                  </div>
                )}
                <div className="flex-1">
                  {/* Item content will be rendered by EditableItem component */}
                  <div className="text-sm text-muted-foreground">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteItem(itemId)}
                  className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="size-3" />
                </Button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Item Button */}
      {section.items.length > 0 && (
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={onAddItem}>
            <PlusIcon className="size-4 mr-2" />
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
}

