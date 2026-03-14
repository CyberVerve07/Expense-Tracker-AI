"use client";

import Header from '@/components/layout/header';
import Dashboard from '@/components/dashboard';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function DashboardFallback() {
  return (
    <div className="flex-1 container py-8 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-semibold">Loading Dashboard...</p>
    </div>
  );
}

export default function DashboardPage() {
  // The login check has been removed to allow public access.
  // Components inside will handle their own state based on whether a user is logged in.
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <Suspense fallback={<DashboardFallback />}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  );
}
