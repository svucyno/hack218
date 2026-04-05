import { cn } from '../../utils/cn';
import { CheckCircle2, Clock, Info, AlertCircle, AlertTriangle } from 'lucide-react';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: BadgeStatus;
  label: string;
  icon?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  warning: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: AlertTriangle,
  },
  error: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
  },
  info: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Info,
  },
  default: {
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  },
};

export function StatusBadge({ status, label, icon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', config.color, className)}>
      {icon && <Icon size={14} />}
      {label}
    </span>
  );
}
