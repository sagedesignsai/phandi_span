"use client";

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SparklesIcon, CheckCircle2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIUpdateIndicatorProps {
  show: boolean;
  message?: string;
  className?: string;
}

/**
 * AI Update Indicator
 * Shows visual feedback when AI makes changes to the resume
 */
export function AIUpdateIndicator({ show, message, className }: AIUpdateIndicatorProps) {
  if (!show) return null;

  return (
    <Alert className={cn('border-primary/20 bg-primary/5 animate-in slide-in-from-top-2', className)}>
      <SparklesIcon className="size-4 text-primary" />
      <AlertDescription className="text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2Icon className="size-4 text-green-600" />
          <span>
            {message || 'Resume updated by AI! Changes are visible in the editor.'}
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
}

