"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Sphere } from "@react-three/drei";

function Scene() {
    const { viewport } = useThree();
    const isMobile = viewport.width < 3.5;
    const scale = isMobile ? 0.6 : 1;

    return (
        <>
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <pointLight position={[-10, -10, -10]} intensity={2} color="#ffffff" />

            <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
                <group scale={scale}>
                    {/* Inner Solid Black Blob */}
                    <Sphere args={[1.4, 64, 64]}>
                        <MeshDistortMaterial
                            color="#000000"
                            distort={0.3}
                            speed={1.5}
                            roughness={0.1}
                            metalness={1}
                        />
                    </Sphere>
                    {/* Outer Wireframe Glow */}
                    <Sphere args={[1.45, 32, 32]}>
                        <MeshDistortMaterial
                            color="#ffffff"
                            wireframe={true}
                            transparent={true}
                            opacity={0.1}
                            distort={0.4}
                            speed={2}
                        />
                    </Sphere>
                </group>
            </Float>
        </>
    );
}

export default function SplineScene() {
    return (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
                    <Scene />
                </Canvas>
            </div>

            {/* Hero Text Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full select-none pointer-events-none">
                <h1 className="text-4xl md:text-7xl font-extralight tracking-[0.4em] text-white mb-8 md:mb-10 uppercase ml-2 md:ml-4">
                    The Mono
                </h1>
                <div className="w-12 h-px bg-white/20 mb-8 md:mb-10"></div>
                <p className="text-[10px] md:text-xs text-white/50 tracking-[0.3em] font-light uppercase">
                    Reusable Context Aware Agents
                </p>
            </div>
        </div>
    );
}
