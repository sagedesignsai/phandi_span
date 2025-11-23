"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { XIcon } from 'lucide-react';
import type { Experience, Education, Project, Skill } from '@/lib/models/resume';
import { experienceSchema, educationSchema, projectSchema, skillSchema } from '@/lib/models/resume';
import { cn } from '@/lib/utils';

interface PropertyPanelProps {
  item: Experience | Education | Project | Skill | null;
  type: 'experience' | 'education' | 'project' | 'skill' | null;
  onUpdate: (updates: Partial<Experience | Education | Project | Skill>) => void;
  onClose: () => void;
  className?: string;
}

/**
 * Property Panel Component
 * Right-side panel for detailed editing of complex items
 */
export function PropertyPanel({
  item,
  type,
  onUpdate,
  onClose,
  className,
}: PropertyPanelProps) {
  if (!item || !type) {
    return null;
  }

  if (type === 'experience') {
    return (
      <ExperiencePanel
        experience={item as Experience}
        onUpdate={onUpdate as (updates: Partial<Experience>) => void}
        onClose={onClose}
        className={className}
      />
    );
  }

  if (type === 'education') {
    return (
      <EducationPanel
        education={item as Education}
        onUpdate={onUpdate as (updates: Partial<Education>) => void}
        onClose={onClose}
        className={className}
      />
    );
  }

  if (type === 'project') {
    return (
      <ProjectPanel
        project={item as Project}
        onUpdate={onUpdate as (updates: Partial<Project>) => void}
        onClose={onClose}
        className={className}
      />
    );
  }

  return null;
}

function ExperiencePanel({
  experience,
  onUpdate,
  onClose,
  className,
}: {
  experience: Experience;
  onUpdate: (updates: Partial<Experience>) => void;
  onClose: () => void;
  className?: string;
}) {
  const form = useForm<Experience>({
    resolver: zodResolver(experienceSchema),
    defaultValues: experience,
  });

  const onSubmit = (data: Experience) => {
    onUpdate(data);
  };

  return (
    <Card className={cn('w-80 h-full flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Edit Experience</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-full pr-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Jan 2020" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Dec 2022" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded"
                      />
                    </FormControl>
                    <FormLabel>Current Position</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function EducationPanel({
  education,
  onUpdate,
  onClose,
  className,
}: {
  education: Education;
  onUpdate: (updates: Partial<Education>) => void;
  onClose: () => void;
  className?: string;
}) {
  const form = useForm<Education>({
    resolver: zodResolver(educationSchema),
    defaultValues: education,
  });

  const onSubmit = (data: Education) => {
    onUpdate(data);
  };

  return (
    <Card className={cn('w-80 h-full flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Edit Education</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-full pr-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sep 2016" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., May 2020" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPA</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 3.8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function ProjectPanel({
  project,
  onUpdate,
  onClose,
  className,
}: {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onClose: () => void;
  className?: string;
}) {
  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: project,
  });

  const onSubmit = (data: Project) => {
    onUpdate(data);
  };

  return (
    <Card className={cn('w-80 h-full flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Edit Project</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-full pr-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ScrollArea>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

