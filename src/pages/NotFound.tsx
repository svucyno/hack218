import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">We couldn't find the page you're looking for. It might have been moved or deleted.</p>
      <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
    </div>
  );
}
