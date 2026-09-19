import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { KrishnaModel } from './KrishnaModel';

// Golden Sparkle Particle System
function GoldenParticles({ count = 60, isEnding = false }) {
  const points = useRef();

  const [positions] = React.useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = Math.random() * 4 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (!points.current) return;
    const positions = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += delta * (isEnding ? 0.6 : 0.15); // float upward
      if (positions[i * 3 + 1] > 3.5) positions[i * 3 + 1] = -1.2;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isEnding ? 0.08 : 0.045}
        color={isEnding ? '#ffd700' : '#ffb74d'}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Slow Cinematic Camera Zoom
function CameraRig({ actionPhase }) {
  useFrame((state, delta) => {
    if (actionPhase === 'speaking' || actionPhase === 'ending') {
      // Zoom from Z: 4.8 down to Z: 3.6 for intimate storytelling
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 3.6, delta * 0.08);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2, delta * 0.08);
    }
  });
  return null;
}

export function KrishnaScene({ amplitude, actionPhase, onEntered }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.4, 4.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="w-full h-full"
    >
      <CameraRig actionPhase={actionPhase} />

      {/* Pixar Studio Lighting Setup */}
      <ambientLight intensity={0.75} color="#fff0f5" />

      {/* Key Sun Light (Warm Sunset) */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.4}
        color="#fff5ea"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Warm Golden Rim Light (Pixar Hair & Silhouette Glow) */}
      <spotLight
        position={[-3, 4, -3]}
        intensity={2.2}
        color="#ff7043"
        angle={0.6}
        penumbra={0.8}
      />

      {/* Soft Pinkish Fill Light */}
      <pointLight position={[2, -1, 2]} intensity={0.5} color="#ff80ab" />

      {/* Floating Golden Particles */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <GoldenParticles count={70} isEnding={actionPhase === 'ending'} />
      </Float>

      {/* 3D Character Model */}
      <KrishnaModel
        amplitude={amplitude}
        actionPhase={actionPhase}
        onEntered={onEntered}
      />

      {/* Soft Ground Contact Shadow */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.65}
        scale={6}
        blur={2}
        far={3}
        color="#3e1a00"
      />
    </Canvas>
  );
}
