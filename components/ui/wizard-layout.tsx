"use client";

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
}

interface WizardLayoutProps {
  steps: WizardStep[];
  currentStep: number;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepClick?: (stepIndex: number) => void;
  nextLabel?: string;
  previousLabel?: string;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLoading?: boolean;
}

export function WizardLayout({
  steps,
  currentStep,
  children,
  onNext,
  onPrevious,
  onStepClick,
  nextLabel = "Next",
  previousLabel = "Previous",
  canGoNext = true,
  canGoPrevious = true,
  isLoading = false,
}: WizardLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = onStepClick && (isCompleted || index <= currentStep + 1);

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isClickable && "hover:bg-muted/50",
                  !isClickable && "cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isActive && "border-primary text-primary bg-primary/10",
                    !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="text-left">
                  <div className={cn(
                    "font-medium text-sm",
                    isActive && "text-primary",
                    isCompleted && "text-foreground",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}>
                    {step.title}
                    {step.optional && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Optional
                      </Badge>
                    )}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </button>
              {index < steps.length - 1 && (
                <ChevronRightIcon className="w-4 h-4 text-muted-foreground mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {children}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || currentStep === 0 || isLoading}
        >
          {previousLabel}
        </Button>
        <Button
          onClick={onNext}
          disabled={!canGoNext || isLoading}
        >
          {isLoading ? "Processing..." : nextLabel}
        </Button>
      </div>
    </div>
  );
}
