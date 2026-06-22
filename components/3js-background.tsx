"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function TopLightBeam() {
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(0.4, 0.05, 1.0) },
  }), []);

  return (
    <mesh position={[0, 2, -4]}>
      <planeGeometry args={[20, 12]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
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
            // Very faint — just a subtle purple tint in the upper scene
            gl_FragColor = vec4(uColor * intensity, intensity * 0.07);
          }
        `}
      />
    </mesh>
  );
}

function GlowingCrest() {
  const uniforms = useMemo(() => ({
    // Violet-purple rim — HDR but not overblown
    uRimColor: { value: new THREE.Color(1.4, 0.2, 3.2) },
  }), []);

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

function StarField() {
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
        size={0.015}
        color={new THREE.Color(0.85, 0.8, 1.0)}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <TopLightBeam />
      <GlowingCrest />
      <StarField />

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

export default function PlanetBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none overflow-hidden">
      {/* Near-pure black — deep space */}
      <div className="absolute inset-0 bg-[#04000a]" />

      {/* Barely-there purple ambient at top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_0%,rgba(100,20,180,0.06),transparent_70%)]" />

      {/* Grid — almost invisible */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, #9333ea 1px, transparent 1px),
            linear-gradient(to bottom, #9333ea 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#030008"]} />
        <Scene />
      </Canvas>
    </div>
  );
}