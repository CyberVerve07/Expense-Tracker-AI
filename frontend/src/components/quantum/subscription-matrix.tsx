"use client";

import { useQuantumStore } from '@/store/quantum-store';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function SubscriptionMatrix() {
  const expenses = useQuantumStore(state => state.expenses);

  const grouped = expenses.reduce((acc, curr) => {
    acc[curr.merchant] = (acc[curr.merchant] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const subItems = Object.entries(grouped)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="relative py-12 flex flex-col items-center justify-center space-y-8 min-h-[300px]">
      {subItems.length === 0 ? (
        <div className="text-center opacity-40">
           <RefreshCw className="h-12 w-12 mx-auto mb-4" />
           <p className="font-outfit font-medium">No recurring nodes detected yet.</p>
        </div>
      ) : (
        <div className="relative w-64 h-64">
           {/* Core */}
           <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)]">
              <span className="font-outfit font-black text-xs text-primary-foreground">CORE</span>
           </div>
           
           {/* Orbits */}
           {subItems.map((item, i) => {
             const radius = 60 + (i * 25);
             const duration = 15 + (i * 5);
             const isReversed = i % 2 !== 0;
             return (
               <motion.div 
                 key={item[0]}
                 className="absolute inset-0 m-auto border border-white/5 rounded-full"
                 style={{ width: radius * 2, height: radius * 2 }}
                 animate={{ rotate: isReversed ? -360 : 360 }}
                 transition={{ repeat: Infinity, duration, ease: "linear" }}
               >
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 whitespace-nowrap flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-semibold">{item[0]}</span>
                    <span className="text-[10px] text-white/50">₹{item[1]}</span>
                 </div>
               </motion.div>
             )
           })}
        </div>
      )}
    </div>
  );
}
