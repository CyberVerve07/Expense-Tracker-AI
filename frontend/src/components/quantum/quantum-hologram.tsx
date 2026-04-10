"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSphere({ data }: { data?: any[] }) {
  const ref = useRef<THREE.Points>(null);

  const sphere = useMemo(() => {
    // Generate simple sphere particles
    const positions = new Float32Array(2000 * 3);
    for(let i=0; i<2000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5;
      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#22d3ee" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

export default function QuantumHologram() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
           <ParticleSphere data={[]} />
        </Float>
      </Canvas>
    </div>
  );
}
