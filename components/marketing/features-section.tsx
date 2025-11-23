"use client";

import React from 'react';
import { ChatPreview } from './chat-preview';
import { EditorPreview } from './editor-preview';
import { cn } from '@/lib/utils';
import { SparklesIcon, FileTextIcon, Wand2Icon, DownloadIcon, PaletteIcon, ZapIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeaturesSectionProps {
  className?: string;
}

export function FeaturesSection({ className }: FeaturesSectionProps) {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Creation',
      description: 'Chat with our AI assistant to build your resume step-by-step. Just tell us about yourself, and we\'ll create a professional resume.',
    },
    {
      icon: FileTextIcon,
      title: 'WYSIWYG Editor',
      description: 'Edit your resume in real-time with our intuitive editor. See changes instantly as you type.',
    },
    {
      icon: PaletteIcon,
      title: 'Multiple Templates',
      description: 'Choose from professional templates designed for different industries and career levels.',
    },
    {
      icon: DownloadIcon,
      title: 'Export to PDF',
      description: 'Download your resume as a high-quality PDF ready for job applications.',
    },
    {
      icon: ZapIcon,
      title: 'Real-time Updates',
      description: 'Watch your resume update in real-time as the AI makes changes. No page refreshes needed.',
    },
    {
      icon: Wand2Icon,
      title: 'Smart Suggestions',
      description: 'Get AI-powered suggestions to improve your resume content and formatting.',
    },
  ];

  return (
    <section className={cn('py-24 bg-muted/30 w-full', className)}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl font-bold text-muted-foreground">02</span>
            <div className="h-px w-12 bg-border" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create a standout resume
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-border/50">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Component previews */}
        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {/* Chat Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold">AI Chat Assistant</h3>
            </div>
            <p className="text-muted-foreground">
              Interact with our AI assistant to build your resume conversationally. 
              Just answer questions, and we'll create a professional resume for you.
            </p>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <ChatPreview className="h-full" />
            </div>
          </div>

          {/* Editor Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileTextIcon className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold">WYSIWYG Editor</h3>
            </div>
            <p className="text-muted-foreground">
              Edit your resume with our intuitive editor. See exactly how it will look 
              when exported, with real-time preview and formatting controls.
            </p>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <EditorPreview className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

