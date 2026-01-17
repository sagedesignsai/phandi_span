"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

interface MarketingHeaderProps {
  className?: string;
}

export function MarketingHeader({ className }: MarketingHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo size="default" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/templates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Templates
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center justify-end gap-4">
          <Button asChild size="sm">
            <Link href="/auth/signup">
              Get Started
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href="/auth/login">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

