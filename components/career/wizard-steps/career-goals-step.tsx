"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import type { CareerProfileContext } from '@/lib/models/career-profile';

interface CareerGoalsStepProps {
  data: CareerProfileContext;
  onChange: (data: Partial<CareerProfileContext>) => void;
}

export function CareerGoalsStep({ data, onChange }: CareerGoalsStepProps) {
  const [newRole, setNewRole] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCompany, setNewCompany] = useState('');

  const addToArray = (field: string, value: string) => {
    if (!value.trim()) return;
    
    const currentGoals = data.careerGoals || {};
    const currentArray = (currentGoals as any)[field] || [];
    
    onChange({
      careerGoals: {
        ...currentGoals,
        [field]: [...currentArray, value.trim()],
      },
    });
  };

  const removeFromArray = (field: string, index: number) => {
    const currentGoals = data.careerGoals || {};
    const currentArray = (currentGoals as any)[field] || [];
    
    onChange({
      careerGoals: {
        ...currentGoals,
        [field]: currentArray.filter((_: any, i: number) => i !== index),
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string, setValue: (value: string) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addToArray(field, e.currentTarget.value);
      setValue('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Career Goals</h2>
        <p className="text-muted-foreground">
          Define your career aspirations to help AI provide better guidance
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="short-term">Short-term Goals (1-2 years)</Label>
          <Textarea
            id="short-term"
            value={data.careerGoals?.shortTerm || ''}
            onChange={(e) => onChange({
              careerGoals: {
                ...data.careerGoals,
                shortTerm: e.target.value,
              },
            })}
            placeholder="e.g., Become a senior developer, lead a team project..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="long-term">Long-term Goals (5+ years)</Label>
          <Textarea
            id="long-term"
            value={data.careerGoals?.longTerm || ''}
            onChange={(e) => onChange({
              careerGoals: {
                ...data.careerGoals,
                longTerm: e.target.value,
              },
            })}
            placeholder="e.g., CTO, start own company, become industry expert..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Target Roles</Label>
            <Input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'targetRoles', setNewRole)}
              placeholder="Add role and press Enter"
            />
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {data.careerGoals?.targetRoles?.map((role, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {role}
                  <button onClick={() => removeFromArray('targetRoles', i)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Industries</Label>
            <Input
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'targetIndustries', setNewIndustry)}
              placeholder="Add industry and press Enter"
            />
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {data.careerGoals?.targetIndustries?.map((industry, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {industry}
                  <button onClick={() => removeFromArray('targetIndustries', i)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Companies</Label>
            <Input
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'targetCompanies', setNewCompany)}
              placeholder="Add company and press Enter"
            />
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {data.careerGoals?.targetCompanies?.map((company, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {company}
                  <button onClick={() => removeFromArray('targetCompanies', i)}>
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
