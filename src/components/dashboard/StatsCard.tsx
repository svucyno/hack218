import { GlassCard } from '../common/GlassCard';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'alert' | 'info';
  className?: string;
}

const colorMap = {
  primary: 'text-primary bg-primary-light',
  success: 'text-emerald-600 bg-emerald-100',
  warning: 'text-amber-600 bg-amber-100',
  alert: 'text-red-600 bg-red-100',
  info: 'text-blue-600 bg-blue-100',
};

export function StatsCard({ title, value, icon: Icon, trend, color = 'primary', className }: StatsCardProps) {
  return (
    <GlassCard className={cn('p-6 group', className)} variant="interactive">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className={cn('p-3 rounded-2xl', colorMap[color])}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn("text-sm font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>
            {trend.positive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-slate-500">{trend.label}</span>
        </div>
      )}
    </GlassCard>
  );
}
