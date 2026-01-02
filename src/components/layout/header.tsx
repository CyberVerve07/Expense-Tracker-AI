
"use client";

import { Calendar, LogIn, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, auth, isUserLoading } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
      await auth.signOut();
      router.push('/auth/login');
  }

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
            {isUserLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                                <AvatarFallback>
                                    {user.displayName?.[0] || user.email?.[0]}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Expense Tracker</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild variant="ghost" size="sm">
                    <Link href="/auth/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                </Button>
            )}
        </nav>
      </div>
    </header>
  );
}
