"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

function FlowingBlocks({ isLight }: { isLight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const blocksRef = useRef<THREE.Mesh[]>([]);

  // Generate random physical properties for 30 blocks
  const blocksData = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      baseX: (Math.random() - 0.5) * 6,
      baseY: (Math.random() - 0.5) * 12,
      baseZ: (Math.random() - 0.5) * 6,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      scale: Math.random() * 0.7 + 0.3,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      flowOffset: Math.random() * Math.PI * 2, 
    }));
  }, []);

  const materialProps = useMemo(() => ({
    color: isLight ? "#0ea5e9" : "#8b5cf6", 
    roughness: 0.1,
    metalness: 0.5,
    transparent: true,
    opacity: 0.85,
  }), [isLight]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // --- Responsive X Positioning ---
    // If screen width is less than 768px (mobile), bring blocks closer to center
    const isMobile = window.innerWidth < 768;
    const startX = isMobile ? 3.5 : 8; 
    const endX = isMobile ? -3.5 : -8;

    // --- 1. THE SCROLL EFFECT (Side Switching) ---
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    // Map progress to X position
    const targetX = startX + (endX - startX) * scrollProgress;

    // Smoothly drag the entire group to the target X
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.05
    );

    // Gently tilt the whole group for perspective
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;

    // --- 2. THE AIR FLOW & ROTATION EFFECT ---
    blocksRef.current.forEach((block, i) => {
      if (!block) return;
      const data = blocksData[i];

      // Continuous individual rotation
      block.rotation.x += data.rotSpeedX;
      block.rotation.y += data.rotSpeedY;

      // Air flow: Use Sine and Cosine waves
      block.position.y = data.baseY + Math.sin(time * 0.5 + data.flowOffset) * 1.5;
      block.position.z = data.baseZ + Math.cos(time * 0.4 + data.flowOffset) * 1.0;
    });
  });

  return (
    <group ref={groupRef}>
      {blocksData.map((data, index) => (
        <mesh
          key={index}
          // @ts-ignore - assigning to the ref array
          ref={(el) => (blocksRef.current[index] = el)}
          position={[data.baseX, data.baseY, data.baseZ]}
          rotation={[data.rotX, data.rotY, 0]}
          scale={data.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
      ))}
    </group>
  );
}

export default function BlocksBackground({ onLoaded }: { onLoaded?: () => void }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && resolvedTheme === 'light';

  return (
    <div 
      className="fixed inset-0 -z-50 w-full h-full pointer-events-none transition-colors duration-1000" 
      style={{ backgroundColor: isLight ? "#f0f8ff" : "#04000a" }}
    >
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }}
        onCreated={() => {
          setTimeout(() => {
            onLoaded?.();
          }, 100);
        }}
      >
        <Environment preset={isLight ? "city" : "night"} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={isLight ? 2.5 : 1.5} 
          color={isLight ? "#ffffff" : "#c4b5fd"} 
        />
        <ambientLight intensity={isLight ? 1 : 0.2} />

        <FlowingBlocks isLight={isLight} />
      </Canvas>
    </div>
  );
}