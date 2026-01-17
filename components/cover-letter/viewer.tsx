"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CoverLetter } from '@/lib/models/cover-letter';

interface CoverLetterViewerProps {
  coverLetter: CoverLetter;
  className?: string;
}

export function CoverLetterViewer({ coverLetter, className }: CoverLetterViewerProps) {
  const paragraphs = coverLetter.content.split('\n\n').filter(p => p.trim());

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardContent className="p-8 md:p-12">
        <div className="space-y-6 font-serif">
          {/* Header */}
          <div className="space-y-2 border-b pb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Cover Letter</h1>
              <Badge variant="outline">{coverLetter.template}</Badge>
            </div>
            {(coverLetter.jobTitle || coverLetter.companyName) && (
              <p className="text-sm text-muted-foreground">
                {coverLetter.jobTitle && <span>{coverLetter.jobTitle}</span>}
                {coverLetter.jobTitle && coverLetter.companyName && <span> at </span>}
                {coverLetter.companyName && <span className="font-medium">{coverLetter.companyName}</span>}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="text-sm text-muted-foreground">
            {new Date(coverLetter.metadata.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {/* Recipient */}
          {coverLetter.recipientName && (
            <div className="text-sm">
              <p>{coverLetter.recipientName}</p>
              {coverLetter.companyName && <p>{coverLetter.companyName}</p>}
            </div>
          )}

          {/* Content */}
          <div className="space-y-4 text-base leading-relaxed whitespace-pre-wrap">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Metadata */}
          <div className="pt-6 border-t text-xs text-muted-foreground space-y-1">
            <p>Words: {coverLetter.metadata.wordCount || 0}</p>
            <p>Last updated: {new Date(coverLetter.metadata.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
