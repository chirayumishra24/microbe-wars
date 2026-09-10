'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface MicrobeSceneProps {
  type?: 'bacteria' | 'fungi' | 'algae' | 'amoeba' | 'virus' | 'protozoa';
  color?: string;
  className?: string;
}

export const MicrobeScene: React.FC<MicrobeSceneProps> = ({
  type = 'bacteria',
  color,
  className = 'w-full h-48 sm:h-64'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Normalize type
  const organismType = type === 'protozoa' ? 'amoeba' : type;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Dynamic Microbe Group
    const microbeGroup = new THREE.Group();
    scene.add(microbeGroup);

    // --- LIGHTING (Microscope Illumination) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Condenser Light (Bottom-up bright focal light simulating microscope lamp)
    const condenserLight = new THREE.DirectionalLight(0xecfeff, 1.2);
    condenserLight.position.set(0, -4, 2);
    scene.add(condenserLight);

    // Top Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Rim Backlight (Highlighting translucent edges)
    const rimLight = new THREE.PointLight(0x38bdf8, 2.2, 12);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // --- SPECIMEN BUILDERS ---
    const cleanupCallbacks: (() => void)[] = [];
    const animators: ((time: number) => void)[] = [];

    // Helper material
    const baseColor = color || (
      organismType === 'bacteria' ? '#10B981' :
      organismType === 'fungi' ? '#F59E0B' :
      organismType === 'algae' ? '#059669' :
      organismType === 'amoeba' ? '#38BDF8' : '#8B5CF6'
    );

    if (organismType === 'bacteria') {
      // ===== REALISTIC BACTERIA (Rod-shaped Bacillus with Capsule, Nucleoid, Pili & Flagella) =====
      
      // 1. Translucent Outer Capsule & Peptidoglycan Wall
      const capsuleGeo = new THREE.CapsuleGeometry(0.72, 1.35, 32, 48);
      const capsuleMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(baseColor),
        roughness: 0.25,
        transmission: 0.45,
        thickness: 0.7,
        transparent: true,
        opacity: 0.88,
        clearcoat: 0.6,
        clearcoatRoughness: 0.15,
      });
      const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
      microbeGroup.add(capsuleMesh);

      // 2. Inner Plasma Membrane
      const innerGeo = new THREE.CapsuleGeometry(0.66, 1.25, 24, 32);
      const innerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#34D399'),
        roughness: 0.4,
        transparent: true,
        opacity: 0.35,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      microbeGroup.add(innerMesh);

      // 3. Central Nucleoid DNA (Folded circular chromatin knot)
      const dnaGeo = new THREE.TorusKnotGeometry(0.24, 0.065, 80, 16, 2, 3);
      const dnaMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#67E8F9'),
        emissive: new THREE.Color('#0891B2'),
        emissiveIntensity: 0.7,
        roughness: 0.3,
      });
      const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
      microbeGroup.add(dnaMesh);

      // 4. Ribosomes (Granules drifting inside)
      const riboGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const riboMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 });
      const riboGroup = new THREE.Group();
      for (let i = 0; i < 20; i++) {
        const m = new THREE.Mesh(riboGeo, riboMat);
        m.position.set(
          (Math.random() - 0.5) * 0.7,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 0.7
        );
        riboGroup.add(m);
      }
      microbeGroup.add(riboGroup);

      // 5. Pili / Fimbriae (Fine micro-hairs anchored to capsule)
      const piliGroup = new THREE.Group();
      const piliGeo = new THREE.CylinderGeometry(0.008, 0.004, 0.22, 6);
      const piliMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.85 });
      for (let i = 0; i < 36; i++) {
        const theta = (i / 36) * Math.PI * 2;
        const yPos = (Math.random() - 0.5) * 1.4;
        const pili = new THREE.Mesh(piliGeo, piliMat);
        pili.position.set(Math.cos(theta) * 0.73, yPos, Math.sin(theta) * 0.73);
        pili.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)));
        piliGroup.add(pili);
      }
      microbeGroup.add(piliGroup);

      // 6. Active Undulating Whiplike Flagella
      const flagellaPoints = [
        new THREE.Vector3(0, -1.3, 0),
        new THREE.Vector3(0.2, -1.7, 0.1),
        new THREE.Vector3(-0.15, -2.1, -0.1),
        new THREE.Vector3(0.25, -2.5, 0.15),
        new THREE.Vector3(0, -2.9, 0),
      ];
      const flagellaCurve = new THREE.CatmullRomCurve3(flagellaPoints);
      const flagellaGeo = new THREE.TubeGeometry(flagellaCurve, 32, 0.032, 8, false);
      const flagellaMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.3,
        emissive: 0x065f46,
        emissiveIntensity: 0.4
      });
      const flagellaMesh = new THREE.Mesh(flagellaGeo, flagellaMat);
      microbeGroup.add(flagellaMesh);

      // Secondary thinner flagellum
      const flagella2Points = [
        new THREE.Vector3(-0.15, -1.3, 0.1),
        new THREE.Vector3(-0.35, -1.65, -0.15),
        new THREE.Vector3(0.1, -2.0, 0.15),
        new THREE.Vector3(-0.2, -2.4, -0.1),
        new THREE.Vector3(0, -2.75, 0),
      ];
      const flagella2Curve = new THREE.CatmullRomCurve3(flagella2Points);
      const flagella2Geo = new THREE.TubeGeometry(flagella2Curve, 28, 0.024, 6, false);
      const flagella2Mesh = new THREE.Mesh(flagella2Geo, flagellaMat);
      microbeGroup.add(flagella2Mesh);

      animators.push((time) => {
        // Dynamic flagellar wave propagation
        for (let i = 1; i < flagellaPoints.length; i++) {
          const tOffset = time * 8 + i * 0.9;
          flagellaPoints[i].x = Math.sin(tOffset) * (0.18 + i * 0.06);
          flagellaPoints[i].z = Math.cos(tOffset) * (0.15 + i * 0.05);

          flagella2Points[i].x = Math.cos(tOffset + 1.2) * (0.16 + i * 0.05);
          flagella2Points[i].z = Math.sin(tOffset + 1.2) * (0.14 + i * 0.04);
        }
        flagellaMesh.geometry.dispose();
        flagellaMesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(flagellaPoints), 32, 0.032, 8, false);

        flagella2Mesh.geometry.dispose();
        flagella2Mesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(flagella2Points), 28, 0.024, 6, false);

        dnaMesh.rotation.y = time * 0.8;
        dnaMesh.rotation.z = time * 0.4;
      });

    } else if (organismType === 'fungi') {
      // ===== REALISTIC FUNGI (Yeast with Mother Cell, Bud Scar, Daughter Bud & Vacuole) =====

      // 1. Mother Cell (Velvety chitin spherical ovoid)
      const motherGeo = new THREE.SphereGeometry(1.05, 36, 36);
      motherGeo.scale(1.0, 1.15, 0.98);
      const motherMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(baseColor),
        roughness: 0.38,
        metalness: 0.05,
        transmission: 0.25,
        transparent: true,
        opacity: 0.92,
        clearcoat: 0.3,
      });
      const motherMesh = new THREE.Mesh(motherGeo, motherMat);
      microbeGroup.add(motherMesh);

      // 2. Growing Daughter Bud
      const daughterGeo = new THREE.SphereGeometry(0.55, 30, 30);
      daughterGeo.scale(0.95, 1.08, 0.95);
      const daughterMesh = new THREE.Mesh(daughterGeo, motherMat);
      daughterMesh.position.set(0.72, 0.82, 0.1);
      daughterMesh.rotation.z = -0.4;
      microbeGroup.add(daughterMesh);

      // 3. Bud Scar Collar Ring (detachment mark on mother cell)
      const scarGeo = new THREE.TorusGeometry(0.24, 0.055, 16, 32);
      const scarMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.6,
        metalness: 0.1,
      });
      const scarMesh = new THREE.Mesh(scarGeo, scarMat);
      scarMesh.position.set(-0.62, -0.48, 0.65);
      scarMesh.lookAt(new THREE.Vector3(-1.5, -1.2, 1.5));
      microbeGroup.add(scarMesh);

      // 4. Eukaryotic Nucleus with Dark Nucleolus
      const nucleusGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        emissive: 0x78350f,
        emissiveIntensity: 0.4,
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.position.set(-0.15, -0.1, 0.1);
      microbeGroup.add(nucleusMesh);

      // 5. Large Fluid Storage Vacuole (Translucent sphere)
      const vacuoleGeo = new THREE.SphereGeometry(0.42, 28, 28);
      const vacuoleMat = new THREE.MeshPhysicalMaterial({
        color: 0xbae6fd,
        transmission: 0.7,
        roughness: 0.1,
        transparent: true,
        opacity: 0.65,
      });
      const vacuoleMesh = new THREE.Mesh(vacuoleGeo, vacuoleMat);
      vacuoleMesh.position.set(0.18, 0.28, -0.15);
      microbeGroup.add(vacuoleMesh);

      // 6. Mitochondria (Bean shapes)
      const mitoGeo = new THREE.CapsuleGeometry(0.08, 0.18, 12, 16);
      const mitoMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
      const mito1 = new THREE.Mesh(mitoGeo, mitoMat);
      mito1.position.set(-0.45, 0.4, 0.3);
      mito1.rotation.set(0.6, 0.8, 0.2);
      microbeGroup.add(mito1);

      const mito2 = new THREE.Mesh(mitoGeo, mitoMat);
      mito2.position.set(0.35, -0.45, 0.25);
      mito2.rotation.set(-0.5, 0.4, 1.1);
      microbeGroup.add(mito2);

      animators.push((time) => {
        // Gentle budding breathing pulse
        const budScale = 1 + Math.sin(time * 2.5) * 0.04;
        daughterMesh.scale.set(0.95 * budScale, 1.08 * budScale, 0.95 * budScale);
      });

    } else if (organismType === 'algae') {
      // ===== REALISTIC ALGAE (Chlamydomonas with Cup Chloroplast, Eyespot & Dual Flagella) =====

      // 1. Translucent Ovoid Cell Body
      const bodyGeo = new THREE.SphereGeometry(1.1, 36, 36);
      bodyGeo.scale(0.95, 1.18, 0.95);
      const bodyMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(baseColor),
        roughness: 0.22,
        transmission: 0.35,
        transparent: true,
        opacity: 0.90,
        clearcoat: 0.5,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      microbeGroup.add(bodyMesh);

      // 2. Massive Emerald Cup-shaped Chloroplast
      const chloroGeo = new THREE.SphereGeometry(0.98, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.68);
      const chloroMat = new THREE.MeshStandardMaterial({
        color: 0x059669,
        roughness: 0.35,
        side: THREE.DoubleSide,
        emissive: 0x047857,
        emissiveIntensity: 0.25,
      });
      const chloroMesh = new THREE.Mesh(chloroGeo, chloroMat);
      chloroMesh.rotation.x = Math.PI;
      chloroMesh.position.y = -0.15;
      microbeGroup.add(chloroMesh);

      // 3. Central Pyrenoid Core (Starch synthesis hub)
      const pyrenoidGeo = new THREE.SphereGeometry(0.36, 24, 24);
      const pyrenoidMat = new THREE.MeshStandardMaterial({
        color: 0xa7f3d0,
        emissive: 0x10b981,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });
      const pyrenoidMesh = new THREE.Mesh(pyrenoidGeo, pyrenoidMat);
      pyrenoidMesh.position.set(0, -0.4, 0);
      microbeGroup.add(pyrenoidMesh);

      // 4. Stigma / Eyespot (Ruby-red photoreceptor steering toward light)
      const eyespotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const eyespotMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const eyespotMesh = new THREE.Mesh(eyespotGeo, eyespotMat);
      eyespotMesh.position.set(0.72, 0.45, 0.42);
      microbeGroup.add(eyespotMesh);

      // 5. Dual Whipping Anterior Flagella
      const flagellaMat = new THREE.MeshStandardMaterial({
        color: 0x34d399,
        roughness: 0.2,
      });

      const ptsL = [
        new THREE.Vector3(-0.1, 1.25, 0),
        new THREE.Vector3(-0.4, 1.65, 0.1),
        new THREE.Vector3(-0.8, 2.05, -0.1),
        new THREE.Vector3(-1.2, 2.4, 0.15),
      ];
      const ptsR = [
        new THREE.Vector3(0.1, 1.25, 0),
        new THREE.Vector3(0.4, 1.65, -0.1),
        new THREE.Vector3(0.8, 2.05, 0.1),
        new THREE.Vector3(1.2, 2.4, -0.15),
      ];

      const flagellaL = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsL), 24, 0.028, 6, false), flagellaMat);
      const flagellaR = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsR), 24, 0.028, 6, false), flagellaMat);
      microbeGroup.add(flagellaL);
      microbeGroup.add(flagellaR);

      animators.push((time) => {
        // Synchronous breaststroke flagellar beat
        const beat = Math.sin(time * 9);
        const beatCos = Math.cos(time * 9);

        ptsL[1].x = -0.4 + beat * 0.15;
        ptsL[2].x = -0.8 + beat * 0.3;
        ptsL[3].x = -1.2 + beat * 0.45;
        ptsL[3].z = beatCos * 0.25;

        ptsR[1].x = 0.4 - beat * 0.15;
        ptsR[2].x = 0.8 - beat * 0.3;
        ptsR[3].x = 1.2 - beat * 0.45;
        ptsR[3].z = -beatCos * 0.25;

        flagellaL.geometry.dispose();
        flagellaL.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsL), 24, 0.028, 6, false);

        flagellaR.geometry.dispose();
        flagellaR.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsR), 24, 0.028, 6, false);
      });

    } else if (organismType === 'amoeba') {
      // ===== REALISTIC AMOEBA (Dynamic Flowing Pseudopodia, Contractile Vacuole, Food Vesicles) =====

      // 1. Organic Deforming Protoplasm Body
      const amoebaGeo = new THREE.IcosahedronGeometry(1.15, 4);
      const posAttr = amoebaGeo.attributes.position;
      const vertexCount = posAttr.count;
      const baseVertices: THREE.Vector3[] = [];
      for (let i = 0; i < vertexCount; i++) {
        baseVertices.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
      }

      const amoebaMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(baseColor),
        roughness: 0.15,
        transmission: 0.6,
        transparent: true,
        opacity: 0.82,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
      });
      const amoebaMesh = new THREE.Mesh(amoebaGeo, amoebaMat);
      microbeGroup.add(amoebaMesh);

      // 2. Eukaryotic Disc Nucleus
      const nucGeo = new THREE.SphereGeometry(0.36, 24, 24);
      nucGeo.scale(1.0, 0.65, 1.0);
      const nucMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        emissive: 0x1e40af,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      });
      const nucMesh = new THREE.Mesh(nucGeo, nucMat);
      nucMesh.position.set(-0.2, 0.1, 0.15);
      microbeGroup.add(nucMesh);

      // 3. Contractile Vacuole (Pulsing water pump)
      const cVacGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const cVacMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        transmission: 0.85,
        roughness: 0.05,
        transparent: true,
        opacity: 0.7,
      });
      const cVacMesh = new THREE.Mesh(cVacGeo, cVacMat);
      cVacMesh.position.set(0.35, -0.25, -0.15);
      microbeGroup.add(cVacMesh);

      // 4. Food Vacuoles (Ingested green algae/bacteria morsels)
      const foodMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
      const foodMat2 = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
      const fVac1 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), foodMat1);
      fVac1.position.set(0.4, 0.35, 0.2);
      microbeGroup.add(fVac1);
      const fVac2 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), foodMat2);
      fVac2.position.set(-0.35, -0.35, 0.3);
      microbeGroup.add(fVac2);

      animators.push((time) => {
        // Continuous organic pseudopodia deformation
        const pos = amoebaGeo.attributes.position;
        for (let i = 0; i < vertexCount; i++) {
          const bv = baseVertices[i];
          const lobe1 = Math.sin(bv.x * 2.2 + time * 1.5) * Math.cos(bv.y * 2.2 + time * 1.2);
          const lobe2 = Math.cos(bv.z * 2.5 + time * 1.8) * Math.sin(bv.y * 2.5 + time * 1.3);
          const lobe3 = Math.sin(bv.x * 3.2 + bv.z * 3.2 + time * 2.1) * 0.4;
          const factor = 1 + (lobe1 * 0.22 + lobe2 * 0.18 + lobe3 * 0.1);

          pos.setXYZ(i, bv.x * factor, bv.y * factor, bv.z * factor);
        }
        pos.needsUpdate = true;
        amoebaGeo.computeVertexNormals();

        // Contractile vacuole diastole/systole cycle (slow expansion, quick collapse)
        const cycle = (time * 0.8) % 1;
        const vacScale = cycle < 0.85 ? 0.3 + (cycle / 0.85) * 0.9 : Math.max(0.2, 1.2 - (cycle - 0.85) * 6);
        cVacMesh.scale.set(vacScale, vacScale, vacScale);
      });

    } else {
      // ===== REALISTIC BACTERIOPHAGE VIRUS (Icosahedral Head, Collar, Sheath, Base Plate, Leg Fibers) =====

      // 1. Icosahedral Protein Capsid Head
      const headGeo = new THREE.IcosahedronGeometry(0.72, 0);
      const headMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(baseColor),
        roughness: 0.25,
        metalness: 0.35,
        flatShading: true,
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.y = 1.0;
      microbeGroup.add(headMesh);

      // DNA core inside the capsid
      const coreGeo = new THREE.DodecahedronGeometry(0.48, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xc4b5fd,
        wireframe: true,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 1.0;
      microbeGroup.add(coreMesh);

      // 2. Collar Swivel Ring
      const collarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16);
      const collarMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.3 });
      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.position.y = 0.25;
      microbeGroup.add(collarMesh);

      // 3. Contractile Sheath (Tail cylinder)
      const sheathGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);
      const sheathMat = new THREE.MeshStandardMaterial({
        color: 0x6d28d9,
        roughness: 0.4,
        metalness: 0.2,
      });
      const sheathMesh = new THREE.Mesh(sheathGeo, sheathMat);
      sheathMesh.position.y = -0.22;
      microbeGroup.add(sheathMesh);

      // Sheath ring stripes
      for (let i = 0; i < 5; i++) {
        const ringGeo = new THREE.TorusGeometry(0.13, 0.02, 8, 16);
        const ringMesh = new THREE.Mesh(ringGeo, collarMat);
        ringMesh.position.y = -0.55 + i * 0.16;
        ringMesh.rotation.x = Math.PI / 2;
        microbeGroup.add(ringMesh);
      }

      // 4. Base Plate
      const baseplateGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 6);
      const baseplateMat = new THREE.MeshStandardMaterial({ color: 0x5b21b6, roughness: 0.2 });
      const baseplateMesh = new THREE.Mesh(baseplateGeo, baseplateMat);
      baseplateMesh.position.y = -0.7;
      microbeGroup.add(baseplateMesh);

      // 5. 6 Articulated Spider Tail Fibers
      const fiberMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, roughness: 0.3 });
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const fiberGroup = new THREE.Group();
        fiberGroup.position.set(Math.cos(angle) * 0.26, -0.7, Math.sin(angle) * 0.26);

        // Upper segment
        const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 6), fiberMat);
        seg1.position.set(Math.cos(angle) * 0.2, -0.15, Math.sin(angle) * 0.2);
        seg1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(angle) * 0.6, -0.6, Math.sin(angle) * 0.6).normalize());
        fiberGroup.add(seg1);

        // Lower segment
        const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 0.55, 6), fiberMat);
        seg2.position.set(Math.cos(angle) * 0.45, -0.52, Math.sin(angle) * 0.45);
        seg2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.cos(angle) * 0.3, -0.9, Math.sin(angle) * 0.3).normalize());
        fiberGroup.add(seg2);

        microbeGroup.add(fiberGroup);
      }

      animators.push((time) => {
        coreMesh.rotation.x = time * 0.5;
        coreMesh.rotation.y = time * 0.7;
      });
    }

    // --- MICROSCOPE DEBRIS / BROWNIAN PARTICLES ---
    const debrisCount = 35;
    const debrisGeo = new THREE.BufferGeometry();
    const debrisPos = new Float32Array(debrisCount * 3);
    for (let i = 0; i < debrisCount * 3; i += 3) {
      debrisPos[i] = (Math.random() - 0.5) * 5.5;
      debrisPos[i + 1] = (Math.random() - 0.5) * 5.5;
      debrisPos[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    debrisGeo.setAttribute('position', new THREE.BufferAttribute(debrisPos, 3));
    const debrisMat = new THREE.PointsMaterial({
      color: new THREE.Color(baseColor),
      size: 0.065,
      transparent: true,
      opacity: 0.45,
    });
    const debrisPoints = new THREE.Points(debrisGeo, debrisMat);
    scene.add(debrisPoints);

    // --- INTERACTIVE MOUSE / TOUCH ROTATION ---
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let rotVelX = 0;
    let rotVelY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
      rotVelX = 0;
      rotVelY = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevPointerX;
      const deltaY = clientY - prevPointerY;

      rotVelY = deltaX * 0.008;
      rotVelX = deltaY * 0.008;

      microbeGroup.rotation.y += rotVelY;
      microbeGroup.rotation.x += rotVelX;

      prevPointerX = clientX;
      prevPointerY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- RENDER LOOP ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Run organism animators
      animators.forEach(fn => fn(elapsedTime));

      // Rotation inertia & gentle auto-drift
      if (!isDragging) {
        microbeGroup.rotation.y += rotVelY + 0.006;
        microbeGroup.rotation.x += rotVelX;
        rotVelX *= 0.94;
        rotVelY *= 0.94;
      }

      // Brownian drift for background specks
      debrisPoints.rotation.y = elapsedTime * 0.04;
      debrisPoints.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      cancelAnimationFrame(reqId);
      cleanupCallbacks.forEach(fn => fn());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [organismType, color]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none group">
      <div
        ref={containerRef}
        className={`relative w-full h-full cursor-grab active:cursor-grabbing ${className}`}
      />
      {/* 3D Micro-interaction badge */}
      <div className={`absolute bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs border border-white/20 text-[10px] font-bold text-cyan-200 pointer-events-none transition-opacity duration-300 ${isInteracting ? 'opacity-90' : 'opacity-60 group-hover:opacity-100'}`}>
        👆 Drag to rotate 3D specimen
      </div>
    </div>
  );
};
