import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { PageHeader } from '../components/common/PageHeader';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import { cn } from '../utils/cn';

export function Upload() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const simulateUpload = () => {
    // In a real app we'd upload. Here we just navigate to OCR review.
    navigate('/review/ocr');
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Upload Prescription" 
        subtitle="We will automatically extract medicines, dosages, and schedules."
        icon={FileText}
      />

      {!file ? (
        <GlassCard 
          className={cn(
            "p-16 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-300 cursor-pointer",
            isDragging ? "border-primary bg-primary-light/30 scale-[1.02]" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            // Simulated generic file selection
            const dummyFile = new File(["dummy content"], "discharge_summary.pdf", { type: "application/pdf" });
            setFile(dummyFile);
          }}
        >
          <div className="p-5 bg-white shadow-sm rounded-full text-primary">
            <UploadCloud className="w-12 h-12" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">Click to upload or drag and drop</p>
            <p className="text-base text-slate-500 mt-2">Supports PDF, JPG, PNG (max. 10MB)</p>
          </div>
          <Button variant="secondary" className="mt-4 pointer-events-none">
            Browse Files
          </Button>
        </GlassCard>
      ) : (
        <GlassCard className="p-8 space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary-light text-primary rounded-2xl">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{file.name}</h3>
                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB • Ready for extraction</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <CheckCircle2 className="text-emerald-500" size={24} />
            <p className="text-sm text-slate-700 font-medium">Document verified. Ready to extract actionable schedule.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setFile(null)}>Cancel</Button>
            <Button size="lg" onClick={simulateUpload}>Extract Medicines</Button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
