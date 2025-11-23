"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SiteHeaderProps {
  title?: string | ReactNode;
  description?: string;
  actions?: ReactNode;
  showSidebarTrigger?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SiteHeader({ 
  title, 
  description, 
  actions, 
  showSidebarTrigger = true,
  className,
  children 
}: SiteHeaderProps) {
  return (
    <header className={cn(
      "flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
      className
    )}>
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {showSidebarTrigger && (
          <>
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
          </>
        )}
        
        {/* Custom content or default title */}
        {children ? (
          children
        ) : (
          <>
            {title && (
              <div className="flex flex-col">
                <h1 className="text-base font-medium">{title}</h1>
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </>
        )}
        
        {/* Actions on the right */}
        {actions && (
        <div className="ml-auto flex items-center gap-2">
            {actions}
        </div>
        )}
      </div>
    </header>
  )
}
