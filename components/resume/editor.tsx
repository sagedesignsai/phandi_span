"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resume } from '@/lib/models/resume';
import { resumeSchema } from '@/lib/models/resume';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusIcon, 
  TrashIcon, 
  GripVerticalIcon,
  UserIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  FolderKanbanIcon,
  FileTextIcon,
  SparklesIcon,
  InfoIcon,
  SaveIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';
import { useSharedChatContext } from '@/lib/ai/chat-context';
import { TemplateSelector } from './template-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResumeEditorProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onCancel?: () => void;
  className?: string;
}

const sectionTypeIcons = {
  experience: BriefcaseIcon,
  education: GraduationCapIcon,
  skills: CodeIcon,
  projects: FolderKanbanIcon,
  summary: FileTextIcon,
  certifications: FileTextIcon,
  languages: FileTextIcon,
  custom: FileTextIcon,
};

const sectionTypeLabels = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  summary: 'Summary',
  certifications: 'Certifications',
  languages: 'Languages',
  custom: 'Custom',
};

export function ResumeEditor({ resume, onSave, onCancel, className }: ResumeEditorProps) {
  const { setOnResumeUpdate } = useSharedChatContext();
  const form = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume,
    mode: 'onChange',
  });

  // Store form in ref to avoid dependency issues
  const formRef = React.useRef(form);
  formRef.current = form;

  const { fields: sections, append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  // Update form when resume prop changes (but not from internal updates)
  const prevResumeIdRef = React.useRef(resume.id);
  useEffect(() => {
    if (prevResumeIdRef.current !== resume.id) {
      prevResumeIdRef.current = resume.id;
      formRef.current.reset(resume);
    }
  }, [resume.id]);

  // Sync with shared chat context - when AI updates resume, update editor
  const handleResumeUpdate = React.useCallback((updatedResume: Resume) => {
    if (updatedResume.id === resume.id) {
      requestAnimationFrame(() => {
        formRef.current.reset(updatedResume, { keepDefaultValues: false });
      });
    }
  }, [resume.id]);

  useEffect(() => {
    setOnResumeUpdate(handleResumeUpdate);
    return () => {
      setOnResumeUpdate(undefined);
    };
  }, [handleResumeUpdate, setOnResumeUpdate]);

  const onSubmit = (data: Resume) => {
    onSave(data);
  };

  const formState = form.formState;
  const isDirty = formState.isDirty;
  const errors = formState.errors;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with AI suggestion */}
      <Alert className="border-primary/20 bg-primary/5">
        <SparklesIcon className="size-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>Tip:</strong> Use the AI assistant on the right to quickly add experience, education, skills, and more to your resume!
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="gap-2">
                <UserIcon className="size-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="sections" className="gap-2">
                <FileTextIcon className="size-4" />
                Sections
                {sections.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {sections.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="template" className="gap-2">
                <FileTextIcon className="size-4" />
                Template
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Template Selector - Quick Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="size-5" />
                    Resume Template
                  </CardTitle>
                  <CardDescription>
                    Choose a design template for your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <TemplateSelector 
                            resume={{ ...resume, template: field.value || resume.template }} 
                            onTemplateChange={(templateId) => {
                              field.onChange(templateId);
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="size-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your contact details and professional information
                  </CardDescription>
            </CardHeader>
                <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                        <FormLabel className="text-base font-semibold">Resume Title</FormLabel>
                    <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g., Software Engineer Resume" 
                            className="h-11"
                          />
                    </FormControl>
                        <FormDescription>
                          A descriptive title for this resume version
                        </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personalInfo.name"
                  render={({ field }) => (
                    <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                            <Input {...field} placeholder="John Doe" className="h-10" />
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
                            <Input type="email" {...field} placeholder="john@example.com" className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                            <Input {...field} placeholder="+1 (555) 123-4567" className="h-10" />
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
                            <Input {...field} placeholder="City, Country" className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personalInfo.linkedin"
                  render={({ field }) => (
                    <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                            <Input type="url" {...field} placeholder="https://linkedin.com/in/..." className="h-10" />
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
                          <FormLabel>GitHub</FormLabel>
                      <FormControl>
                            <Input type="url" {...field} placeholder="https://github.com/..." className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personalInfo.website"
                  render={({ field }) => (
                    <FormItem>
                          <FormLabel>Website</FormLabel>
                      <FormControl>
                            <Input type="url" {...field} placeholder="https://..." className="h-10" />
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
                          <FormLabel>Portfolio</FormLabel>
                      <FormControl>
                            <Input type="url" {...field} placeholder="https://..." className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-6 mt-6">
          <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileTextIcon className="size-5" />
                      Resume Sections
                    </CardTitle>
                    <CardDescription>
                      Organize your resume content into sections
                    </CardDescription>
                  </div>
              <Button
                type="button"
                    variant="default"
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
                    className="gap-2"
              >
                <PlusIcon className="size-4" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                  {sections.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                      <FileTextIcon className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                        Add sections to organize your resume content. You can also use the AI assistant to automatically add experience, education, and skills.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          appendSection({
                            id: `section-${Date.now()}`,
                            type: 'summary',
                            title: 'Summary',
                            items: [''],
                            order: 0,
                          });
                        }}
                        className="gap-2"
                      >
                        <PlusIcon className="size-4" />
                        Add Your First Section
                      </Button>
                    </div>
                  ) : (
                    sections.map((section, sectionIndex) => {
                      const Icon = sectionTypeIcons[section.type as keyof typeof sectionTypeIcons] || FileTextIcon;
                      return (
                        <Card key={section.id} className="bg-muted/30 border-2 hover:border-primary/20 transition-colors">
                          <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 rounded-lg bg-background border border-border">
                                  <Icon className="size-4 text-muted-foreground" />
                                </div>
                        <FormField
                          control={form.control}
                          name={`sections.${sectionIndex}.title`}
                          render={({ field }) => (
                                    <FormItem className="flex-1 min-w-0">
                              <FormControl>
                                        <Input 
                                          {...field} 
                                          className="font-semibold text-base border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto" 
                                          placeholder="Section Title"
                                        />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="secondary" className="gap-1.5">
                                  <Icon className="size-3" />
                                  {sectionTypeLabels[section.type as keyof typeof sectionTypeLabels] || section.type}
                                </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeSection(sectionIndex)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                              </div>
                    </div>

                    <FormField
                      control={form.control}
                      name={`sections.${sectionIndex}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Type</FormLabel>
                          <FormControl>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="h-10">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="experience">
                                          <div className="flex items-center gap-2">
                                            <BriefcaseIcon className="size-4" />
                                            Experience
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="education">
                                          <div className="flex items-center gap-2">
                                            <GraduationCapIcon className="size-4" />
                                            Education
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="skills">
                                          <div className="flex items-center gap-2">
                                            <CodeIcon className="size-4" />
                                            Skills
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="projects">
                                          <div className="flex items-center gap-2">
                                            <FolderKanbanIcon className="size-4" />
                                            Projects
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="summary">
                                          <div className="flex items-center gap-2">
                                            <FileTextIcon className="size-4" />
                                            Summary
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="certifications">
                                          <div className="flex items-center gap-2">
                                            <FileTextIcon className="size-4" />
                                            Certifications
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="languages">
                                          <div className="flex items-center gap-2">
                                            <FileTextIcon className="size-4" />
                                            Languages
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="custom">
                                          <div className="flex items-center gap-2">
                                            <FileTextIcon className="size-4" />
                                            Custom
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                            <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border">
                              <InfoIcon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium mb-1">
                                  {section.items?.length || 0} {section.items?.length === 1 ? 'item' : 'items'} in this section
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Use the AI assistant on the right to add detailed {section.type === 'experience' ? 'work experience' : section.type === 'education' ? 'education history' : section.type === 'skills' ? 'skills' : 'items'} to this section.
                      </p>
                              </div>
                    </div>
                  </CardContent>
                </Card>
                      );
                    })
              )}
            </CardContent>
          </Card>
            </TabsContent>

            {/* Template Tab */}
            <TabsContent value="template" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTextIcon className="size-5" />
                    Resume Template
                  </CardTitle>
                  <CardDescription>
                    Choose a design template that matches your style and industry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Template</FormLabel>
                        <FormControl>
                          <TemplateSelector 
                            resume={{ ...resume, template: field.value || resume.template }} 
                            onTemplateChange={(templateId) => {
                              field.onChange(templateId);
                            }} 
                          />
                        </FormControl>
                        <FormDescription>
                          Preview your resume to see how it looks with different templates
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions Footer */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border -mx-6 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isDirty && (
                <span className="flex items-center gap-1.5">
                  <InfoIcon className="size-4" />
                  You have unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
              <Button 
                type="submit" 
                disabled={!isDirty}
                className="gap-2 min-w-[120px]"
              >
                <SaveIcon className="size-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
