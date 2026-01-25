"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { XIcon } from 'lucide-react';
import type { CareerProfileContext } from '@/lib/models/career-profile';

interface WorkPreferencesStepProps {
  data: CareerProfileContext;
  onChange: (data: Partial<CareerProfileContext>) => void;
}

export function WorkPreferencesStep({ data, onChange }: WorkPreferencesStepProps) {
  const [newLocation, setNewLocation] = useState('');

  const addLocation = (location: string) => {
    if (!location.trim()) return;
    
    const currentPrefs = data.workPreferences || {};
    const currentLocations = currentPrefs.preferredLocations || [];
    
    onChange({
      workPreferences: {
        ...currentPrefs,
        preferredLocations: [...currentLocations, location.trim()],
      },
    });
  };

  const removeLocation = (index: number) => {
    const currentPrefs = data.workPreferences || {};
    const currentLocations = currentPrefs.preferredLocations || [];
    
    onChange({
      workPreferences: {
        ...currentPrefs,
        preferredLocations: currentLocations.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Work Preferences</h2>
        <p className="text-muted-foreground">
          Specify your ideal work environment and conditions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Work Type</Label>
          <Select
            value={data.workPreferences?.workType}
            onValueChange={(value) => onChange({
              workPreferences: {
                ...data.workPreferences,
                workType: value as any,
              },
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">🏠 Remote</SelectItem>
              <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
              <SelectItem value="onsite">🏢 On-site</SelectItem>
              <SelectItem value="flexible">✨ Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Employment Type</Label>
          <Select
            value={data.workPreferences?.employmentType}
            onValueChange={(value) => onChange({
              workPreferences: {
                ...data.workPreferences,
                employmentType: value as any,
              },
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Salary Expectation (USD)</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Minimum</Label>
            <Input
              type="number"
              placeholder="50,000"
              value={data.workPreferences?.salaryExpectation?.min || ''}
              onChange={(e) => onChange({
                workPreferences: {
                  ...data.workPreferences,
                  salaryExpectation: {
                    ...data.workPreferences?.salaryExpectation,
                    min: parseInt(e.target.value) || undefined,
                  },
                },
              })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Maximum</Label>
            <Input
              type="number"
              placeholder="100,000"
              value={data.workPreferences?.salaryExpectation?.max || ''}
              onChange={(e) => onChange({
                workPreferences: {
                  ...data.workPreferences,
                  salaryExpectation: {
                    ...data.workPreferences?.salaryExpectation,
                    max: parseInt(e.target.value) || undefined,
                  },
                },
              })}
            />
          </div>
        </div>
        {data.workPreferences?.salaryExpectation?.min && data.workPreferences?.salaryExpectation?.max && (
          <p className="text-sm text-muted-foreground">
            ${data.workPreferences.salaryExpectation.min.toLocaleString()} - ${data.workPreferences.salaryExpectation.max.toLocaleString()} USD
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Willing to Relocate</Label>
            <p className="text-sm text-muted-foreground">Are you open to relocating for the right opportunity?</p>
          </div>
          <Switch
            checked={data.workPreferences?.willingToRelocate || false}
            onCheckedChange={(checked) => onChange({
              workPreferences: {
                ...data.workPreferences,
                willingToRelocate: checked,
              },
            })}
          />
        </div>

        <div className="space-y-2">
          <Label>Preferred Locations</Label>
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLocation(newLocation);
                setNewLocation('');
              }
            }}
            placeholder="Add location and press Enter"
          />
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {data.workPreferences?.preferredLocations?.map((location, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {location}
                <button onClick={() => removeLocation(i)}>
                  <XIcon className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
