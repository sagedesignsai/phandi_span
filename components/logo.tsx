"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Show text alongside the logo
   * @default true
   */
  showText?: boolean;
  /**
   * Size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Custom className
   */
  className?: string;
}

const sizeMap = {
  sm: { icon: 20, text: "text-sm" },
  default: { icon: 24, text: "text-lg" },
  lg: { icon: 32, text: "text-2xl" },
};

export function Logo({ 
  showText = true, 
  size = "default",
  className,
  ...props 
}: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        {...props}
      >
        {/* Document base */}
        <rect
          x="6"
          y="4"
          width="16"
          height="24"
          rx="2"
          className="fill-primary"
        />
        
        {/* Document fold corner */}
        <path
          d="M22 4V10H16L22 4Z"
          className="fill-primary"
          style={{ opacity: 0.7 }}
        />
        
        {/* Document lines (representing text) */}
        <line
          x1="10"
          y1="12"
          x2="18"
          y2="12"
          stroke="var(--primary-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity: 0.9 }}
        />
        <line
          x1="10"
          y1="16"
          x2="18"
          y2="16"
          stroke="var(--primary-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity: 0.7 }}
        />
        <line
          x1="10"
          y1="20"
          x2="16"
          y2="20"
          stroke="var(--primary-foreground)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ opacity: 0.7 }}
        />
        
        {/* AI sparkle/star icon */}
        <g transform="translate(20, 8)">
          <path
            d="M6 0L7.236 3.528L10.764 4.764L7.236 6L6 9.528L4.764 6L1.236 4.764L4.764 3.528L6 0Z"
            className="fill-accent"
          />
          <circle
            cx="6"
            cy="4.764"
            r="1.5"
            className="fill-primary-foreground"
          />
        </g>
      </svg>
      
      {showText && (
        <span className={cn("font-bold tracking-tight", textSize)}>
          Phandi'span
        </span>
      )}
    </div>
  );
}

/**
 * Logo icon only (without text)
 */
export function LogoIcon({ 
  size = "default",
  className,
  ...props 
}: Omit<LogoProps, "showText">) {
  const { icon: iconSize } = sizeMap[size];

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      {...props}
    >
      {/* Document base */}
      <rect
        x="6"
        y="4"
        width="16"
        height="24"
        rx="2"
        className="fill-primary"
      />
      
      {/* Document fold corner */}
      <path
        d="M22 4V10H16L22 4Z"
        className="fill-primary"
        style={{ opacity: 0.7 }}
      />
      
      {/* Document lines (representing text) */}
      <line
        x1="10"
        y1="12"
        x2="18"
        y2="12"
        stroke="var(--primary-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ opacity: 0.9 }}
      />
      <line
        x1="10"
        y1="16"
        x2="18"
        y2="16"
        stroke="var(--primary-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ opacity: 0.7 }}
      />
      <line
        x1="10"
        y1="20"
        x2="16"
        y2="20"
        stroke="var(--primary-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ opacity: 0.7 }}
      />
      
      {/* AI sparkle/star icon */}
      <g transform="translate(20, 8)">
        <path
          d="M6 0L7.236 3.528L10.764 4.764L7.236 6L6 9.528L4.764 6L1.236 4.764L4.764 3.528L6 0Z"
          className="fill-accent"
        />
        <circle
          cx="6"
          cy="4.764"
          r="1.5"
          className="fill-primary-foreground"
        />
      </g>
    </svg>
  );
}

