import React from 'react';
import { cn } from '../../utils/cn';

interface GlassWidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function GlassWidget({ className, children, ...props }: GlassWidgetProps) {
  return (
    <div
      className={cn(
        'glass-panel p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
