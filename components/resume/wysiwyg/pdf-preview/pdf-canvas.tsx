"use client";

import React, { useRef, useEffect, useState } from 'react';
import { BlobProvider, Document, Page } from '@react-pdf/renderer';
import type { Resume } from '@/lib/models/resume';
import { cn } from '@/lib/utils';
import { A4_DIMENSIONS } from './position-calculator';
import type { PDFTemplateComponent } from '../templates/types';

interface PDFCanvasProps {
  resume: Resume;
  template: PDFTemplateComponent;
  className?: string;
  zoom?: number;
  onLoad?: () => void;
}

/**
 * PDF Canvas Component
 * Renders PDF preview using @react-pdf/renderer
 * Uses BlobProvider to generate PDF blob and displays it in an iframe
 */
export function PDFCanvas({
  resume,
  template: TemplateComponent,
  className,
  zoom = 1.0,
  onLoad,
}: PDFCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate container dimensions maintaining A4 aspect ratio
  const aspectRatio = A4_DIMENSIONS.height / A4_DIMENSIONS.width;
  const [containerWidth, setContainerWidth] = useState(800);
  const containerHeight = containerWidth * aspectRatio * zoom;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const maxWidth = containerRef.current.clientWidth;
        setContainerWidth(Math.min(maxWidth, 800));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (pdfUrl) {
      setIsLoading(false);
      onLoad?.();
    }
  }, [pdfUrl, onLoad]);

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-muted/30 rounded-lg overflow-hidden', className)}
      style={{
        width: '100%',
        height: containerHeight,
        minHeight: 400,
      }}
    >
      <BlobProvider
        document={
          <Document>
            <Page size="A4">
              <TemplateComponent resume={resume} />
            </Page>
          </Document>
        }
      >
        {({ blob, url, loading, error }) => {
          useEffect(() => {
            if (blob && !loading && !pdfUrl) {
              const newUrl = URL.createObjectURL(blob);
              setPdfUrl(newUrl);
            }
          }, [blob, loading]);

          if (loading || isLoading) {
            return (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Generating PDF preview...</p>
                </div>
              </div>
            );
          }

          if (error) {
            return (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-destructive">Error generating PDF preview</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {error instanceof Error ? error.message : 'Unknown error'}
                  </p>
                </div>
              </div>
            );
          }

          const displayUrl = pdfUrl || url || '';

          return (
            <iframe
              ref={iframeRef}
              src={displayUrl}
              className="w-full h-full border-0"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`,
              }}
              title="PDF Preview"
            />
          );
        }}
      </BlobProvider>
    </div>
  );
}

