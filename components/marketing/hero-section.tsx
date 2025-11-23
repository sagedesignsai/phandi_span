"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SparklesIcon, FileTextIcon, Wand2Icon } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn('relative min-h-screen flex items-center justify-center overflow-hidden', className)}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            {/* Section number */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <span className="text-2xl font-bold text-muted-foreground">01</span>
              <div className="h-px w-12 bg-border" />
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="block">AI-Powered</span>
                <span className="block">Resume Builder</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Create professional resumes and CVs with AI assistance. Build, edit, and export your resume in minutes.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">AI-guided resume creation</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Real-time WYSIWYG editing</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/dashboard">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Visual element */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Abstract circular graphic */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 rounded-full blur-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl font-bold text-muted-foreground/20 select-none">
                    PORTFOLIO
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-px w-32 bg-foreground/20 mb-4" />
                      <div className="text-2xl font-semibold text-foreground">COLLECTION</div>
                      <div className="h-px w-32 bg-foreground/20 mt-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-accent/30 to-primary/20" />
    </section>
  );
}

