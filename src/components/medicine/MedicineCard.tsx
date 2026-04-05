import { Pill, Sun, Moon, Sunrise, Info, Check, Trash2, Edit } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { cn } from '../../utils/cn';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instruction?: string;
  type?: 'pill' | 'syrup' | 'injection';
}

interface MedicineCardProps {
  medicine: Medicine;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onConfirm?: (id: string) => void;
  variant?: 'review' | 'dashboard' | 'schedule';
  status?: 'pending' | 'taken' | 'missed';
}

export function MedicineCard({ 
  medicine, 
  onEdit, 
  onDelete, 
  onConfirm,
  variant = 'dashboard',
  status
}: MedicineCardProps) {
  const getTimingIcon = (timing: string) => {
    const lower = timing.toLowerCase();
    if (lower.includes('morning')) return <Sunrise size={18} />;
    if (lower.includes('night') || lower.includes('bed')) return <Moon size={18} />;
    return <Sun size={18} />;
  };

  const isReview = variant === 'review';

  return (
    <GlassCard className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" variant={isReview ? 'default' : 'interactive'}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-2xl flex-shrink-0",
          status === 'taken' ? "bg-emerald-100 text-emerald-600" :
          status === 'missed' ? "bg-red-100 text-red-600" :
          "bg-primary-light text-primary"
        )}>
          <Pill size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{medicine.name}</h3>
          <p className="text-slate-500 font-medium">{medicine.dosage} • {medicine.frequency}</p>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              {getTimingIcon(medicine.timing)} {medicine.timing}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
              <Info size={14} /> {medicine.duration}
            </span>
            {medicine.instruction && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                {medicine.instruction}
              </span>
            )}
          </div>
        </div>
      </div>

      {(onEdit || onDelete || onConfirm) && (
        <div className="flex items-center gap-2 sm:self-center self-end border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-4 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
          {onEdit && (
            <button onClick={() => onEdit(medicine.id)} className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 rounded-lg">
              <Edit size={20} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(medicine.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg">
              <Trash2 size={20} />
            </button>
          )}
          {onConfirm && (
            <button onClick={() => onConfirm(medicine.id)} className="p-2 text-emerald-500 hover:text-white hover:bg-emerald-500 transition-colors bg-emerald-50 rounded-lg">
              <Check size={20} />
            </button>
          )}
        </div>
      )}
    </GlassCard>
  );
}
