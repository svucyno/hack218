import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { BellRing, Check, Bell } from 'lucide-react';
import { cn } from '../utils/cn';
import { useMedBridge } from '../contexts/MedBridgeContext';

export function Alerts() {
  const { alerts, resolveAlert } = useMedBridge();

  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Alerts"
        subtitle="Notifications and warnings requiring attention."
        icon={Bell}
      />

      <div className="space-y-4">
        {activeAlerts.length === 0 ? (
          <GlassCard className="text-center py-16 px-4">
             <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BellRing className="w-10 h-10 text-emerald-400" />
             </div>
             <p className="text-2xl font-bold text-slate-800 mb-2">No active alerts</p>
             <p className="text-slate-500 font-medium">Everything is looking good right now.</p>
          </GlassCard>
        ) : (
          activeAlerts.map(alert => (
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
                         {new Date(alert.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 leading-snug">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors flex-shrink-0" 
                    title="Mark as resolved"
                  >
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
