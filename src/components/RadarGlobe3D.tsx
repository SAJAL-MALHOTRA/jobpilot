import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const RadarGlobe3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 230;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. 3D Elements Group
    const group = new THREE.Group();
    scene.add(group);

    // Core Wireframe Sphere
    const sphereRadius = 54;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 3);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // Inner glowing core
    const innerGeo = new THREE.SphereGeometry(sphereRadius * 0.85, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x111827,
      transparent: true,
      opacity: 0.75,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // Outer Constellation Particles
    const particleCount = 320;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = sphereRadius + (Math.random() * 6 - 3);

      positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi);

      if (i % 7 === 0) {
        colors[i * 3] = 0.06;
        colors[i * 3 + 1] = 0.72;
        colors[i * 3 + 2] = 0.50; // Emerald node (BLR hub)
      } else if (i % 4 === 0) {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.95; // Crisp White
      } else {
        colors[i * 3] = 0.45;
        colors[i * 3 + 1] = 0.48;
        colors[i * 3 + 2] = 0.95; // Indigo
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    group.add(particleMesh);

    // Orbital Radar Sweep Rings
    const ringGeo1 = new THREE.RingGeometry(68, 68.8, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(82, 82.6, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    group.add(ring2);

    // Startup Hub Coordinates
    const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const blrPos = latLongToVector3(12.97, 77.59, sphereRadius); // Bangalore
    const sfoPos = latLongToVector3(37.77, -122.41, sphereRadius); // San Francisco / YC
    const lonPos = latLongToVector3(51.5, -0.12, sphereRadius); // London
    const sinPos = latLongToVector3(1.35, 103.81, sphereRadius); // Singapore

    // Glowing Hub Beacons
    const createHubBeacon = (pos: THREE.Vector3, colorHex: number, size = 2.4) => {
      const geo = new THREE.SphereGeometry(size, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      group.add(mesh);
      return mesh;
    };

    const blrBeacon = createHubBeacon(blrPos, 0x10b981, 3.2); // Emerald for Bangalore
    const sfoBeacon = createHubBeacon(sfoPos, 0x6366f1, 2.8); // Indigo for Silicon Valley / YC
    const lonBeacon = createHubBeacon(lonPos, 0x38bdf8, 2.2); // Sky for London
    const sinBeacon = createHubBeacon(sinPos, 0xf59e0b, 2.2); // Amber for Singapore

    // 3D Connecting Curved Arcs (Flight / Pipeline Arcs)
    const createArc = (start: THREE.Vector3, end: THREE.Vector3, colorHex: number) => {
      // Midpoint projected outward
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      mid.normalize().multiplyScalar(sphereRadius + distance * 0.32);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(geo, mat);
      group.add(line);

      // Photon packet moving along arc
      const photonGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      group.add(photon);

      return { curve, photon, speed: 0.25 + Math.random() * 0.15, offset: Math.random() };
    };

    const arcs = [
      createArc(blrPos, sfoPos, 0x34d399), // Bangalore <-> YC
      createArc(blrPos, lonPos, 0x818cf8), // Bangalore <-> Europe
      createArc(blrPos, sinPos, 0xfbbf24), // Bangalore <-> Singapore
    ];

    // Background Floating Particles
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 500;
      starPositions[i + 1] = (Math.random() - 0.5) * 400;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.5,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.35,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 3. Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.7;
      mouseY = (y / rect.height) * 0.7;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 4. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      // Rotate 3D group gracefully with mouse parallax
      group.rotation.y = elapsed * 0.12 + targetX * 1.1;
      group.rotation.x = Math.sin(elapsed * 0.2) * 0.08 + targetY * 0.6;

      // Orbiting ring variations
      ring1.rotation.z = elapsed * 0.18;
      ring2.rotation.z = -elapsed * 0.14;

      // Pulsing Hub Beacons
      const blrScale = 1 + Math.sin(elapsed * 5) * 0.4;
      blrBeacon.scale.set(blrScale, blrScale, blrScale);

      const sfoScale = 1 + Math.cos(elapsed * 4.5) * 0.35;
      sfoBeacon.scale.set(sfoScale, sfoScale, sfoScale);

      const lonScale = 1 + Math.sin(elapsed * 4 + 1) * 0.3;
      lonBeacon.scale.set(lonScale, lonScale, lonScale);

      const sinScale = 1 + Math.cos(elapsed * 4 + 2) * 0.3;
      sinBeacon.scale.set(sinScale, sinScale, sinScale);

      // Animate photons along 3D flight arcs
      arcs.forEach((arc) => {
        const t = (elapsed * arc.speed + arc.offset) % 1;
        const pt = arc.curve.getPoint(t);
        arc.photon.position.copy(pt);
      });

      // Ambient drift
      stars.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-85 select-none"
      style={{ height: '100%', minHeight: '620px' }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default RadarGlobe3D;