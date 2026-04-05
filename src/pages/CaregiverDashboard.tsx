import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { Bell, Phone, Activity, AlertTriangle, ChevronRight, Settings } from 'lucide-react';
import { useMedBridge } from '../contexts/MedBridgeContext';

export function CaregiverDashboard() {
  const navigate = useNavigate();
  const { adherence, alerts, schedule, medicines } = useMedBridge();

  const activeAlerts = alerts.filter(a => !a.resolved);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');

  const adherenceScore = adherence?.overallPercentage ?? 100;
  const totalActions = adherence?.totalForWeek ?? 0;
  const takenCount = adherence?.takenCount ?? 0;
  const missedCount = adherence?.missedCount ?? 0;
  const unconfirmedCount = adherence?.unconfirmedCount ?? 0;

  // Find next medicine
  const nextItem = schedule.find(s => s.status === 'unconfirmed');
  const nextMed = nextItem ? medicines.find(m => m.id === nextItem.medicineId) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Caregiver Dashboard"
        subtitle={`Monitoring Venkateshwara`}
        action={
          <button className="relative p-3 bg-primary-light/20 text-primary hover:bg-primary-light/40 rounded-full transition-colors" onClick={() => navigate('/alerts')}>
            <Bell className="w-6 h-6" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full ring-4 ring-white" />
            )}
          </button>
        }
      />

      {criticalAlerts.length > 0 && (
        <GlassCard className="bg-red-50/90 border-red-200 shadow-lg shadow-red-500/10 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6">
           <div className="p-4 bg-red-100 text-red-600 rounded-full shrink-0 flex items-center justify-center">
             <AlertTriangle className="w-8 h-8" />
           </div>
           <div className="flex-1 text-center sm:text-left">
             <h3 className="font-extrabold text-red-800 text-xl mb-1">Attention Required</h3>
             <p className="text-red-700 font-medium text-lg leading-snug">{criticalAlerts[0].message}</p>
             <div className="mt-5 flex flex-wrap justify-center sm:justify-start gap-3">
               <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-red-700 transition-colors" onClick={() => navigate('/alerts')}>View Alerts</button>
               <button className="bg-white text-red-700 px-5 py-2.5 rounded-xl text-sm font-bold border border-red-200 flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 transition-colors">
                 <Phone className="w-4 h-4"/> Call Venkateshwara
               </button>
             </div>
           </div>
        </GlassCard>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
         <GlassCard className="lg:col-span-2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Activity className="w-6 h-6"/></div>
              Adherence Overview
            </h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-10 pb-8 border-b border-slate-100">
               <div>
                 <div className="text-6xl font-black text-emerald-500 tracking-tighter">{adherenceScore}%</div>
                 <div className="text-slate-500 font-medium tracking-wide uppercase mt-1 text-sm">Overall Weekly Score</div>
               </div>
               <div className="sm:ml-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-500 font-medium">Total Actions Tracked</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{totalActions}</p>
               </div>
            </div>
            
            <div className="space-y-6">
               <AdherenceBar 
                 label="Doses Taken" 
                 count={takenCount} 
                 total={totalActions} 
                 colorClass="bg-emerald-500" 
                 textClass="text-emerald-700" 
               />
               <AdherenceBar 
                 label="Missed Doses" 
                 count={missedCount} 
                 total={totalActions} 
                 colorClass="bg-red-500" 
                 textClass="text-red-700" 
               />
               <AdherenceBar 
                 label="Unconfirmed / Pending" 
                 count={unconfirmedCount} 
                 total={totalActions} 
                 colorClass="bg-amber-500" 
                 textClass="text-amber-700" 
               />
            </div>
         </GlassCard>

         <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
               <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6 relative z-10">Patient Status</h3>
               <div className="space-y-5 relative z-10">
                  {nextMed && nextItem ? (
                     <div>
                        <p className="text-sm text-slate-400 mb-1">Next Scheduled Med</p>
                        <p className="text-xl font-bold">{nextMed.name} ({nextItem.time})</p>
                     </div>
                  ) : (
                     <div>
                        <p className="text-sm text-slate-400 mb-1">Next Scheduled Med</p>
                        <p className="text-xl font-bold text-emerald-400">All caught up!</p>
                     </div>
                  )}
                  <div className="h-px bg-slate-800" />
                  <div>
                     <p className="text-sm text-slate-400 mb-1">Last Application Activity</p>
                     <p className="text-lg font-medium text-slate-200">Just now</p>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div>
                     <p className="text-sm text-slate-400 mb-1">Preferred Language</p>
                     <p className="text-lg font-medium text-slate-200">Telugu (తెలుగు)</p>
                  </div>
               </div>
            </div>
            
            <GlassCard className="p-6 bg-primary-light/5 border-primary-light/20">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Settings className="w-5 h-5 text-slate-400" /> Quick Actions
               </h3>
               <div className="space-y-3">
                  <button onClick={() => navigate('/settings')} className="group w-full flex items-center justify-between px-5 py-4 bg-white rounded-2xl text-sm font-bold text-slate-700 hover:bg-primary hover:text-white transition-all shadow-sm border border-slate-100">
                    Adjust Reminder Settings
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </button>
               </div>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}

function AdherenceBar({ label, count, total, colorClass, textClass }: { label: string, count: number, total: number, colorClass: string, textClass: string }) {
  const percentage = Math.round((count / total) * 100) || 0;
  return (
    <div>
      <div className="flex justify-between text-base mb-2 font-bold">
         <span className={textClass}>{label}</span>
         <span className="text-slate-600">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
         <div className={`${colorClass} h-full transition-all duration-1000 ease-out`} style={{width: `${percentage}%`}} />
      </div>
    </div>
  );
}
