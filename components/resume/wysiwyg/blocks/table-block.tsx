'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BaseBlock } from './block';
import { PlusIcon, TrashIcon } from 'lucide-react';
import type { Block, TableBlockData } from '@/lib/resume/editor/block-types';

interface TableBlockProps {
  block: Block;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (data: TableBlockData) => void;
}

export function TableBlock({
  block,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onUpdate,
}: TableBlockProps) {
  const data = block.data as TableBlockData;
  const [localData, setLocalData] = useState<TableBlockData>(data);

  const updateData = (updates: Partial<TableBlockData>) => {
    const updated = { ...localData, ...updates };
    setLocalData(updated);
    onUpdate(updated);
  };

  const addColumn = () => {
    const newHeaders = [...localData.headers, `Column ${localData.headers.length + 1}`];
    const newRows = localData.rows.map(row => [...row, '']);
    updateData({ headers: newHeaders, rows: newRows });
  };

  const removeColumn = (index: number) => {
    if (localData.headers.length <= 1) return;
    const newHeaders = localData.headers.filter((_, i) => i !== index);
    const newRows = localData.rows.map(row => row.filter((_, i) => i !== index));
    updateData({ headers: newHeaders, rows: newRows });
  };

  const addRow = () => {
    const newRow = new Array(localData.headers.length).fill('');
    updateData({ rows: [...localData.rows, newRow] });
  };

  const removeRow = (index: number) => {
    if (localData.rows.length <= 1) return;
    const newRows = localData.rows.filter((_, i) => i !== index);
    updateData({ rows: newRows });
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...localData.headers];
    newHeaders[index] = value;
    updateData({ headers: newHeaders });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...localData.rows];
    newRows[rowIndex][colIndex] = value;
    updateData({ rows: newRows });
  };

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
          <div className="flex items-center gap-4">
            <Input
              value={localData.title || ''}
              onChange={(e) => updateData({ title: e.target.value })}
              placeholder="Table title"
              className="font-medium"
            />
            <div className="flex items-center gap-2">
              <Switch
                checked={localData.showHeaders}
                onCheckedChange={(checked) => updateData({ showHeaders: checked })}
              />
              <Label>Headers</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={localData.bordered}
                onCheckedChange={(checked) => updateData({ bordered: checked })}
              />
              <Label>Borders</Label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${localData.bordered ? 'border border-gray-300' : ''}`}>
              {localData.showHeaders && (
                <thead>
                  <tr>
                    {localData.headers.map((header, index) => (
                      <th key={index} className={`p-2 ${localData.bordered ? 'border border-gray-300' : ''}`}>
                        <div className="flex items-center gap-1">
                          <Input
                            value={header}
                            onChange={(e) => updateHeader(index, e.target.value)}
                            className="text-sm font-medium"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeColumn(index)}
                            disabled={localData.headers.length <= 1}
                          >
                            <TrashIcon className="size-3" />
                          </Button>
                        </div>
                      </th>
                    ))}
                    <th className="p-2">
                      <Button size="sm" variant="ghost" onClick={addColumn}>
                        <PlusIcon className="size-3" />
                      </Button>
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {localData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className={`p-2 ${localData.bordered ? 'border border-gray-300' : ''}`}>
                        <Input
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="text-sm"
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeRow(rowIndex)}
                        disabled={localData.rows.length <= 1}
                      >
                        <TrashIcon className="size-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={localData.headers.length + 1} className="p-2">
                    <Button size="sm" variant="ghost" onClick={addRow} className="w-full">
                      <PlusIcon className="size-3 mr-1" />
                      Add Row
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
      <div className="space-y-2">
        {localData.title && (
          <h3 className="font-medium text-sm">{localData.title}</h3>
        )}
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${localData.bordered ? 'border border-gray-300' : ''}`}>
            {localData.showHeaders && (
              <thead>
                <tr>
                  {localData.headers.map((header, index) => (
                    <th key={index} className={`p-2 text-left font-medium ${localData.bordered ? 'border border-gray-300' : ''}`}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {localData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className={`p-2 ${localData.bordered ? 'border border-gray-300' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseBlock>
  );
}
