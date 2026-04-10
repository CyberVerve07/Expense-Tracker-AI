"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuantumStore } from "@/store/quantum-store";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import ZenBackground from "@/components/quantum/zen-background";

export default function LoginPage() {
  const { user } = useQuantumStore();
  const router = useRouter();
  const { toast } = useToast();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        // Only show toast and redirect if login actually completed
        toast({
          title: "Secure Entry Granted",
          description: "Welcome to the Quantum Protocol.",
        });
        router.push("/dashboard");
      }
      // If result is null, user cancelled — do nothing
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Please check your network and try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black text-white">
      {/* Background Particles */}
      <ZenBackground />
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse decoration-5000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 md:p-12 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden group">
          {/* Scanning Line Animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />

          <div className="flex flex-col items-center text-center space-y-8">
            {/* Brand Logo / Icon */}
            <div className="p-4 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <ShieldCheck className="h-10 w-10 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-outfit font-black tracking-tight tracking-tighter">
                QUANTUM <span className="text-gradient-cyan italic">ENTRY</span>
              </h1>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">
                Secure Protocol Suite v1.0
              </p>
            </div>

            <div className="w-full space-y-4 pt-4 text-left">
               <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-colors">
                  <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Real-time Intelligence</h3>
                    <p className="text-xs text-muted-foreground">Every spend is analyzed by Llama 3.3 AI.</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 group/item hover:bg-white/10 transition-colors">
                  <div className="p-2 rounded-xl bg-purple-400/10 text-purple-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Encrypted Storage</h3>
                    <p className="text-xs text-muted-foreground">Your financial data is yours alone.</p>
                  </div>
               </div>
            </div>

            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold gap-3 neon-glow-cyan overflow-hidden group/btn relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white p-0.5 rounded-sm" alt="Google" />
              Sign In with Google
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>

            <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[80%] mx-auto">
              By entering, you initiate the sync protocol and agree to our decentralized cloud intelligence terms.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
        Lumina Ledger // Quantum Computing Div.
      </div>
    </div>
  );
}
