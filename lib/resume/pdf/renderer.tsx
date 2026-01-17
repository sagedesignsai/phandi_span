'use client';

import React from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { ResumePDFDocument } from './components';
import type { Resume } from '@/lib/models/resume';

/**
 * PDF Preview Component using BlobProvider
 * Provides live PDF preview in an iframe
 */
export function PDFPreview({ resume, className }: { resume: Resume; className?: string }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <BlobProvider document={<ResumePDFDocument resume={resume} />}>
        {({ url, loading, error }) => {
          if (loading) {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">Generating PDF preview...</div>
              </div>
            );
          }

          if (error) {
            return (
              <div className="flex items-center justify-center h-full">
                <div className="text-destructive">Error generating PDF preview</div>
              </div>
            );
          }

          if (!url) {
            return null;
          }

          return (
            <iframe
              src={url}
              className="w-full h-full border-0"
              style={{ minHeight: '800px' }}
              title="PDF Preview"
            />
          );
        }}
      </BlobProvider>
    </div>
  );
}

/**
 * Export PDF function (reuses existing export utility)
 */
export { generatePDF } from '@/lib/utils/export';



