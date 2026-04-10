"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, Calendar, Wind, Star, LogIn, LogOut, Cloud } from 'lucide-react';
import { useQuantumStore } from '@/store/quantum-store';
import { logout } from '@/lib/firebase/auth';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Calendar', href: '/', icon: Calendar },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, zenMode, toggleZenMode, isSyncing } = useQuantumStore();
  const { toast } = useToast();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: "Local Protocol Active", description: "You are now in offline draft mode." });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full glass-card bg-background/60 backdrop-blur-md border-[var(--glass-border)] shadow-2xl neon-glow-cyan"
      >
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="p-2 rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-outfit font-bold tracking-tight text-gradient-cyan hidden sm:inline-block">
            AI Tracker
          </span>
        </Link>
        
        <div className="flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-full px-4 transition-all duration-300 gap-2",
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" 
                      : "hover:bg-primary/10 text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
           <div className="hidden sm:flex flex-col items-end mr-2">
             <span className="text-xs font-bold text-cyan-400">LVL {userProfile.level}</span>
             <span className="text-[10px] text-muted-foreground">{userProfile.tier}</span>
           </div>
           
           <div className="relative group cursor-help hidden sm:flex items-center justify-center p-2 rounded-full bg-cyan-500/10 text-cyan-400">
             <Star className="h-4 w-4" />
             <div className="absolute -bottom-8 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
               {userProfile.xp} XP
             </div>
           </div>

           {user && (
             <div className={cn("hidden lg:flex items-center gap-2 p-1 pl-3 rounded-full bg-white/5 border border-white/10 ml-2", isSyncing && "animate-pulse")}>
               <Cloud className={cn("h-3 w-3", isSyncing ? "text-cyan-400" : "text-white/40")} />
               <span className="text-[10px] uppercase font-black tracking-tighter text-white/40">{isSyncing ? 'Syncing...' : 'Synced'}</span>
             </div>
           )}

           <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />

           {user ? (
             <div className="flex items-center gap-3">
               <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                 {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || "User"} fill className="object-cover" />
                 ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-xs font-bold">{user.displayName?.[0]}</div>
                 )}
               </div>
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={handleLogout}
                 className="rounded-full hover:bg-rose-500/10 hover:text-rose-400 text-muted-foreground transition-colors"
               >
                 <LogOut className="h-4 w-4" />
               </Button>
             </div>
           ) : (
             <Button
               variant="ghost"
               size="sm"
               onClick={handleLogin}
               className="rounded-full px-4 gap-2 hover:bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
             >
               <LogIn className="h-4 w-4" />
               <span className="hidden sm:inline">Quantum Sync</span>
             </Button>
           )}

           <Button
             variant="ghost"
             size="icon"
             onClick={toggleZenMode}
             className={cn("rounded-full transition-all duration-500 ml-1", zenMode ? "bg-cyan-400/20 text-cyan-400" : "text-muted-foreground hover:bg-white/10")}
           >
             <Wind className="h-4 w-4" />
           </Button>
        </div>
      </motion.nav>
    </header>
  );
}
