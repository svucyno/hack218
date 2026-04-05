import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { ScanText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function OCRReview() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const mockExtractedText = `Patient Name: Venkateshwara Rao\nAge: 68\nDate: 23/10/2026\n\nRx:\n1. Metformin 500mg - 1 tab twice daily after food\n2. Amlodipine 5mg - 1 tab morning before food`;

  const handleContinue = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/review/medicine');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Document Analysis" 
        subtitle="Review the raw extracted text before proceeding to structured medicine entry."
        icon={ScanText}
      />

      <GlassCard className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-emerald-100/80 text-emerald-600 rounded-2xl">
             <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Extraction Complete</h2>
            <p className="text-slate-500 mt-1">We've extracted the raw text from your document. Our AI will automatically structure this into a daily schedule in the next step.</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-8 relative shadow-inner">
          <div className="absolute top-0 right-0 px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-bl-lg rounded-tr-2xl uppercase tracking-widest">
            Raw Output
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">{mockExtractedText}</pre>
        </div>

        <div className="mt-8 flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
           <AlertTriangle className="w-6 h-6 flex-shrink-0" />
           <p className="text-sm font-medium">Please verify the detected medicines in the next step to ensure complete accuracy. AI extraction may require human review.</p>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button variant="ghost" className="text-slate-500" onClick={() => navigate('/upload')}>Go Back</Button>
          <Button size="lg" onClick={handleContinue} isLoading={isProcessing} className="gap-2">
             Review Extracted Medicines <ArrowRight size={18} />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
