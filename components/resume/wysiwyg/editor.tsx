'use client';

import React, { useEffect, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditorToolbar } from './toolbar';
import { BlockRenderer } from './block-renderer';
import { useResumeWysiwyg } from '@/lib/hooks/use-resume-wysiwyg';
import type { Resume } from '@/lib/models/resume';
import { cn } from '@/lib/utils';
import { GripVerticalIcon } from 'lucide-react';

interface WysiwygEditorProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onCancel?: () => void;
  className?: string;
  showChatToggle?: boolean;
  onToggleChat?: () => void;
}

function SortableBlockWrapper({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: {
  block: any;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: unknown) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 h-full w-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </div>
      <div className="pl-6">
        <BlockRenderer
          block={block}
          isSelected={isSelected}
          isEditing={isEditing}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

export function WysiwygEditor({ resume, onSave, onCancel, className, showChatToggle, onToggleChat }: WysiwygEditorProps) {
  const {
    blocks,
    resume: currentResume,
    template,
    isDirty,
    selectedBlockId,
    editingBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    selectBlock,
    startEditing,
    stopEditing,
    save,
    updateTemplate,
  } = useResumeWysiwyg(resume, onSave);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use refs for callbacks to avoid dependency issues
  const selectBlockRef = useRef(selectBlock);
  const stopEditingRef = useRef(stopEditing);
  selectBlockRef.current = selectBlock;
  stopEditingRef.current = stopEditing;

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-block-id]')) {
        selectBlockRef.current(null);
        if (editingBlockId) {
          stopEditingRef.current();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingBlockId]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && editingBlockId) {
        stopEditingRef.current();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [editingBlockId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id);
      const newIndex = blocks.findIndex(b => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(blocks, oldIndex, newIndex);
        const blockIds = reordered.map(b => b.id);
        reorderBlocks(blockIds);
      }
    }
  };

  const handleBlockUpdate = (blockId: string, data: unknown) => {
    updateBlock(blockId, data as any);
  };

  const blockIds = blocks.map(b => b.id);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <EditorToolbar
        onAddBlock={addBlock}
        onSave={save}
        isDirty={isDirty}
        showChatToggle={showChatToggle}
        onToggleChat={onToggleChat}
      />
      
      {/* Editor Panel */}
      <div className="flex-1 overflow-hidden bg-background">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-4xl mx-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {blocks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No blocks yet. Click "Add Block" to get started.</p>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <SortableBlockWrapper
                        key={block.id}
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        isEditing={editingBlockId === block.id}
                        onSelect={() => selectBlock(block.id)}
                        onEdit={() => startEditing(block.id)}
                        onDelete={() => deleteBlock(block.id)}
                        onDuplicate={() => duplicateBlock(block.id)}
                        onUpdate={(data) => handleBlockUpdate(block.id, data)}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

