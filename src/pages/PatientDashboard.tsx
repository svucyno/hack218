import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { mockPatient, mockAdherence } from '../data/mockData';
import { Bell, Heart, Sun, Activity, Calendar, Pill } from 'lucide-react';

export function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center gradient-primary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
           <h1 className="text-4xl font-extrabold">Hello, {mockPatient.name.split(' ')[0]}</h1>
           <p className="text-primary-light flex items-center gap-2 text-xl font-medium">
             <Sun className="w-6 h-6" /> Good Morning
           </p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
           <Heart className="w-64 h-64" />
        </div>
      </header>

      <section className="grid sm:grid-cols-2 gap-6">
        <StatsCard 
          title="Health Score" 
          value={`${mockAdherence.overallPercentage}%`}
          icon={Activity}
          color="success"
          trend={{ value: 5, label: "from last week", positive: true }}
        />
        
        <GlassCard 
          className="flex flex-col justify-center text-center p-6 border-amber-200 bg-amber-50/80 cursor-pointer" 
          variant="interactive"
          onClick={() => navigate('/schedule')}
        >
           <Pill className="w-10 h-10 text-amber-500 mx-auto mb-3" />
           <span className="text-3xl text-amber-800 font-bold mb-1">{mockAdherence.missedCount + mockAdherence.unconfirmedCount} Actions</span>
           <span className="text-sm font-semibold text-amber-600 uppercase tracking-widest">Needs Attention</span>
        </GlassCard>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-2xl font-bold text-slate-800">Next Medicine</h2>
        </div>
        
        <GlassCard className="border-l-8 border-l-primary relative overflow-hidden group p-8" variant="interactive" onClick={() => navigate('/action/s1')}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
             <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Amlodipine 5mg</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 font-bold text-sm">
                  1 Tablet • Before Food
                </span>
             </div>
             <div className="text-left sm:text-right">
                <span className="text-3xl font-bold text-primary block">8:00 AM</span>
                <p className="text-slate-500 font-medium text-lg mt-1">Today</p>
             </div>
          </div>
          
          <Button size="xl" className="w-full py-8 text-3xl font-extrabold shadow-xl">
             Tap Here to Mark as Taken
          </Button>
        </GlassCard>
      </section>

      <div className="flex flex-col sm:flex-row gap-6">
        <Button variant="secondary" size="xl" className="flex-1 flex flex-col items-center py-8 h-auto shadow-sm border-slate-200" onClick={() => navigate('/schedule')}>
           <Calendar className="w-10 h-10 mb-3 text-secondary" />
           <span className="text-2xl font-bold mb-1">Full Schedule</span>
           <span className="text-base font-normal text-slate-500">View what's left for today</span>
        </Button>
        <Button variant="secondary" size="xl" className="flex-1 flex flex-col items-center py-8 h-auto text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 shadow-sm" onClick={() => navigate('/caregiver')}>
           <Bell className="w-10 h-10 mb-3 text-amber-500"/>
           <span className="text-2xl font-bold mb-1">Alert Caregiver</span>
           <span className="text-base font-normal text-amber-700/70">Send a quick notification</span>
        </Button>
      </div>
    </div>
  );
}
