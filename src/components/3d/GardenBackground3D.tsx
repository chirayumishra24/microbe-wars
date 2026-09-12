'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGame } from '@/context/GameContext';

export const GardenBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { teamACorrectCount, teamBCorrectCount, gardenInspectMode, gardenCameraPreset } = useGame();

  const countsRef = useRef({ a: teamACorrectCount, b: teamBCorrectCount });
  const inspectRef = useRef({ inspect: gardenInspectMode, preset: gardenCameraPreset });

  useEffect(() => {
    countsRef.current = { a: teamACorrectCount, b: teamBCorrectCount };
  }, [teamACorrectCount, teamBCorrectCount]);

  useEffect(() => {
    inspectRef.current = { inspect: gardenInspectMode, preset: gardenCameraPreset };
  }, [gardenInspectMode, gardenCameraPreset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // ----------------------------------------------------
    // SCENE & CINEMATIC RENDERING SETUP
    // ----------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD2EEFE); // Crisp blue morning atmosphere
    scene.fog = new THREE.FogExp2(0xD2EEFE, 0.018);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 120);
    camera.position.set(0, 4.2, 9.4);
    camera.lookAt(0, 1.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------
    // REALISTIC NATURAL SUNLIGHT & BOUNCE ILLUMINATION
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.85);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xFFF7E6, 2.2);
    sun.position.set(8, 15, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -6;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // Sky Hemisphere bounce for organic foliage underside glow
    const skyHemi = new THREE.HemisphereLight(0xBAE6FD, 0x86EFAC, 0.75);
    scene.add(skyHemi);

    // Subtle warm rim light to pop leaves against background
    const rimLight = new THREE.DirectionalLight(0xFFEDD5, 0.9);
    rimLight.position.set(-8, 6, -8);
    scene.add(rimLight);

    // ----------------------------------------------------
    // SCENIC ENVIRONMENT: ROLLING HILLS, MEADOW & CLOUDS
    // ----------------------------------------------------
    // Main Meadow Grass Ground
    const meadowGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const meadowMat = new THREE.MeshStandardMaterial({
      color: 0x72D98D,
      roughness: 0.85,
      metalness: 0.05,
    });
    const meadow = new THREE.Mesh(meadowGeo, meadowMat);
    meadow.rotation.x = -Math.PI / 2;
    meadow.position.y = 0;
    meadow.receiveShadow = true;
    scene.add(meadow);

    // Terracotta/Gravel Center Garden Path between plots
    const pathGeo = new THREE.PlaneGeometry(2.4, 25, 8, 16);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xE2D3BF,
      roughness: 0.95,
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.015, -2);
    path.receiveShadow = true;
    scene.add(path);

    // Distant Rolling Forest Hills (Adds horizon realism)
    const hillMat1 = new THREE.MeshStandardMaterial({ color: 0x4ADE80, roughness: 0.9 });
    const hillMat2 = new THREE.MeshStandardMaterial({ color: 0x22C55E, roughness: 0.95 });

    const hill1 = new THREE.Mesh(new THREE.SphereGeometry(18, 24, 16), hillMat1);
    hill1.scale.set(1.8, 0.5, 1);
    hill1.position.set(-16, -5, -24);
    scene.add(hill1);

    const hill2 = new THREE.Mesh(new THREE.SphereGeometry(22, 24, 16), hillMat2);
    hill2.scale.set(1.9, 0.6, 1);
    hill2.position.set(15, -7, -28);
    scene.add(hill2);

    // Fluffy 3D Sky Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      transparent: true,
      opacity: 0.92,
    });

    const createCloud = (x: number, y: number, z: number, s: number) => {
      const cloudGroup = new THREE.Group();
      const puffGeo = new THREE.SphereGeometry(1, 14, 12);
      const offsets = [
        [0, 0, 0, 1.2],
        [-1.1, -0.2, 0.2, 0.9],
        [1.1, -0.15, -0.2, 0.95],
        [-0.5, 0.45, 0.1, 0.8],
        [0.6, 0.4, -0.1, 0.75],
      ];
      offsets.forEach(([ox, oy, oz, sc]) => {
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set(ox, oy, oz);
        puff.scale.setScalar(sc);
        cloudGroup.add(puff);
      });
      cloudGroup.position.set(x, y, z);
      cloudGroup.scale.setScalar(s);
      scene.add(cloudGroup);
      return cloudGroup;
    };

    const clouds = [
      createCloud(-14, 11, -22, 2.2),
      createCloud(8, 12.5, -24, 2.6),
      createCloud(22, 10, -20, 2.0),
    ];

    // ----------------------------------------------------
    // REALISTIC RAISED TIMBER PLANTER BEDS WITH FURROWED SOIL
    // ----------------------------------------------------
    const woodPlankMat = new THREE.MeshStandardMaterial({
      color: 0x854D0E,
      roughness: 0.75,
      metalness: 0.08,
    });
    const woodPostMat = new THREE.MeshStandardMaterial({
      color: 0x713F12,
      roughness: 0.7,
    });
    const metalCornerMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.8,
    });

    // Rich Loamy Planting Soil with Agriculture Furrows
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x382314, // Dark humus rich topsoil
      roughness: 0.98,
      bumpScale: 0.05,
    });

    const createRaisedBed = (centerX: number, isTeamA: boolean) => {
      const bedGroup = new THREE.Group();
      bedGroup.position.set(centerX, 0, 0);

      // Furrowed soil mesh
      const soilGeo = new THREE.PlaneGeometry(6.3, 5.3, 26, 22);
      const pos = soilGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const pz = pos.getY(i); // rotated plane
        // Agriculture furrows running along Z
        const furrow = Math.sin(px * 6.0) * 0.08 + Math.cos(pz * 4.0) * 0.03;
        pos.setZ(i, furrow);
      }
      soilGeo.computeVertexNormals();

      const soil = new THREE.Mesh(soilGeo, soilMat);
      soil.rotation.x = -Math.PI / 2;
      soil.position.set(0, 0.46, 0);
      soil.receiveShadow = true;
      bedGroup.add(soil);

      // Solid Soil base block
      const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.45, 5.4), soilMat);
      baseBlock.position.set(0, 0.225, 0);
      baseBlock.receiveShadow = true;
      bedGroup.add(baseBlock);

      // Wooden Side Planks (Double-tiered timber planks)
      const plankLongGeo = new THREE.BoxGeometry(6.65, 0.24, 0.18);
      const plankShortGeo = new THREE.BoxGeometry(0.18, 0.24, 5.65);

      for (let tier = 0; tier < 2; tier++) {
        const py = 0.14 + tier * 0.24;

        // Front & Back
        const pFront = new THREE.Mesh(plankLongGeo, woodPlankMat);
        pFront.position.set(0, py, 2.75);
        pFront.castShadow = true;
        bedGroup.add(pFront);

        const pBack = new THREE.Mesh(plankLongGeo, woodPlankMat);
        pBack.position.set(0, py, -2.75);
        pBack.castShadow = true;
        bedGroup.add(pBack);

        // Sides
        const pLeft = new THREE.Mesh(plankShortGeo, woodPlankMat);
        pLeft.position.set(-3.25, py, 0);
        pLeft.castShadow = true;
        bedGroup.add(pLeft);

        const pRight = new THREE.Mesh(plankShortGeo, woodPlankMat);
        pRight.position.set(3.25, py, 0);
        pRight.castShadow = true;
        bedGroup.add(pRight);
      }

      // 4 Sturdy Corner Timber Posts with Metal Brackets
      const postGeo = new THREE.BoxGeometry(0.32, 0.62, 0.32);
      const cornerCoords = [
        [-3.25, 2.75],
        [3.25, 2.75],
        [-3.25, -2.75],
        [3.25, -2.75],
      ];
      cornerCoords.forEach(([cx, cz]) => {
        const post = new THREE.Mesh(postGeo, woodPostMat);
        post.position.set(cx, 0.31, cz);
        post.castShadow = true;
        bedGroup.add(post);

        const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.36), metalCornerMat);
        bracket.position.set(cx, 0.48, cz);
        bedGroup.add(bracket);
      });

      // Team Signpost Banner
      const poleGeo = new THREE.CylinderGeometry(0.06, 0.07, 3.8, 12);
      const poleMat = new THREE.MeshStandardMaterial({
        color: isTeamA ? 0x1E40AF : 0xC2410C,
        metalness: 0.4,
        roughness: 0.3,
      });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(0, 1.9, -2.8);
      pole.castShadow = true;
      bedGroup.add(pole);

      const flagGeo = new THREE.PlaneGeometry(1.6, 0.85);
      const flagMat = new THREE.MeshBasicMaterial({
        color: isTeamA ? 0x2563EB : 0xEA580C,
        side: THREE.DoubleSide,
      });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.position.set(isTeamA ? 0.8 : -0.8, 3.2, -2.8);
      bedGroup.add(flag);

      scene.add(bedGroup);
      return { bedGroup, flag };
    };

    const bedA = createRaisedBed(-4.5, true);
    const bedB = createRaisedBed(4.5, false);

    // ----------------------------------------------------
    // BOTANICAL LEAF & PETAL PROCEDURAL SHAPES
    // ----------------------------------------------------
    // Realistic curved sunflower leaf
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.18, 0.15, 0.28, 0.45, 0.0, 0.95);
    leafShape.bezierCurveTo(-0.28, 0.45, -0.18, 0.15, 0, 0);

    const leafExtrudeSettings = {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    };
    const sunflowerLeafGeo = new THREE.ExtrudeGeometry(leafShape, leafExtrudeSettings);
    sunflowerLeafGeo.rotateX(Math.PI / 2.6);

    // Realistic elongated corn leaf
    const cornLeafShape = new THREE.Shape();
    cornLeafShape.moveTo(0, 0);
    cornLeafShape.bezierCurveTo(0.16, 0.3, 0.22, 0.8, 0.0, 1.55);
    cornLeafShape.bezierCurveTo(-0.22, 0.8, -0.16, 0.3, 0, 0);

    const cornLeafGeo = new THREE.ExtrudeGeometry(cornLeafShape, leafExtrudeSettings);
    cornLeafGeo.rotateX(Math.PI / 2.3);

    // Golden Sunflower Petal
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.12, 0.2, 0.08, 0.52);
    petalShape.quadraticCurveTo(0, 0.62, -0.08, 0.52);
    petalShape.quadraticCurveTo(-0.12, 0.2, 0, 0);

    const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
      depth: 0.008,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    });

    // Botanical Materials
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.45 });
    const sunflowerLeafMat = new THREE.MeshStandardMaterial({
      color: 0x22C55E,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const cornLeafMat = new THREE.MeshStandardMaterial({
      color: 0x16A34A,
      roughness: 0.35,
      side: THREE.DoubleSide,
    });
    const sunflowerCenterMat = new THREE.MeshStandardMaterial({
      color: 0x451A03, // Dark textured chocolate seed head
      roughness: 0.95,
    });
    const sunflowerPetalMat = new THREE.MeshStandardMaterial({
      color: 0xFACC15, // Golden yellow petals
      roughness: 0.25,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
    const cornCobMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B, // Golden sweetcorn kernels
      roughness: 0.3,
      metalness: 0.1,
    });
    const cornHuskMat = new THREE.MeshStandardMaterial({
      color: 0x84CC16, // Fresh green husk wrapper
      roughness: 0.5,
    });
    const cornSilkMat = new THREE.MeshStandardMaterial({
      color: 0xD97706, // Brown-gold silk tassels
      roughness: 0.8,
    });

    // ----------------------------------------------------
    // CROP ENTITY GENERATOR
    // ----------------------------------------------------
    interface CropEntity {
      group: THREE.Group;
      stem: THREE.Mesh;
      leaves: THREE.Mesh[];
      flowerOrFruit: THREE.Mesh[];
      team: 'A' | 'B';
      baseX: number;
      baseZ: number;
      plantHeight: number;
    }

    const crops: CropEntity[] = [];

    const createRealisticCrop = (x: number, z: number, team: 'A' | 'B') => {
      const group = new THREE.Group();
      group.position.set(x, 0.48, z);

      const plantHeight = 1.25;

      // Realistic tapered stem with natural curve
      const stemGeo = new THREE.CylinderGeometry(0.045, 0.09, plantHeight, 10);
      stemGeo.translate(0, plantHeight / 2, 0);
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.castShadow = true;
      group.add(stem);

      const leaves: THREE.Mesh[] = [];
      const flowerOrFruit: THREE.Mesh[] = [];

      if (team === 'A') {
        // ========================================================
        // TEAM A: REALISTIC SUNFLOWER
        // ========================================================
        // Tiered pairs of broad heart-shaped leaves
        for (let i = 0; i < 6; i++) {
          const leaf = new THREE.Mesh(sunflowerLeafGeo, sunflowerLeafMat);
          leaf.position.y = 0.2 + i * 0.16;
          leaf.rotation.y = (i * Math.PI) / 2.5 + Math.PI / 4;
          const leafScale = 0.75 + (i % 3) * 0.15;
          leaf.scale.set(leafScale, leafScale, leafScale);
          leaf.castShadow = true;
          group.add(leaf);
          leaves.push(leaf);
        }

        // Realistic Sunflower Head Group
        const flowerHead = new THREE.Group();
        flowerHead.position.y = plantHeight + 0.05;
        flowerHead.rotation.x = 0.28; // Tilts face forward toward the sun/camera

        // Dark Central Seed Disc
        const center = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.22, 0.09, 20),
          sunflowerCenterMat
        );
        center.rotation.x = Math.PI / 2;
        center.castShadow = true;
        flowerHead.add(center);
        flowerOrFruit.push(center);

        // Circular ring of 18 golden radiating petals
        const petalCount = 18;
        for (let p = 0; p < petalCount; p++) {
          const petal = new THREE.Mesh(petalGeo, sunflowerPetalMat);
          const angle = (p / petalCount) * Math.PI * 2;
          petal.position.set(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0.02);
          petal.rotation.z = angle - Math.PI / 2;
          petal.rotation.x = 0.15; // gentle natural flare
          flowerHead.add(petal);
          flowerOrFruit.push(petal);
        }

        // Green Calyx / Sepals behind head
        const sepal = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.15, 8), stemMat);
        sepal.rotation.x = -Math.PI / 2;
        sepal.position.z = -0.06;
        flowerHead.add(sepal);
        flowerOrFruit.push(sepal);

        group.add(flowerHead);

      } else {
        // ========================================================
        // TEAM B: REALISTIC SWEETCORN
        // ========================================================
        // Long graceful arching corn blades attached to stem
        for (let i = 0; i < 6; i++) {
          const leaf = new THREE.Mesh(cornLeafGeo, cornLeafMat);
          leaf.position.y = 0.22 + i * 0.18;
          leaf.rotation.y = (i * Math.PI) * 0.65;
          const leafScale = 0.8 + (i % 3) * 0.2;
          leaf.scale.set(leafScale, leafScale, leafScale);
          leaf.castShadow = true;
          group.add(leaf);
          leaves.push(leaf);
        }

        // Realistic Corn Ear Group (Sprouting at mid-height)
        const earGroup = new THREE.Group();
        earGroup.position.set(0.12, 0.72, 0.05);
        earGroup.rotation.z = -0.32;

        // Golden Kernels
        const cob = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.48, 8, 14), cornCobMat);
        cob.castShadow = true;
        earGroup.add(cob);
        flowerOrFruit.push(cob);

        // Pale Green Husk Wrapper
        const husk = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.42, 6), cornHuskMat);
        husk.position.y = -0.12;
        earGroup.add(husk);
        flowerOrFruit.push(husk);

        // Brown-Gold Silk Tassels at tip
        const silk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.22, 6), cornSilkMat);
        silk.position.y = 0.32;
        earGroup.add(silk);
        flowerOrFruit.push(silk);

        group.add(earGroup);
      }

      scene.add(group);
      crops.push({ group, stem, leaves, flowerOrFruit, team, baseX: x, baseZ: z, plantHeight });
    };

    // Plant 15 structured crops in 3 neat agricultural rows on Team A (Left)
    for (let row = -1.8; row <= 1.8; row += 0.9) {
      for (let col = -6.2; col <= -2.8; col += 1.1) {
        createRealisticCrop(col + (Math.random() - 0.5) * 0.15, row + (Math.random() - 0.5) * 0.15, 'A');
      }
    }

    // Plant 15 structured crops in 3 neat agricultural rows on Team B (Right)
    for (let row = -1.8; row <= 1.8; row += 0.9) {
      for (let col = 2.8; col <= 6.2; col += 1.1) {
        createRealisticCrop(col + (Math.random() - 0.5) * 0.15, row + (Math.random() - 0.5) * 0.15, 'B');
      }
    }

    // ----------------------------------------------------
    // GLOWING BIO-SPORES & GARDEN POLLEN PARTICLES
    // ----------------------------------------------------
    const particleCount = 110;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 24;
      particlePos[i + 1] = Math.random() * 8 + 0.4;
      particlePos[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34D399,
      size: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    const pollen = new THREE.Points(particleGeo, particleMat);
    scene.add(pollen);

    // ----------------------------------------------------
    // ANIMATION LOOP WITH NATURAL ORGANIC BREEZE
    // ----------------------------------------------------
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const countA = countsRef.current.a;
      const countB = countsRef.current.b;

      // Realistic Growth Progression:
      // Starts as healthy young shoot (scale 0.55), flourishing up to 3.4x height with full blooms
      const targetScaleA = Math.min(3.4, 0.55 + countA * 0.42);
      const targetScaleB = Math.min(3.4, 0.55 + countB * 0.42);

      crops.forEach((c) => {
        const targetScale = c.team === 'A' ? targetScaleA : targetScaleB;
        const count = c.team === 'A' ? countA : countB;

        // Smooth organic growth interpolation
        c.group.scale.y += (targetScale - c.group.scale.y) * 0.055;
        const widthScale = Math.min(2.1, 0.65 + count * 0.28);
        c.group.scale.x += (widthScale - c.group.scale.x) * 0.055;
        c.group.scale.z += (widthScale - c.group.scale.z) * 0.055;

        // Multi-frequency wind sway (gentle breeze through garden)
        const primaryWind = Math.sin(elapsed * 2.0 + c.baseX * 0.8 + c.baseZ * 0.5) * 0.035;
        const microBreeze = Math.cos(elapsed * 3.8 + c.baseX) * 0.015;
        c.group.rotation.z = primaryWind + microBreeze;
        c.group.rotation.x = Math.sin(elapsed * 1.5 + c.baseZ) * 0.015;

        // Flower blooms and corn ears mature as score increases
        const bloomScale = Math.min(1.35, Math.max(0, (count - 0.8) * 0.45));
        c.flowerOrFruit.forEach((f) => {
          f.scale.set(bloomScale, bloomScale, bloomScale);
        });
      });

      // Banners wave in the wind
      bedA.flag.rotation.y = Math.sin(elapsed * 2.8) * 0.22;
      bedB.flag.rotation.y = Math.sin(elapsed * 2.8 + 1.2) * 0.22;

      // Drifting clouds across the sky
      clouds.forEach((cloud, idx) => {
        cloud.position.x += 0.006 * (idx + 1);
        if (cloud.position.x > 26) cloud.position.x = -26;
      });

      // Pollen swirl
      pollen.rotation.y = elapsed * 0.04;

      // Camera presets for touch inspection
      const presets = {
        standard: { pos: new THREE.Vector3(0, 4.2, 9.4), look: new THREE.Vector3(0, 1.3, 0) },
        cinematic: { pos: new THREE.Vector3(0, 3.0, 7.8), look: new THREE.Vector3(0, 1.4, 0) },
        teamA: { pos: new THREE.Vector3(-4.4, 2.6, 5.2), look: new THREE.Vector3(-4.5, 1.4, 0) },
        teamB: { pos: new THREE.Vector3(4.4, 2.6, 5.2), look: new THREE.Vector3(4.5, 1.4, 0) },
      };

      let isPointerDown = false;
      let prevPointerX = 0;
      let prevPointerY = 0;
      const orbitOffset = { x: 0, y: 0 };

      const onPointerDown = (e: MouseEvent | TouchEvent) => {
        if (!inspectRef.current.inspect) return;
        isPointerDown = true;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        prevPointerX = clientX;
        prevPointerY = clientY;
      };

      const onPointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isPointerDown || !inspectRef.current.inspect) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const dx = clientX - prevPointerX;
        const dy = clientY - prevPointerY;
        orbitOffset.x = Math.max(-1.8, Math.min(1.8, orbitOffset.x + dx * 0.005));
        orbitOffset.y = Math.max(-0.6, Math.min(0.8, orbitOffset.y - dy * 0.005));
        prevPointerX = clientX;
        prevPointerY = clientY;
      };

      const onPointerUp = () => {
        isPointerDown = false;
      };

      container.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      container.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);

      // Camera lerp target vector
      const currentLookAt = new THREE.Vector3(0, 1.3, 0);

      // Soft cinematic camera motion
      const currentPreset = inspectRef.current.preset;
      const targetPreset = presets[currentPreset] || presets.standard;
      const targetPos = targetPreset.pos.clone();
      const targetLook = targetPreset.look.clone();

      if (inspectRef.current.inspect) {
        targetPos.x += orbitOffset.x * 2.8;
        targetPos.y += orbitOffset.y * 1.5;
        targetLook.x += orbitOffset.x;
      } else {
        targetPos.x += Math.sin(elapsed * 0.18) * 0.35;
        orbitOffset.x *= 0.95;
        orbitOffset.y *= 0.95;
      }

      camera.position.lerp(targetPos, 0.05);
      currentLookAt.lerp(targetLook, 0.05);
      camera.lookAt(currentLookAt);

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
      className={`fixed inset-0 overflow-hidden transition-all duration-500 ${
        gardenInspectMode
          ? 'pointer-events-auto z-20 cursor-grab active:cursor-grabbing'
          : 'pointer-events-none -z-10'
      }`}
      style={{ opacity: 1 }}
    />
  );
};
