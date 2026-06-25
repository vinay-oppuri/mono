"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useTheme } from "next-themes";

function TopLightBeam({ isLight }: { isLight: boolean }) {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(0.4, 0.05, 1.0) },
  }), []);

  const targetColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    targetColor.setRGB(
      isLight ? 0.05 : 0.4,
      isLight ? 0.6 : 0.05,
      isLight ? 1.0 : 1.0
    );
  }, [isLight, targetColor]);

  useFrame(() => {
    uniforms.uColor.value.lerp(targetColor, 0.05);
  });

  return (
    <mesh position={[0, 2, -4]}>
      <planeGeometry args={[20, 12]} />
      <shaderMaterial
        key={isLight ? "light-beam" : "dark-beam"}
        transparent
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform vec3 uColor;
          void main() {
            float beam = smoothstep(0.18, 0.0, abs(vUv.x - 0.5) / (1.5 - vUv.y));
            float fade = smoothstep(1.0, 0.4, distance(vUv, vec2(0.5, 1.0)));
            float intensity = beam * fade;
            // Very faint
            gl_FragColor = vec4(uColor * intensity, intensity * 0.07);
          }
        `}
      />
    </mesh>
  );
}

function GlowingCrest({ isLight }: { isLight: boolean }) {
  const uniforms = useMemo(() => ({
    uRimColor: { value: new THREE.Color(1.4, 0.2, 3.2) },
  }), []);

  const targetColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    targetColor.setRGB(
      isLight ? 0.2 : 1.4,
      isLight ? 1.0 : 0.2,
      isLight ? 2.5 : 3.2
    );
  }, [isLight, targetColor]);

  useFrame(() => {
    uniforms.uRimColor.value.lerp(targetColor, 0.05);
  });

  return (
    // Sunk much lower — only top ~12% of sphere arc is visible
    <mesh position={[0, -20.8, 0]}>
      <sphereGeometry args={[18, 128, 128]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewDir = normalize(-mvPos.xyz);
            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vViewDir;
          uniform vec3 uRimColor;

          void main() {
            vec3 N = normalize(vNormal);
            vec3 V = normalize(vViewDir);

            // Fresnel
            float fresnel = 1.0 - max(0.0, dot(N, V));

            // pow(12) = very tight, hairline-thin rim
            float rim = pow(fresnel, 12.0);

            // Aggressive top mask — only the very top arc, not the sides
            float topMask = pow(max(0.0, N.y), 2.5);

            float finalRim = rim * topMask;

            // Moderate HDR multiplier — enough to fire bloom, not enough to flood
            vec3 color = uRimColor * finalRim * 12.0;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function StarField({ isLight }: { isLight: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 700;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 10 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += 0.003;
      arr[i3]     += Math.sin(time * 0.25 + i) * 0.0004;
      if (arr[i3 + 1] > 6) {
        arr[i3 + 1] = -3;
        arr[i3]     = (Math.random() - 0.5) * 16;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        key={isLight ? "light-stars" : "dark-stars"}
        size={0.015}
        color={isLight ? new THREE.Color(0.0, 0.2, 0.6) : new THREE.Color(0.85, 0.8, 1.0)}
        transparent
        opacity={0.45}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ isLight }: { isLight: boolean }) {
  return (
    <>
      <TopLightBeam isLight={isLight} />
      <GlowingCrest isLight={isLight} />
      <StarField isLight={isLight} />

      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={1.2}   // strict — only the rim's HDR pixels fire
          luminanceSmoothing={0.2}   // sharp cutoff, minimal bleed
          mipmapBlur
          intensity={0.9}            // tight controlled glow, not a fog
        />
      </EffectComposer>
    </>
  );
}

export default function PlanetBackground({ onLoaded }: { onLoaded?: () => void }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to dark mode if not mounted yet
  const isLight = mounted && resolvedTheme === 'light';

  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden transition-colors duration-1000" style={{ backgroundColor: isLight ? "#f0f8ff" : "#04000a" }}>
      {/* Barely-there purple/sky ambient at top */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: isLight 
            ? "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(14,165,233,0.15), transparent 70%)"
            : "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(100,20,180,0.06), transparent 70%)"
        }}
      />

      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={() => {
          setTimeout(() => {
            onLoaded?.();
          }, 100);
        }}
      >
        {/* We use clearColor on the renderer or just rely on the parent div background since it's transparent */}
        <Scene isLight={isLight} />
      </Canvas>
    </div>
  );
}