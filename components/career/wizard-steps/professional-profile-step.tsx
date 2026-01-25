"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import type { CareerProfileContext } from '@/lib/models/career-profile';

interface ProfessionalProfileStepProps {
  data: CareerProfileContext;
  onChange: (data: Partial<CareerProfileContext>) => void;
}

export function ProfessionalProfileStep({ data, onChange }: ProfessionalProfileStepProps) {
  const [newStrength, setNewStrength] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const addToArray = (field: string, value: string, setValue: (value: string) => void) => {
    if (!value.trim()) return;
    
    const currentArray = (data as any)[field] || [];
    onChange({
      [field]: [...currentArray, value.trim()],
    });
    setValue('');
  };

  const removeFromArray = (field: string, index: number) => {
    const currentArray = (data as any)[field] || [];
    onChange({
      [field]: currentArray.filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Professional Profile</h2>
        <p className="text-muted-foreground">
          Describe your professional identity and unique value
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={data.professionalSummary || ''}
            onChange={(e) => onChange({ professionalSummary: e.target.value })}
            placeholder="Brief overview of your professional background, expertise, and what drives you..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            This helps AI understand your professional identity
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value-prop">Unique Value Proposition</Label>
          <Textarea
            id="value-prop"
            value={data.uniqueValueProposition || ''}
            onChange={(e) => onChange({ uniqueValueProposition: e.target.value })}
            placeholder="What makes you unique? What specific value do you bring to organizations?"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Key Strengths</Label>
            <Input
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('keyStrengths', newStrength, setNewStrength);
                }
              }}
              placeholder="Add strength and press Enter"
            />
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {data.keyStrengths?.map((strength, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {strength}
                  <button onClick={() => removeFromArray('keyStrengths', i)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Career Highlights</Label>
            <Input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addToArray('careerHighlights', newHighlight, setNewHighlight);
                }
              }}
              placeholder="Add highlight and press Enter"
            />
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {data.careerHighlights?.map((highlight, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {highlight}
                  <button onClick={() => removeFromArray('careerHighlights', i)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Additional Context for AI</Label>
          <Textarea
            id="context"
            value={data.additionalContext || ''}
            onChange={(e) => onChange({ additionalContext: e.target.value })}
            placeholder="Any additional information that would help AI tools understand your career better..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            This context will be used by AI to personalize cover letters, job recommendations, and more
          </p>
        </div>
      </div>
    </div>
  );
}
