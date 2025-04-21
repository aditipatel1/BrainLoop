"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as random from 'maath/random';
import * as THREE from 'three';

const StarField = ({ count = 3000 }) => {
  const ref = useRef<THREE.Points>(null!);
  const positions = React.useMemo(() => new Float32Array(random.inSphere(new Float32Array(count * 3), { radius: 1.8 })), [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.03;
      ref.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial 
        transparent
        color="#ffffff"
        size={0.004}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const GlowingSphere = ({ position, color, size = 0.1, speed = 1 }: { position: [number, number, number], color: string, size?: number, speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.1;
      meshRef.current.position.x = position[0] + Math.cos(t * 0.5) * 0.05;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.3) * 0.1);
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
};

// Create a grid of points for a "grid" effect
const Grid = () => {
  const ref = useRef<THREE.LineSegments>(null!);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.05) * 0.05;
    }
  });
  
  return (
    <group position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <lineSegments ref={ref}>
        <gridHelper args={[4, 20, '#1a1a4a', '#1a1a4a']} />
        <lineBasicMaterial transparent opacity={0.2} color="#4040ff" />
      </lineSegments>
    </group>
  );
};

const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#020212']} />
        <fog attach="fog" args={['#020212', 1, 3]} />
        <StarField />
        <Grid />
        <GlowingSphere position={[-0.5, 0.2, -0.5]} color="#7928ca" size={0.05} speed={0.7} />
        <GlowingSphere position={[0.7, -0.3, -0.4]} color="#0070f3" size={0.07} speed={1.3} />
        <GlowingSphere position={[0.3, 0.4, -0.6]} color="#00c4cc" size={0.06} speed={1} />
        <GlowingSphere position={[-0.4, -0.4, -0.8]} color="#5d36c9" size={0.04} speed={0.9} />
        
        <ambientLight intensity={0.1} />
      </Canvas>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#020212] via-transparent to-transparent" />
      <div className="background-glow bg-1" />
      <div className="background-glow bg-2" />
      <div className="background-glow bg-3" />
    </div>
  );
};

export default Background3D; 