"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { A4_DIMENSIONS, getViewportDimensions, type ViewportDimensions } from './position-calculator';

interface EditableRegion {
  id: string;
  path: string; // JSON path to the value in resume data
  x: number; // PDF coordinates in points
  y: number;
  width: number;
  height: number;
  type: 'text' | 'textarea' | 'section' | 'item';
  multiline?: boolean;
}

interface PDFOverlayProps {
  editableRegions: EditableRegion[];
  onRegionClick: (region: EditableRegion) => void;
  selectedRegionId?: string;
  className?: string;
  zoom?: number;
  children?: React.ReactNode;
}

/**
 * PDF Overlay Component
 * Interactive overlay layer positioned over PDF preview
 * Handles click events and manages editable regions
 */
export function PDFOverlay({
  editableRegions,
  onRegionClick,
  selectedRegionId,
  className,
  zoom = 1.0,
  children,
}: PDFOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportDimensions>({
    width: 800,
    height: 1133,
    zoom,
  });

  useEffect(() => {
    const updateViewport = () => {
      if (overlayRef.current) {
        setViewport(getViewportDimensions(overlayRef.current, zoom));
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [zoom]);

  // Calculate scale factor
  const scaleX = viewport.width / A4_DIMENSIONS.width;
  const scaleY = viewport.height / A4_DIMENSIONS.height;
  const scale = Math.min(scaleX, scaleY) * zoom;

  // Calculate offset to center the PDF
  const scaledPdfWidth = A4_DIMENSIONS.width * scale;
  const scaledPdfHeight = A4_DIMENSIONS.height * scale;
  const offsetX = (viewport.width - scaledPdfWidth) / 2;
  const offsetY = (viewport.height - scaledPdfHeight) / 2;

  const handleRegionClick = (region: EditableRegion, e: React.MouseEvent) => {
    e.stopPropagation();
    onRegionClick(region);
  };

  return (
    <div
      ref={overlayRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {editableRegions.map((region) => {
        const left = offsetX + region.x * scale;
        const top = offsetY + region.y * scale;
        const width = region.width * scale;
        const height = region.height * scale;
        const isSelected = selectedRegionId === region.id;

        return (
          <div
            key={region.id}
            className={cn(
              'absolute cursor-text pointer-events-auto transition-all',
              isSelected
                ? 'ring-2 ring-primary ring-offset-1 bg-primary/5'
                : 'hover:bg-primary/5 hover:ring-1 hover:ring-primary/50'
            )}
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              minHeight: '20px',
            }}
            onClick={(e) => handleRegionClick(region, e)}
            title={`Click to edit: ${region.path}`}
          />
        );
      })}
      {children}
    </div>
  );
}

