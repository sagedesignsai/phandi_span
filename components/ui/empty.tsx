"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

const emptyVariants = cva(
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance transition-all duration-300 ease-in-out md:p-12",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/30 backdrop-blur-sm",
        subtle: "border-border/50 bg-transparent",
        outlined: "border-2 border-border bg-background",
        ghost: "border-transparent bg-transparent",
      },
      size: {
        sm: "p-4 md:p-6 gap-4",
        default: "p-6 md:p-12 gap-6",
        lg: "p-8 md:p-16 gap-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface EmptyProps extends React.ComponentProps<"div">, VariantProps<typeof emptyVariants> {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  animated?: boolean
}

function Empty({
  className,
  variant,
  size,
  title,
  description,
  icon,
  action,
  animated = true,
  children,
  ...props
}: EmptyProps) {
  return (
    <div
      data-slot="empty"
      className={cn(
        emptyVariants({ variant, size }),
        animated && "animate-in fade-in-0 zoom-in-95 duration-500",
        className
      )}
      {...props}
    >
      {children || (
        <>
          {icon && (
            <EmptyMedia variant="icon" animated={animated}>
              {icon}
            </EmptyMedia>
          )}
          {(title || description) && (
            <EmptyHeader>
              {title && <EmptyTitle>{title}</EmptyTitle>}
              {description && <EmptyDescription>{description}</EmptyDescription>}
            </EmptyHeader>
          )}
          {action && <EmptyContent>{action}</EmptyContent>}
        </>
      )}
    </div>
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-3 text-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted/50 text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/50 shadow-sm backdrop-blur-sm [&_svg:not([class*='size-'])]:size-6",
        gradient: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent text-primary flex size-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 shadow-lg [&_svg:not([class*='size-'])]:size-8",
        minimal: "bg-transparent text-muted-foreground [&_svg:not([class*='size-'])]:size-8",
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        default: "size-12 [&_svg:not([class*='size-'])]:size-6",
        lg: "size-16 [&_svg:not([class*='size-'])]:size-8",
        xl: "size-20 [&_svg:not([class*='size-'])]:size-10",
      },
    },
    defaultVariants: {
      variant: "icon",
      size: "default",
    },
  }
)

interface EmptyMediaProps
  extends React.ComponentProps<"div">,
  VariantProps<typeof emptyMediaVariants> {
  animated?: boolean
}

function EmptyMedia({
  className,
  variant = "icon",
  size,
  animated = true,
  ...props
}: EmptyMediaProps) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(
        emptyMediaVariants({ variant, size }),
        animated && "animate-in fade-in-0 zoom-in-95 duration-700 delay-100",
        className
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-200",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground text-sm/relaxed max-w-md [&>a:hover]:text-primary [&>a]:font-medium [&>a]:underline [&>a]:underline-offset-4 [&>a]:transition-colors animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-3 text-sm text-balance animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-400",
        className
      )}
      {...props}
    />
  )
}

function EmptyActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-actions"
      className={cn(
        "flex flex-wrap items-center justify-center gap-2",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  EmptyActions,
  type EmptyProps,
}
