import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MedBridgeProvider } from './contexts/MedBridgeContext';
import { AppLayout } from './layouts/AppLayout';
import { Home } from './pages/Home';
import { Upload } from './pages/Upload';
import { OCRReview } from './pages/OCRReview';
import { MedicineReview } from './pages/MedicineReview';
import { PatientDashboard } from './pages/PatientDashboard';
import { DailySchedule } from './pages/DailySchedule';
import { DoseAction } from './pages/DoseAction';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <MedBridgeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="review/ocr" element={<OCRReview />} />
            <Route path="review/medicine" element={<MedicineReview />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="schedule" element={<DailySchedule />} />
            <Route path="action/:id" element={<DoseAction />} />
            <Route path="caregiver" element={<CaregiverDashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MedBridgeProvider>
  );
}

export default App;
