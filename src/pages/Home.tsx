import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { HeartPulse, LayoutDashboard, Calendar, Bell, FileUp, CheckCircle2 } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-16 relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-secondary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <section className="text-center space-y-8 pt-20 pb-8 mt-12 px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center p-5 bg-white/60 backdrop-blur-sm border border-white rounded-3xl mb-4 premium-shadow">
          <HeartPulse className="w-14 h-14 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Medication management, <br className="hidden md:block"/>
          <span className="text-gradient">simplified for everyone.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Post-discharge medication support for patients and caregivers.
          Turn your complex prescriptions into actionable daily schedules instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
          <Button size="xl" onClick={() => navigate('/upload')} className="group flex items-center gap-2">
            <FileUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            Upload Prescription
          </Button>
          <Button size="xl" variant="secondary" onClick={() => navigate('/dashboard')}>
            View Dashboard Demo
          </Button>
        </div>
        
        <div className="flex justify-center gap-6 pt-10 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> AI OCR Extraction</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Smart Voice Reminders</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Caregiver Alerts</span>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 px-4 relative z-10">
        <GlassCard variant="interactive" className="p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 bg-blue-100 flex items-center justify-center rounded-2xl text-blue-600">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">Patient Dashboard</h3>
          <p className="text-slate-500 leading-relaxed">Simple, high-contrast, touch-friendly UI designed specifically for elderly patients to log medicines with ease.</p>
        </GlassCard>
        
        <GlassCard variant="interactive" className="p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-2xl text-emerald-600">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">Daily Schedule</h3>
          <p className="text-slate-500 leading-relaxed">Auto-generated, time-grouped daily schedules tracking exactly what needs to be taken and when.</p>
        </GlassCard>

        <GlassCard variant="interactive" className="p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 bg-amber-100 flex items-center justify-center rounded-2xl text-amber-600">
             <Bell className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">Caregiver View</h3>
          <p className="text-slate-500 leading-relaxed">Real-time alerts, compliance statistics, and missed-dose notifications for family members or nurses.</p>
        </GlassCard>
      </section>
    </div>
  );
}
