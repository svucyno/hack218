import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { mockSchedule, mockMedicines } from '../data/mockData';
import { Volume2, ChevronLeft, Check, X, AlertCircle } from 'lucide-react';

export function DoseAction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const scheduleItem = mockSchedule.find(s => s.id === id) || mockSchedule[2];
  const medicine = mockMedicines.find(m => m.id === scheduleItem?.medicineId) || mockMedicines[0];

  const handleAction = (action: 'taken' | 'missed') => {
    // In a real app we'd update the state/backend here.
    console.log(`Action recorded: ${action}`);
    navigate('/schedule');
  };

  return (
    <div className="max-w-md mx-auto min-h-[85vh] flex flex-col pt-4 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 mb-8 hover:text-slate-900 transition-colors py-2 font-medium">
        <ChevronLeft className="w-6 h-6 mr-1" /> Back to Schedule
      </button>

      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-4">
          <p className="text-2xl font-black text-primary tracking-wide uppercase">{scheduleItem.time}</p>
          <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">{medicine.name}</h1>
          <div className="inline-flex items-center justify-center bg-slate-100 rounded-3xl px-8 py-4 shadow-inner mt-4 border border-slate-200">
             <p className="text-3xl font-extrabold text-slate-800">{medicine.dosage}</p>
          </div>
        </div>

        <GlassCard className="text-center border-amber-200 bg-amber-50/90 shadow-lg shadow-amber-500/10 p-8 mt-8">
          <p className="text-amber-900 font-black text-3xl uppercase tracking-widest">{medicine.instruction}</p>
          {medicine.warningTags && (
             <div className="flex flex-col items-center gap-3 mt-6">
                {medicine.warningTags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-2 text-amber-700 bg-amber-100/80 px-4 py-2 rounded-xl font-bold text-lg">
                    <AlertCircle className="w-5 h-5" /> {tag}
                  </span>
                ))}
             </div>
          )}
        </GlassCard>

        {/* Voice reminder mockup */}
        <div className="flex justify-center mt-6">
          <button className="flex items-center justify-center gap-3 text-primary bg-primary-light/30 px-8 py-5 rounded-full hover:bg-primary-light/50 transition-colors ring-2 ring-primary/20 active:scale-95 duration-200">
            <Volume2 className="w-8 h-8" />
            <span className="font-extrabold text-xl">Play Audio Guide</span>
          </button>
        </div>
      </div>

      <div className="space-y-5 mt-12 mb-8">
        <Button 
          variant="success" 
          className="w-full text-3xl py-8 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 font-black"
          onClick={() => handleAction('taken')}
        >
          <Check className="w-8 h-8" /> YES, I TOOK IT
        </Button>
        <Button 
          variant="danger" 
          className="w-full text-2xl py-6 rounded-3xl opacity-90 shadow-lg shadow-red-500/10 flex items-center justify-center gap-2 font-bold"
          onClick={() => handleAction('missed')}
        >
          <X className="w-6 h-6" /> NO, I MISSED IT
        </Button>
      </div>
    </div>
  );
}
