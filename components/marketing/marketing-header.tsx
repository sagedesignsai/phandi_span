"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MarketingHeaderProps {
  className?: string;
}

export function MarketingHeader({ className }: MarketingHeaderProps) {
  const { user, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60', className)}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
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
          {user ? (
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth-aware buttons */}
        <div className="flex items-center justify-end gap-4">
          {isLoading ? (
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full hover:bg-accent transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.avatar} 
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                      {user.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-popover border-border shadow-lg rounded-lg overflow-hidden" 
                align="end" 
                forceMount
              >
                {/* User info header */}
                <div className="border-b border-border/50 bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
                        {user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="py-1">
                  <DropdownMenuItem asChild className="py-2 px-3 hover:bg-accent/50 cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-3 w-full">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild className="py-2 px-3 hover:bg-accent/50 cursor-pointer">
                    <Link href="/dashboard/profile" className="flex items-center gap-3 w-full">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="py-2 px-3 hover:bg-destructive/10 cursor-pointer text-destructive hover:text-destructive"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9m-7.5 0m0 0H4.5m3.75 0V7.5m0 2.25v6.75m0 0h3.75m-3.75 0V15m7.5-6h-3.75m3.75 0V7.5m0 2.25v6.75m0 0h3.75m-3.75 0V15" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Sign out</span>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost" className="text-sm font-medium hover:bg-accent/50">
                <Link href="/auth/login">
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="text-sm font-medium bg-primary hover:bg-primary/90 transition-colors">
                <Link href="/auth/signup">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

