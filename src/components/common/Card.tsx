import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl p-6 transition-all duration-300',
        glass ? 'glass-card' : 'bg-white premium-shadow border border-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
