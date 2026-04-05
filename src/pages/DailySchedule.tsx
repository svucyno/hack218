import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Calendar, Sun, Moon, Sunrise, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { useMedBridge } from '../contexts/MedBridgeContext';

export function DailySchedule() {
  const navigate = useNavigate();
  const { schedule, medicines } = useMedBridge();

  const getStatusType = (status: string) => {
    switch(status) {
      case 'taken': return 'success';
      case 'missed': return 'error';
      case 'unconfirmed': return 'warning';
      default: return 'default';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'taken': return 'Taken';
      case 'missed': return 'Missed';
      case 'unconfirmed': return 'Take Now';
      default: return 'Upcoming';
    }
  };

  const groupedSchedule = schedule.reduce((acc, curr) => {
    if (!acc[curr.period]) acc[curr.period] = [];
    acc[curr.period].push(curr);
    return acc;
  }, {} as Record<string, typeof schedule>);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
         title="Today's Schedule" 
         subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
         icon={Calendar}
      />

      {schedule.length === 0 ? (
        <GlassCard className="p-8 text-center flex flex-col items-center">
          <Info className="w-12 h-12 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">No schedule generated yet</h2>
          <p className="text-slate-500 mb-6 mt-2">Upload a prescription to automatically generate your schedule.</p>
          <button className="text-primary font-bold bg-primary-light/30 px-6 py-2 rounded-lg" onClick={() => navigate('/upload')}>
            Upload Prescription
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-12">
          {['Morning', 'Afternoon', 'Night'].map(period => {
            const items = groupedSchedule[period];
            if (!items || items.length === 0) return null;
            
            return (
              <div key={period} className="relative">
                <div className="sticky top-16 z-20 bg-slate-50/90 backdrop-blur-md py-4 sm:mx-0 flex items-center justify-between border-b mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    {period === 'Morning' && <Sunrise className="text-amber-500 w-8 h-8" />}
                    {period === 'Afternoon' && <Sun className="text-amber-600 w-8 h-8" />}
                    {period === 'Night' && <Moon className="text-indigo-500 w-8 h-8" />}
                    {period}
                  </h2>
                  <StatusBadge status="default" label={`${items.length} medicines`} icon={false} className="text-sm px-3 py-1.5" />
                </div>
                
                <div className="space-y-4">
                  {items.map(item => {
                    const med = medicines.find(m => m.id === item.medicineId);
                    if (!med) return null;
                    
                    return (
                      <GlassCard 
                        key={item.id} 
                        className={cn(
                          "p-5",
                          item.status === 'unconfirmed' ? 'border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20 ring-offset-2' : ''
                        )}
                        variant="interactive"
                        onClick={() => navigate(`/action/${item.id}`)}
                      >
                        <div className="flex items-center gap-5">
                          <div className="flex-shrink-0 w-20 text-center">
                            <span className="block font-black text-2xl text-slate-900">{item.time.split(' ')[0]}</span>
                            <span className="text-sm font-bold text-slate-500">{item.time.split(' ')[1]}</span>
                          </div>
                          
                          <div className="w-1.5 h-16 bg-slate-200 rounded-full" />
                          
                          <div className="flex-1 py-1">
                            <h3 className="font-bold text-xl text-slate-800 mb-1">{med.name}</h3>
                            <p className="text-slate-600 font-medium">{med.dosage} • {med.instruction}</p>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <StatusBadge 
                              status={getStatusType(item.status)} 
                              label={getStatusLabel(item.status)} 
                              className="px-3 py-1.5 text-sm"
                            />
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
