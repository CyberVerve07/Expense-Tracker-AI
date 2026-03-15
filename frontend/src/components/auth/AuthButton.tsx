'use client';

import { useAuth } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium hidden md:inline-block">
          {user.displayName || user.email}
        </span>
        <Button 
          variant="outline" 
          onClick={() => signOut()}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => signInWithGoogle()}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      Sign in with Google
    </Button>
  );
}
