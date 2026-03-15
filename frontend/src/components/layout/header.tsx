"use client";

import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';
import { AuthButton } from '../auth/AuthButton';

export default function Header() {
  const pathname = usePathname();

  const navLinkClasses = (path: string) => cn(
    "text-sm font-medium transition-colors h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md",
    pathname === path 
      ? 'bg-primary text-primary-foreground shadow-md'
      : 'hover:bg-accent/80 hover:text-accent-foreground'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Calendar className="h-7 w-7 mr-3 text-primary" />
          <span className="font-bold text-xl font-headline">Yearly Tracker 2026</span>
        </Link>
        <nav className="flex items-center gap-2">
            <Link href="/dashboard" className={navLinkClasses('/dashboard')}>
                Expense Tracker
            </Link>
            <Link href="/" className={navLinkClasses('/')}>
                Calendar
            </Link>
            <AuthButton />
            <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
