import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * KrishnaModel
 * Loads /public/models/krishna.glb, controls walk/idle/wave animations,
 * and drives real-time mouth morphing and eye blinking.
 */
export function KrishnaModel({
  amplitude = 0,
  actionPhase = 'enter', // 'enter' | 'speaking' | 'ending'
  onEntered
}) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/krishna.glb');
  const { actions } = useAnimations(animations, group);

  const headBoneRef = useRef();
  const jawBoneRef = useRef();
  const morphTargetsRef = useRef([]);

  // Collect morph targets and key bones
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary) {
        morphTargetsRef.current.push(child);
      }
      if (child.isBone) {
        const name = child.name.toLowerCase();
        if (name.includes('head')) headBoneRef.current = child;
        if (name.includes('jaw') || name.includes('mouth')) jawBoneRef.current = child;
      }
    });
  }, [scene]);

  // Handle embedded GLB animations (Walk, Idle, Wave)
  useEffect(() => {
    if (!actions) return;

    const walkAction = actions['Walk'] || actions['walk'] || actions['Run'] || Object.values(actions)[0];
    const idleAction = actions['Idle'] || actions['idle'] || Object.values(actions)[1];
    const waveAction = actions['Wave'] || actions['wave'] || Object.values(actions)[2];

    if (actionPhase === 'enter') {
      if (walkAction) {
        walkAction.reset().fadeIn(0.2).play();
      }
    } else if (actionPhase === 'speaking') {
      if (walkAction) walkAction.fadeOut(0.4);
      if (idleAction) idleAction.reset().fadeIn(0.4).play();
      if (waveAction) {
        waveAction.reset().fadeIn(0.4).play();
        waveAction.clampWhenFinished = true;
      }
    }
  }, [actionPhase, actions]);

  // 60 FPS Procedural Movement & Lip-Sync Loop
  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.getElapsedTime();

    // 1. Entrance walk from left (X: -4.5 -> X: 0.0)
    if (actionPhase === 'enter') {
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, delta * 1.8);
      group.current.position.y = Math.sin(time * 8) * 0.05; // walking bounce
      group.current.rotation.y = THREE.MathUtils.degToRad(15);

      if (Math.abs(group.current.position.x) < 0.08) {
        group.current.position.x = 0;
        group.current.rotation.y = 0;
        if (onEntered) onEntered();
      }
    }

    // 2. Idle breathing & subtle head tilt while speaking
    if (actionPhase === 'speaking' || actionPhase === 'ending') {
      group.current.position.y = Math.sin(time * 2.5) * 0.02; // breathing
      if (headBoneRef.current) {
        headBoneRef.current.rotation.z = Math.sin(time * 1.5) * 0.04;
        headBoneRef.current.rotation.x = Math.sin(time * 2.0) * 0.03;
      }
    }

    // 3. Lip-Sync mouth movement driven by audio amplitude
    const mouthOpen = THREE.MathUtils.lerp(0, 0.95, amplitude);

    // Apply to morph targets if available (e.g. 'mouthOpen', 'viseme_aa', 'jawOpen')
    morphTargetsRef.current.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;
      if (!dict || !influences) return;

      ['mouthOpen', 'jawOpen', 'viseme_aa', 'mouth_open', 'A'].forEach((target) => {
        if (dict[target] !== undefined) {
          influences[dict[target]] = mouthOpen;
        }
      });

      // Blinking every 3.5 seconds
      const blinkCycle = Math.sin(time * 1.8);
      if (dict['blink'] !== undefined) {
        influences[dict['blink']] = blinkCycle > 0.94 ? 1 : 0;
      }
    });

    // Fallback: Animate jaw bone if morph targets are absent
    if (jawBoneRef.current) {
      jawBoneRef.current.rotation.x = mouthOpen * 0.35;
    }
  });

  return (
    <group ref={group} position={[-4.5, -1.2, 0]} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/krishna.glb');
