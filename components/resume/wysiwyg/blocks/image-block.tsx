'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BaseBlock } from './block';
import { UploadIcon, ImageIcon } from 'lucide-react';
import type { Block, ImageBlockData } from '@/lib/resume/editor/block-types';

interface ImageBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: ImageBlockData) => void;
}

export function ImageBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: ImageBlockProps) {
  const data = block.data as ImageBlockData;
  const [localData, setLocalData] = useState<ImageBlockData>(data);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateData = (updates: Partial<ImageBlockData>) => {
    const updated = { ...localData, ...updates };
    setLocalData(updated);
    onUpdate(updated);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateData({ src: result, alt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[localData.alignment || 'center'];

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
              <Label>Image Source</Label>
              <div className="flex gap-2">
                <Input
                  value={localData.src}
                  onChange={(e) => updateData({ src: e.target.value })}
                  placeholder="Image URL or upload file"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="size-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <Label>Alignment</Label>
              <Select
                value={localData.alignment}
                onValueChange={(value: 'left' | 'center' | 'right') => updateData({ alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={localData.width || ''}
                onChange={(e) => updateData({ width: parseInt(e.target.value) || undefined })}
                placeholder="Auto"
              />
            </div>
            <div>
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={localData.height || ''}
                onChange={(e) => updateData({ height: parseInt(e.target.value) || undefined })}
                placeholder="Auto"
              />
            </div>
          </div>

          <div>
            <Label>Alt Text</Label>
            <Input
              value={localData.alt || ''}
              onChange={(e) => updateData({ alt: e.target.value })}
              placeholder="Image description"
            />
          </div>

          <div>
            <Label>Caption</Label>
            <Input
              value={localData.caption || ''}
              onChange={(e) => updateData({ caption: e.target.value })}
              placeholder="Image caption (optional)"
            />
          </div>

          {localData.src && (
            <div className={alignmentClass}>
              <img
                src={localData.src}
                alt={localData.alt || 'Preview'}
                style={{
                  width: localData.width ? `${localData.width}px` : 'auto',
                  height: localData.height ? `${localData.height}px` : 'auto',
                  maxWidth: '100%',
                }}
                className="border rounded"
              />
              {localData.caption && (
                <p className="text-sm text-muted-foreground mt-1">{localData.caption}</p>
              )}
            </div>
          )}
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
    >
      <div className={alignmentClass}>
        {localData.src ? (
          <>
            <img
              src={localData.src}
              alt={localData.alt || 'Image'}
              style={{
                width: localData.width ? `${localData.width}px` : 'auto',
                height: localData.height ? `${localData.height}px` : 'auto',
                maxWidth: '100%',
              }}
              className="rounded"
            />
            {localData.caption && (
              <p className="text-sm text-muted-foreground mt-1">{localData.caption}</p>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded">
            <div className="text-center">
              <ImageIcon className="size-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No image selected</p>
            </div>
          </div>
        )}
      </div>
    </BaseBlock>
  );
}
