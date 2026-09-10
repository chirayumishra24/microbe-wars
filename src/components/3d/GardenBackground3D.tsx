'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGame } from '@/context/GameContext';

export const GardenBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { teamACorrectCount, teamBCorrectCount } = useGame();

  const countsRef = useRef({ a: teamACorrectCount, b: teamBCorrectCount });
  useEffect(() => {
    countsRef.current = { a: teamACorrectCount, b: teamBCorrectCount };
  }, [teamACorrectCount, teamBCorrectCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 3D Scene setup with bright daylight garden sky
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD9F3FF); // Bright fresh morning sky
    scene.fog = new THREE.FogExp2(0xD9F3FF, 0.025);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 9.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Natural Outdoor Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xFFFBEB, 1.8);
    sun.position.set(6, 12, 6);
    sun.castShadow = true;
    scene.add(sun);

    const skyHemi = new THREE.HemisphereLight(0xBAE6FD, 0xBBF7D0, 0.65);
    scene.add(skyHemi);

    // Main Meadow Grass Ground
    const meadowGeo = new THREE.PlaneGeometry(45, 45, 16, 16);
    const meadowMat = new THREE.MeshStandardMaterial({
      color: 0x86EFAC, // Fresh lime-green lawn
      roughness: 0.8,
    });
    const meadow = new THREE.Mesh(meadowGeo, meadowMat);
    meadow.rotation.x = -Math.PI / 2;
    meadow.position.y = 0;
    meadow.receiveShadow = true;
    scene.add(meadow);

    // Team A Raised Soil Bed (Left side: -4.5 x)
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x4A2E18, // Rich organic planting humus
      roughness: 0.95,
    });

    const bedGeoA = new THREE.BoxGeometry(6.5, 0.45, 5.5);
    const bedA = new THREE.Mesh(bedGeoA, soilMat);
    bedA.position.set(-4.2, 0.22, 0);
    bedA.receiveShadow = true;
    scene.add(bedA);

    // Team B Raised Soil Bed (Right side: +4.5 x)
    const bedB = new THREE.Mesh(bedGeoA, soilMat);
    bedB.position.set(4.2, 0.22, 0);
    bedB.receiveShadow = true;
    scene.add(bedB);

    // Wooden Border Edges for Soil Beds
    const woodBorderMat = new THREE.MeshStandardMaterial({ color: 0x854D0E, roughness: 0.8 });
    const borderGeoX = new THREE.BoxGeometry(6.7, 0.5, 0.2);
    const borderGeoZ = new THREE.BoxGeometry(0.2, 0.5, 5.7);

    // Bed A borders
    const borderA1 = new THREE.Mesh(borderGeoX, woodBorderMat);
    borderA1.position.set(-4.2, 0.25, 2.75);
    scene.add(borderA1);
    const borderA2 = new THREE.Mesh(borderGeoX, woodBorderMat);
    borderA2.position.set(-4.2, 0.25, -2.75);
    scene.add(borderA2);
    const borderA3 = new THREE.Mesh(borderGeoZ, woodBorderMat);
    borderA3.position.set(-7.45, 0.25, 0);
    scene.add(borderA3);
    const borderA4 = new THREE.Mesh(borderGeoZ, woodBorderMat);
    borderA4.position.set(-0.95, 0.25, 0);
    scene.add(borderA4);

    // Bed B borders
    const borderB1 = new THREE.Mesh(borderGeoX, woodBorderMat);
    borderB1.position.set(4.2, 0.25, 2.75);
    scene.add(borderB1);
    const borderB2 = new THREE.Mesh(borderGeoX, woodBorderMat);
    borderB2.position.set(4.2, 0.25, -2.75);
    scene.add(borderB2);
    const borderB3 = new THREE.Mesh(borderGeoZ, woodBorderMat);
    borderB3.position.set(0.95, 0.25, 0);
    scene.add(borderB3);
    const borderB4 = new THREE.Mesh(borderGeoZ, woodBorderMat);
    borderB4.position.set(7.45, 0.25, 0);
    scene.add(borderB4);

    // Team Flags (Banners)
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.5, 12);
    const flagGeo = new THREE.PlaneGeometry(1.4, 0.75);

    // Flag A (Blue)
    const poleMatA = new THREE.MeshStandardMaterial({ color: 0x1E40AF, metalness: 0.3 });
    const poleA = new THREE.Mesh(poleGeo, poleMatA);
    poleA.position.set(-4.2, 1.75, -2.6);
    scene.add(poleA);

    const flagMatA = new THREE.MeshBasicMaterial({ color: 0x2563EB, side: THREE.DoubleSide });
    const flagA = new THREE.Mesh(flagGeo, flagMatA);
    flagA.position.set(-3.5, 3.0, -2.6);
    scene.add(flagA);

    // Flag B (Orange)
    const poleMatB = new THREE.MeshStandardMaterial({ color: 0xC2410C, metalness: 0.3 });
    const poleB = new THREE.Mesh(poleGeo, poleMatB);
    poleB.position.set(4.2, 1.75, -2.6);
    scene.add(poleB);

    const flagMatB = new THREE.MeshBasicMaterial({ color: 0xEA580C, side: THREE.DoubleSide });
    const flagB = new THREE.Mesh(flagGeo, flagMatB);
    flagB.position.set(4.9, 3.0, -2.6);
    scene.add(flagB);

    // ----------------------------------------------------
    // CROP SPECIES GENERATION
    // ----------------------------------------------------
    interface CropEntity {
      group: THREE.Group;
      stem: THREE.Mesh;
      leaves: THREE.Mesh[];
      flowerOrFruit: THREE.Mesh[];
      team: 'A' | 'B';
      baseX: number;
      baseZ: number;
    }

    const crops: CropEntity[] = [];

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x16A34A, roughness: 0.5 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.4, side: THREE.DoubleSide });
    const sunflowerPetalsMat = new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.3 });
    const sunflowerCenterMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.9 });
    const cornCobMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4 });

    const createCrop = (x: number, z: number, team: 'A' | 'B') => {
      const group = new THREE.Group();
      group.position.set(x, 0.45, z);

      // Main Stem
      const stemHeight = 1.0;
      const stemGeo = new THREE.CylinderGeometry(0.06, 0.09, stemHeight, 8);
      stemGeo.translate(0, stemHeight / 2, 0);
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.castShadow = true;
      group.add(stem);

      // Leaves
      const leaves: THREE.Mesh[] = [];
      const leafGeo = new THREE.ConeGeometry(0.24, 0.65, 5);
      leafGeo.rotateX(Math.PI / 3);

      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.y = 0.25 + i * 0.22;
        leaf.rotation.y = (i * Math.PI) / 2;
        group.add(leaf);
        leaves.push(leaf);
      }

      // Flower / Ear of Corn
      const flowerOrFruit: THREE.Mesh[] = [];
      if (team === 'A') {
        // Sunflower bloom
        const centerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12);
        centerGeo.rotateX(Math.PI / 2);
        const center = new THREE.Mesh(centerGeo, sunflowerCenterMat);
        center.position.y = 1.08;
        group.add(center);
        flowerOrFruit.push(center);

        const petalGeo = new THREE.TorusGeometry(0.26, 0.08, 8, 16);
        const petals = new THREE.Mesh(petalGeo, sunflowerPetalsMat);
        petals.position.y = 1.08;
        group.add(petals);
        flowerOrFruit.push(petals);
      } else {
        // Golden Corn Cob
        const cobGeo = new THREE.CapsuleGeometry(0.12, 0.45, 8, 16);
        const cob = new THREE.Mesh(cobGeo, cornCobMat);
        cob.position.y = 1.05;
        cob.rotation.z = 0.2;
        group.add(cob);
        flowerOrFruit.push(cob);
      }

      scene.add(group);
      crops.push({ group, stem, leaves, flowerOrFruit, team, baseX: x, baseZ: z });
    };

    // Plant 12 crops on Team A bed
    for (let r = -1.8; r <= 1.8; r += 1.2) {
      for (let c = -6.0; c <= -2.4; c += 1.2) {
        createCrop(c + (Math.random() - 0.5) * 0.2, r + (Math.random() - 0.5) * 0.2, 'A');
      }
    }

    // Plant 12 crops on Team B bed
    for (let r = -1.8; r <= 1.8; r += 1.2) {
      for (let c = 2.4; c <= 6.0; c += 1.2) {
        createCrop(c + (Math.random() - 0.5) * 0.2, r + (Math.random() - 0.5) * 0.2, 'B');
      }
    }

    // Floating Dandelion Pollen & Garden Bio-Spores
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 22;
      particlePos[i + 1] = Math.random() * 7 + 0.3;
      particlePos[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x10B981,
      size: 0.14,
      transparent: true,
      opacity: 0.8,
    });
    const pollen = new THREE.Points(particleGeo, particleMat);
    scene.add(pollen);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const countA = countsRef.current.a;
      const countB = countsRef.current.b;

      // Base scale starts as cute seedling (0.5), growing up to 3.5x tall based on right answers!
      const targetScaleA = Math.min(3.6, 0.5 + countA * 0.4);
      const targetScaleB = Math.min(3.6, 0.5 + countB * 0.4);

      crops.forEach((c) => {
        const targetScale = c.team === 'A' ? targetScaleA : targetScaleB;
        const count = c.team === 'A' ? countA : countB;

        // Smooth growth transition
        c.group.scale.y += (targetScale - c.group.scale.y) * 0.06;
        const widthScale = Math.min(2.0, targetScale * 0.8);
        c.group.scale.x += (widthScale - c.group.scale.x) * 0.06;
        c.group.scale.z += (widthScale - c.group.scale.z) * 0.06;

        // Natural breeze wind sway
        const windSway = Math.sin(elapsed * 2.2 + c.baseX + c.baseZ) * 0.04;
        c.group.rotation.z = windSway;

        // Blooms develop as right answers reach 2 or more
        const bloomScale = Math.min(1.4, Math.max(0, (count - 1) * 0.4));
        c.flowerOrFruit.forEach(f => {
          f.scale.set(bloomScale, bloomScale, bloomScale);
        });
      });

      // Animated banners
      flagA.rotation.y = Math.sin(elapsed * 3) * 0.2;
      flagB.rotation.y = Math.sin(elapsed * 3 + 1) * 0.2;

      // Pollen swirl
      pollen.rotation.y = elapsed * 0.05;

      // Gentle camera breathing
      camera.position.x = Math.sin(elapsed * 0.2) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      style={{ opacity: 1 }}
    />
  );
};
