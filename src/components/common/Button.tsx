import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'gradient-primary border-transparent text-white hover:opacity-90 shadow-lg shadow-primary/25',
    secondary: 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm',
    outline: 'bg-transparent text-slate-700 border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 border-transparent hover:bg-slate-100',
    danger: 'bg-red-500 text-white border-transparent hover:bg-red-600 shadow-lg shadow-red-500/25',
    success: 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-lg shadow-emerald-500/25',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg font-medium',
    xl: 'px-8 py-4 text-xl font-bold rounded-2xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {children}
    </button>
  );
}
