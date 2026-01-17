import { useState, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import type { Block, BlockType } from './block-types';
import { createDefaultBlock } from './block-serialization';

/**
 * Editor State Management
 * Handles block operations and state
 */
export interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  editingBlockId: string | null;
}

export interface EditorActions {
  setBlocks: (blocks: Block[]) => void;
  addBlock: (type: BlockType, afterBlockId?: string) => Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => Block;
  reorderBlocks: (blockIds: string[]) => void;
  selectBlock: (id: string | null) => void;
  startEditing: (id: string) => void;
  stopEditing: () => void;
}

export function useEditorState(initialBlocks: Block[]): [EditorState, EditorActions] {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: BlockType, afterBlockId?: string): Block => {
    let newOrder: number;
    
    if (afterBlockId) {
      const afterBlock = blocks.find(b => b.id === afterBlockId);
      if (afterBlock) {
        // Find the next order value after this block
        const blocksAfter = blocks.filter(b => b.order > afterBlock.order);
        newOrder = blocksAfter.length > 0
          ? Math.min(...blocksAfter.map(b => b.order)) - 1
          : afterBlock.order + 1;
      } else {
        newOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) + 1 : 1;
      }
    } else {
      newOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.order)) + 1 : 1;
    }

    const newBlock = createDefaultBlock(type, newOrder);
    
    setBlocks(prev => {
      const updated = [...prev, newBlock];
      return updated.sort((a, b) => a.order - b.order);
    });

    return newBlock;
  }, [blocks]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    if (editingBlockId === id) {
      setEditingBlockId(null);
    }
  }, [selectedBlockId, editingBlockId]);

  const duplicateBlock = useCallback((id: string): Block => {
    const block = blocks.find(b => b.id === id);
    if (!block) {
      throw new Error(`Block with id ${id} not found`);
    }

    const newBlock: Block = {
      ...block,
      id: nanoid(),
      order: block.order + 0.5, // Insert right after
    };

    setBlocks(prev => {
      const updated = [...prev, newBlock];
      return updated.sort((a, b) => a.order - b.order);
    });

    return newBlock;
  }, [blocks]);

  const reorderBlocks = useCallback((blockIds: string[]) => {
    setBlocks(prev => {
      const blockMap = new Map(prev.map(b => [b.id, b]));
      const reordered = blockIds
        .map((id, index) => {
          const block = blockMap.get(id);
          if (!block) return null;
          return { ...block, order: (index + 1) * 100 };
        })
        .filter((b): b is Block => b !== null);
      
      // Keep blocks not in the reordered list
      const otherBlocks = prev.filter(b => !blockIds.includes(b.id));
      
      return [...reordered, ...otherBlocks].sort((a, b) => a.order - b.order);
    });
  }, []);

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const startEditing = useCallback((id: string) => {
    setEditingBlockId(id);
    setSelectedBlockId(id);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingBlockId(null);
  }, []);

  const state: EditorState = {
    blocks,
    selectedBlockId,
    editingBlockId,
  };

  const actions: EditorActions = {
    setBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    selectBlock,
    startEditing,
    stopEditing,
  };

  return [state, actions];
}



