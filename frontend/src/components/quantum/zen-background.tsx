"use client";

import { useEffect, useRef } from 'react';
import { useQuantumStore } from '@/store/quantum-store';
import { useTheme } from 'next-themes';

export default function ZenBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zenMode = useQuantumStore(state => state.zenMode);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        // In Zen mode, float up gently. Normal mode, subtle drift randomly
        this.vx = zenMode ? (Math.random() - 0.5) * 0.2 : (Math.random() - 0.5) * 0.5;
        this.vy = zenMode ? -Math.random() * 0.5 - 0.1 : (Math.random() - 0.5) * 0.5;
        this.color = zenMode 
            ? `rgba(34, 211, 238, ${Math.random() * 0.3})` // Cyan tint
            : theme === 'dark' ? `rgba(255, 255, 255, ${Math.random() * 0.1})` : `rgba(0, 0, 0, ${Math.random() * 0.05})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas!.width;
        if (this.x > canvas!.width) this.x = 0;
        if (this.y < 0) this.y = canvas!.height;
        if (this.y > canvas!.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const density = zenMode ? 100 : 50;
      for (let i = 0; i < density; i++) {
        particles.push(new Particle());
      }
    };
    init();

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [zenMode, theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none z-[-1] transition-opacity duration-1000 ${zenMode ? 'opacity-100' : 'opacity-30'}`}
    />
  );
}
