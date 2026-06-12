import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RealisticEarth: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let earth: THREE.Mesh;
    let clouds: THREE.Mesh;
    let atmosphere: THREE.Mesh;
    let atmosphere2: THREE.Mesh;
    let ring1: THREE.Mesh;
    let ring2: THREE.Mesh;
    let stars: THREE.Points;
    let asteroidGroup: THREE.Group;
    let animationId: number;

    const init = async () => {
      try {
        // Import anime.js dynamically
        const anime = await import('animejs');

        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Camera setup
        camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current!.clientWidth / containerRef.current!.clientHeight,
          0.1,
          1000
        );
        camera.position.z = 4;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.8;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current!.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x080808, 0.05);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 3, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0x404040, 0.2);
        fillLight.position.set(-5, -3, -5);
        scene.add(fillLight);

        // Create realistic starfield with fewer stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 3000; // Much fewer stars
        const positions = new Float32Array(starsCount * 3);
        const colors = new Float32Array(starsCount * 3);
        const sizes = new Float32Array(starsCount);

        for (let i = 0; i < starsCount * 3; i += 3) {
          // Realistic star distribution
          const radius = 30 + Math.random() * 70;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[i] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = radius * Math.cos(phi);

          // Realistic star colors
          const starType = Math.random();
          let color;
          if (starType < 0.8) {
            // White stars (most common)
            const temp = 0.9 + Math.random() * 0.1;
            color = new THREE.Color(temp, temp, temp);
          } else if (starType < 0.95) {
            // Blue-white stars
            color = new THREE.Color(0.8, 0.8, 1.0);
          } else {
            // Yellow stars
            color = new THREE.Color(1.0, 0.9, 0.7);
          }

          colors[i] = color.r;
          colors[i + 1] = color.g;
          colors[i + 2] = color.b;

          // Realistic star sizes
          const brightness = Math.random();
          sizes[i / 3] = 0.003 + brightness * 0.01;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create simple star texture
        const starCanvas = document.createElement('canvas');
        starCanvas.width = 16;
        starCanvas.height = 16;
        const starCtx = starCanvas.getContext('2d')!;

        const gradient = starCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        starCtx.fillStyle = gradient;
        starCtx.fillRect(0, 0, 16, 16);

        const starTexture = new THREE.CanvasTexture(starCanvas);

        const starsMaterial = new THREE.PointsMaterial({
          size: 1,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
          map: starTexture,
          depthWrite: false
        });

        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Create floating asteroids/rocks
        asteroidGroup = new THREE.Group();
        const asteroidCount = 15;

        for (let i = 0; i < asteroidCount; i++) {
          // Random asteroid size
          const size = 0.02 + Math.random() * 0.08;

          // Create irregular asteroid geometry
          const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
          // Distort the geometry to make it more irregular
          const positions = asteroidGeometry.attributes.position;
          for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j);
            const y = positions.getY(j);
            const z = positions.getZ(j);

            const distortion = 0.1 + Math.random() * 0.2;
            positions.setXYZ(j, x * distortion, y * distortion, z * distortion);
          }

          // Create asteroid material
          const asteroidMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.4, 0.3 + Math.random() * 0.4),
            shininess: 5,
            specular: 0x111111
          });

          const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

          // Position asteroids around Earth
          const angle = Math.random() * Math.PI * 2;
          const distance = 2 + Math.random() * 3;
          const height = (Math.random() - 0.5) * 2;

          asteroid.position.set(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
          );

          // Random rotation
          asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );

          asteroid.castShadow = true;
          asteroid.receiveShadow = true;

          asteroidGroup.add(asteroid);
        }

        scene.add(asteroidGroup);

        // Earth setup
        const earthGeometry = new THREE.SphereGeometry(1, 256, 256);
        
        // Load Earth textures
        const textureLoader = new THREE.TextureLoader();
        
        try {
          const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
          const bumpMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
          const specularMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');
          const cloudsTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');

          const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: bumpMap,
            bumpScale: 0.05,
            specularMap: specularMap,
            shininess: 30,
            specular: 0x333333
          });

          earth = new THREE.Mesh(earthGeometry, earthMaterial);
          earth.castShadow = true;
          earth.receiveShadow = true;
          scene.add(earth);

          // Clouds
          const cloudsGeometry = new THREE.SphereGeometry(1.02, 256, 256);
          const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
          });

          clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
          scene.add(clouds);

        } catch (error) {
          console.warn('Failed to load Earth textures, using fallback:', error);
          
          // Fallback Earth material
          const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            shininess: 30,
            specular: 0x333333
          });

          earth = new THREE.Mesh(earthGeometry, earthMaterial);
          earth.castShadow = true;
          earth.receiveShadow = true;
          scene.add(earth);
        }

        // Atmosphere
        const atmosphereGeometry = new THREE.SphereGeometry(1.1, 128, 128);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
          color: 0x87ceeb,
          transparent: true,
          opacity: 0.08,
          side: THREE.BackSide
        });

        atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        const atmosphereGeometry2 = new THREE.SphereGeometry(1.2, 128, 128);
        const atmosphereMaterial2 = new THREE.MeshPhongMaterial({
          color: 0x87ceeb,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide
        });

        atmosphere2 = new THREE.Mesh(atmosphereGeometry2, atmosphereMaterial2);
        scene.add(atmosphere2);

        // Orbital rings
        const ringGeometry1 = new THREE.RingGeometry(1.3, 1.4, 128);
        const ringMaterial1 = new THREE.MeshPhongMaterial({
          color: 0x444444,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide
        });

        ring1 = new THREE.Mesh(ringGeometry1, ringMaterial1);
        ring1.rotation.x = Math.PI / 2;
        scene.add(ring1);

        const ringGeometry2 = new THREE.RingGeometry(1.5, 1.6, 128);
        const ringMaterial2 = new THREE.MeshPhongMaterial({
          color: 0x666666,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide
        });

        ring2 = new THREE.Mesh(ringGeometry2, ringMaterial2);
        ring2.rotation.x = Math.PI / 2;
        ring2.rotation.z = Math.PI / 4;
        scene.add(ring2);

        // Camera animation
        anime.default({
          targets: camera.position,
          z: [4, 3.5],
          duration: 6000,
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: true
        });

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          if (earth) earth.rotation.y += 0.002;
          if (clouds) clouds.rotation.y += 0.003;
          if (ring1) ring1.rotation.z += 0.001;
          if (ring2) ring2.rotation.z -= 0.0015;

          // Rotate asteroids slowly
          if (asteroidGroup) {
            asteroidGroup.children.forEach((asteroid, index) => {
              asteroid.rotation.x += 0.01;
              asteroid.rotation.y += 0.01;
              
              // Orbital movement
              const time = Date.now() * 0.0001;
              const angle = time + index * 0.5;
              const distance = 2 + Math.sin(time * 0.5 + index) * 0.5;
              
              asteroid.position.x = Math.cos(angle) * distance;
              asteroid.position.z = Math.sin(angle) * distance;
            });
          }

          renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!containerRef.current) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (animationId) cancelAnimationFrame(animationId);
          if (renderer && containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
            renderer.dispose();
          }
        };

      } catch (error) {
        console.error('Failed to initialize Three.js scene:', error);
      }
    };

    init();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full"
      style={{ background: '#000000' }}
    />
  );
};

export default RealisticEarth;