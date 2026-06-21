"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// 1. The Particle System (Stardust Smoke)
function ParticleSmoke() {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate 2000 particles
    const particleCount = 2000;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10; // X spread
            pos[i * 3 + 1] = Math.random() * 10 - 5; // Y spread
            pos[i * 3 + 2] = (Math.random() - 0.5) * 5;  // Z depth
        }
        return pos;
    }, []);

    // Animate the particles drifting up and waving
    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Move Y up
            positions[i3 + 1] += 0.02;
            // Add a subtle wave to X based on Y height (fluid look)
            positions[i3] += Math.sin(time + positions[i3 + 1]) * 0.005;

            // Reset particles when they go too high
            if (positions[i3 + 1] > 6) {
                positions[i3 + 1] = -4;
                positions[i3] = (Math.random() - 0.5) * 5; // Respawn near center
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            {/* HDR Colors: Values above 1 trigger the Bloom effect */}
            <pointsMaterial
                size={0.03}
                color={new THREE.Color(2, 1, 4)} // Glowing purple/white
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

// 2. The Main Scene
function Scene() {
    return (
        <>
            {/* The Sharp Neon Laser Line */}
            <mesh position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.015, 0.015, 20, 16]} />
                {/* Extreme RGB values force the post-processing Bloom to glow heavily */}
                <meshBasicMaterial color={new THREE.Color(10, 2, 20)} />
            </mesh>

            {/* The Glowing Planet Crest at the bottom */}
            <mesh position={[0, -6.5, -2]}>
                <sphereGeometry args={[5, 64, 64]} />
                <meshBasicMaterial color={new THREE.Color(4, 1, 8)} />
            </mesh>

            {/* The Particle Smoke Eruption */}
            <ParticleSmoke />

            {/* The Secret Sauce: Optical Post-Processing */}
            <EffectComposer enableNormalPass={false}>
                <Bloom
                    luminanceThreshold={1} // Only glow things with color values > 1
                    mipmapBlur // Gives that buttery smooth, highly dispersed cinematic glow
                    intensity={2.5}
                />
            </EffectComposer>
        </>
    );
}

// 3. The Wrapper Component
export default function VeoBackground() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <color attach="background" args={["#000000"]} />
                <Scene />
            </Canvas>
        </div>
    );
}