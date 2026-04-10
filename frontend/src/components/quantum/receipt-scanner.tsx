"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { processReceiptImage } from '@/ai/flows/vision-scanner-flow';
import { useQuantumStore } from '@/store/quantum-store';
import { ScanLine, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiptScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const addExpense = useQuantumStore(state => state.addExpense);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setIsScanning(true);

      try {
        const result = await processReceiptImage(base64);
        
        addExpense({
          merchant: result.merchant,
          amount: result.amount,
          currency: result.currency,
          category: result.category,
          date: result.date || new Date().toISOString().split('T')[0]
        });

        toast({
          title: "Scan Successful",
          description: `Added ${result.currency}${result.amount} at ${result.merchant}. You earned +10 XP!`,
        });
      } catch (error) {
        console.error("Scanning failed", error);
        toast({
          title: "Scan Failed",
          description: "Could not process receipt.",
          variant: "destructive"
        });
      } finally {
        setIsScanning(false);
        setPreview(null);
      }
    };
    reader.readAsDataURL(file);
  }, [addExpense, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`relative overflow-hidden rounded-[32px] border-2 border-dashed transition-all duration-300 p-12 text-center cursor-pointer min-h-[300px] flex items-center justify-center
          ${isDragActive ? 'border-cyan-400 bg-cyan-400/5' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Receipt preview" className="w-full h-full object-cover opacity-30" />
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="relative w-full h-2 bg-white/10 overflow-hidden mb-4 rounded-full max-w-xs mx-auto">
                     <motion.div 
                       className="absolute left-0 top-0 bottom-0 w-1/3 bg-cyan-400 shadow-[0_0_15px_#22d3ee] rounded-full"
                       animate={{
                         x: ["-100%", "300%"]
                       }}
                       transition={{
                         repeat: Infinity,
                         duration: 1.5,
                         ease: "linear"
                       }}
                     />
                  </div>
                  <p className="text-cyan-400 font-bold font-outfit text-lg tracking-widest uppercase flex items-center gap-2">
                     <ScanLine className="h-5 w-5 animate-pulse" /> AI Extracting
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 relative z-20"
            >
              <div className="p-4 rounded-full bg-white/5">
                 <UploadCloud className="h-8 w-8 text-white/50" />
              </div>
              <div>
                <p className="font-outfit font-bold text-lg">Drop receipt to auto-log</p>
                <p className="text-sm text-white/40">JPEG, PNG up to 4MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
