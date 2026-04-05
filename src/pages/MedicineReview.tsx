import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { MedicineCard } from '../components/medicine/MedicineCard';
import { Plus, CheckCircle2 } from 'lucide-react';
import { useMedBridge } from '../contexts/MedBridgeContext';
import type { Medicine } from '../types';

export function MedicineReview() {
  const navigate = useNavigate();
  const { ocrResult, handleGenerateSchedule, isLoading } = useMedBridge();
  
  // Local state for editing the medicines before confirming
  const [localMedicines, setLocalMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    if (ocrResult?.parsedMedicines) {
       setLocalMedicines(ocrResult.parsedMedicines);
    }
  }, [ocrResult]);

  const handleDelete = (id: string) => {
    setLocalMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleConfirm = async () => {
    await handleGenerateSchedule(localMedicines);
    navigate('/dashboard');
  };

  // Adapting the format to MedicineCard expects
  const adaptedMedicines = localMedicines.map(m => ({
    id: m.id,
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    timing: Array.isArray(m.timing) ? m.timing.join(', ') : m.timing,
    duration: m.duration,
    instruction: m.instruction
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Verify Medicines" 
        subtitle="Please review the extracted medication schedule. You can edit, add, or remove items before finalizing."
        action={
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Medicine
          </Button>
        }
      />

      <div className="space-y-4">
        {adaptedMedicines.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No medicines found. Please add manually or restart upload.</p>
        ) : (
          adaptedMedicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              variant="review"
              onEdit={(id) => console.log('Edit', id)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
        <Button variant="ghost" onClick={() => navigate('/review/ocr')} disabled={isLoading}>
          Back to Analysis
        </Button>
        <Button size="lg" className="flex items-center gap-2 px-8" onClick={handleConfirm} isLoading={isLoading} disabled={localMedicines.length === 0}>
           <CheckCircle2 className="w-5 h-5" /> Confirm & Generate Schedule
        </Button>
      </div>
    </div>
  );
}
