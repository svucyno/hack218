import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans mb-20 sm:mb-0">
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <Outlet />
      </main>
    </div>
  );
}
