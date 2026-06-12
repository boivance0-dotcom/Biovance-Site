import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Earth component with realistic textures
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create Earth texture
  const earthTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Create bump map for terrain
  const bumpMap = useMemo(() => {
    return new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'
    );
  }, []);

  // Create specular map for water
  const specularMap = useMemo(() => {
    return new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'
    );
  }, []);

  // Create clouds texture
  const cloudsTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Animate Earth rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={5}
        />
      </mesh>
      
      {/* Clouds layer */}
      <mesh>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsTexture}
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Atmosphere glow effect
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.1, 64, 64]} />
      <meshPhongMaterial
        color="#4a90e2"
        transparent={true}
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Main Earth3D component
interface Earth3DProps {
  className?: string;
  style?: React.CSSProperties;
}

const Earth3D: React.FC<Earth3DProps> = ({ className = '', style = {} }) => {
  return (
    <div 
      className={`relative w-full h-full min-h-[400px] ${className}`}
      style={style}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient light for overall illumination */}
        <ambientLight intensity={0.2} />
        
        {/* Main directional light (sun) */}
        <directionalLight
          position={[5, 3, 5]}
          intensity={1}
          castShadow
        />
        
        {/* Additional fill light */}
        <directionalLight
          position={[-5, -3, -5]}
          intensity={0.3}
        />
        
        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {/* Earth and atmosphere */}
        <Earth />
        <Atmosphere />
        
        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={1.5}
          maxDistance={4}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Overlay text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white/80">
          <div className="text-sm font-medium tracking-wider uppercase">
            Explore Our Planet
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earth3D;