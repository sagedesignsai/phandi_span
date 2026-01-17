"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  className?: string;
}

export function CTASection({ className }: CTASectionProps) {
  return (
    <section className={cn('py-24 bg-background w-full', className)}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-muted-foreground">03</span>
            <div className="h-px w-12 bg-border" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">Ready to Build Your Resume?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals who have created standout resumes with Phandi'span. 
            Get started in minutes, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-base">
              <Link href="/dashboard">
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/dashboard/resumes/new">
                Create Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

