"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, LayoutDashboard, Calendar, Wind, Star } from 'lucide-react';
import { useQuantumStore } from '@/store/quantum-store';

const navigation = [
  { name: 'Calendar', href: '/', icon: Calendar },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export default function Header() {
  const pathname = usePathname();
  const { userProfile, zenMode, toggleZenMode } = useQuantumStore();

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

           <Button
             variant="ghost"
             size="icon"
             onClick={toggleZenMode}
             className={cn("rounded-full transition-all duration-500", zenMode ? "bg-cyan-400/20 text-cyan-400" : "text-muted-foreground hover:bg-white/10")}
           >
             <Wind className="h-4 w-4" />
           </Button>
        </div>
      </motion.nav>
    </header>
  );
}
