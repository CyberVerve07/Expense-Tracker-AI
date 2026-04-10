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

import ZenBackground from '@/components/quantum/zen-background';
import AuthSync from '@/components/firebase/auth-sync';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent relative z-10">
      <AuthSync />
      <ZenBackground />
      <Header />
      <main className="flex-1 container py-8">
        <Suspense fallback={<DashboardFallback />}>
          <Dashboard />
        </Suspense>
      </main>
    </div>
  );
}
