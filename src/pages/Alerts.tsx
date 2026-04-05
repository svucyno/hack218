import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockAlerts } from '../data/mockData';
import { BellRing, Check, Bell } from 'lucide-react';
import { cn } from '../utils/cn';

export function Alerts() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Alerts"
        subtitle="Notifications and warnings requiring attention."
        icon={Bell}
      />

      <div className="space-y-4">
        {mockAlerts.length === 0 ? (
          <GlassCard className="text-center py-16 px-4">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BellRing className="w-10 h-10 text-slate-300" />
             </div>
             <p className="text-2xl font-bold text-slate-800 mb-2">No active alerts</p>
             <p className="text-slate-500 font-medium">Everything is looking good right now.</p>
          </GlassCard>
        ) : (
          mockAlerts.map(alert => (
            <GlassCard 
              key={alert.id} 
              className={cn(
                "p-5 border-l-8",
                alert.severity === 'critical' ? 'border-l-red-500 bg-red-50/50' : 'border-l-amber-500 bg-amber-50/50'
              )}
            >
               <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                       <StatusBadge 
                         status={alert.severity === 'critical' ? 'error' : 'warning'} 
                         label={alert.severity.toUpperCase()}
                         icon={false}
                         className="px-2.5 py-1 text-xs"
                       />
                       <span className="text-sm font-bold text-slate-500">
                         {alert.timestamp.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 leading-snug">{alert.message}</p>
                  </div>
                  <button className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors flex-shrink-0" title="Mark as resolved">
                    <Check className="w-7 h-7" />
                  </button>
               </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
