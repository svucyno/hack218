import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { MedicineCard } from '../components/medicine/MedicineCard';
import { mockMedicines } from '../data/mockData';
import { Plus, CheckCircle2 } from 'lucide-react';

export function MedicineReview() {
  const navigate = useNavigate();

  // Adapting the mock data format (which might have arrays for timing) to what MedicineCard expects
  const adaptedMedicines = mockMedicines.map(m => ({
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
        {adaptedMedicines.map((med) => (
          <MedicineCard
            key={med.id}
            medicine={med}
            variant="review"
            onEdit={(id) => console.log('Edit', id)}
            onDelete={(id) => console.log('Delete', id)}
          />
        ))}
      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
        <Button variant="ghost" onClick={() => navigate('/review/ocr')}>
          Back to Analysis
        </Button>
        <Button size="lg" className="flex items-center gap-2 px-8" onClick={() => navigate('/dashboard')}>
           <CheckCircle2 className="w-5 h-5" /> Confirm & Generate Schedule
        </Button>
      </div>
    </div>
  );
}
