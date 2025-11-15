"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resume } from '@/lib/models/resume';
import { resumeSchema } from '@/lib/models/resume';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlusIcon, TrashIcon, GripVerticalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useSharedChatContext } from '@/lib/ai/chat-context';

interface ResumeEditorProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onCancel?: () => void;
  className?: string;
}

export function ResumeEditor({ resume, onSave, onCancel, className }: ResumeEditorProps) {
  const { setOnResumeUpdate } = useSharedChatContext();
  const form = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume,
  });

  const { fields: sections, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  // Sync with shared chat context - when AI updates resume, update editor
  useEffect(() => {
    const handleResumeUpdate = (updatedResume: Resume) => {
      if (updatedResume.id === resume.id) {
        form.reset(updatedResume);
      }
    };
    
    setOnResumeUpdate(handleResumeUpdate);
    
    return () => {
      setOnResumeUpdate(undefined);
    };
  }, [resume.id, form, setOnResumeUpdate]);

  useEffect(() => {
    form.reset(resume);
  }, [resume, form]);

  const onSubmit = (data: Resume) => {
    onSave(data);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Software Engineer Resume" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.location"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.portfolio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio URL</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sections</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  appendSection({
                    id: `section-${Date.now()}`,
                    type: 'custom',
                    title: 'New Section',
                    items: [],
                    order: sections.length,
                  });
                }}
              >
                <PlusIcon className="size-4" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <Card key={section.id} className="bg-muted/30">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVerticalIcon className="size-4 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name={`sections.${sectionIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} className="font-semibold" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeSection(sectionIndex)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`sections.${sectionIndex}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="experience">Experience</option>
                              <option value="education">Education</option>
                              <option value="skills">Skills</option>
                              <option value="projects">Projects</option>
                              <option value="summary">Summary</option>
                              <option value="certifications">Certifications</option>
                              <option value="languages">Languages</option>
                              <option value="custom">Custom</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Section items editor - simplified for MVP */}
                    <div className="text-sm text-muted-foreground">
                      Items: {section.items?.length || 0}
                      <p className="text-xs mt-1">
                        Use the AI chat assistant to add detailed items to sections.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No sections yet. Add a section to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Save Resume</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

