import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'panel' | 'interactive';
}

export function GlassCard({ children, className, variant = 'default', ...props }: GlassCardProps) {
  const baseClasses = variant === 'panel' ? 'glass-panel' : 'glass-card';
  const interactiveClasses = variant === 'interactive' ? 'glass-card-hover cursor-pointer' : '';

  return (
    <div
      className={cn(baseClasses, interactiveClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}
