import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Nanowire3DCanvas({ aspectRatio = 28, curvature = 0.65 }) {
  const mountRef = useRef(null);
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, reqId;

    try {
      const width = mount.clientWidth || 360;
      const height = mount.clientHeight || 300;

      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLError(true);
        return;
      }

      // Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 8.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 3.5);
      dirLight1.position.set(5, 8, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.5);
      dirLight2.position.set(-5, -6, -3);
      scene.add(dirLight2);

      // Helix mesh
      const meshGroup = new THREE.Group();
      scene.add(meshGroup);

      const points = [];
      const numPoints = 60;
      const length = 1.5 + (aspectRatio / 50) * 4.0;
      const turns = 1.0 + curvature * 2.5;
      const radius = 0.35 + curvature * 0.8;

      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) - 0.5;
        const angle = t * Math.PI * 2 * turns;
        const x = Math.cos(angle) * radius;
        const y = t * length;
        const z = Math.sin(angle) * radius * 0.6;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const wireRadius = Math.max(0.04, 0.14 - (aspectRatio / 50) * 0.08);

      const tubeGeom = new THREE.TubeGeometry(curve, 70, wireRadius, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x002233,
      });

      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      meshGroup.add(tubeMesh);

      // Node spheres
      const nodeCount = 7;
      for (let n = 0; n < nodeCount; n++) {
        const tNode = n / (nodeCount - 1);
        const pt = curve.getPoint(tNode);
        const nodeGeom = new THREE.SphereGeometry(wireRadius * 1.5, 10, 10);
        const nodeMat = new THREE.MeshBasicMaterial({
          color: n % 2 === 0 ? 0x00f2fe : 0x06b6d4,
        });
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
        nodeMesh.position.copy(pt);
        meshGroup.add(nodeMesh);
      }

      // Mouse drag
      let isDragging = false;
      let prevMousePos = { x: 0, y: 0 };

      const onMouseDown = (e) => {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        meshGroup.rotation.y += deltaX * 0.01;
        meshGroup.rotation.x += deltaY * 0.01;
        prevMousePos = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      mount.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      const animate = () => {
        reqId = requestAnimationFrame(animate);
        if (!isDragging) {
          meshGroup.rotation.y += 0.012;
          meshGroup.rotation.z = Math.sin(Date.now() * 0.001) * 0.12;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(reqId);
        mount.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (mount && renderer && renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        if (tubeGeom) tubeGeom.dispose();
        if (tubeMat) tubeMat.dispose();
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL init failed, using SVG fallback:', err);
      setWebGLError(true);
    }
  }, [aspectRatio, curvature]);

  return (
    <div className="relative w-full h-[320px] rounded-2xl bg-gradient-to-b from-[#0b0f19] to-[#06080d] border border-cyan-500/25 overflow-hidden flex flex-col items-center justify-center group shadow-glow-cyan">
      
      {webGLError ? (
        // High-fidelity SVG 3D Fallback if WebGL is disabled in user browser
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <svg viewBox="0 0 320 200" className="w-full h-44 animate-pulse">
            <defs>
              <linearGradient id="svgHelix" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#00f2fe" />
              </linearGradient>
            </defs>
            <path
              d={`M 40 100 Q 80 ${100 - curvature * 60}, 120 100 T 200 100 T 280 100`}
              fill="none"
              stroke="url(#svgHelix)"
              strokeWidth={Math.max(4, 14 - (aspectRatio / 50) * 8)}
              strokeLinecap="round"
            />
            <circle cx="40" cy="100" r="6" fill="#00f2fe" />
            <circle cx="120" cy="100" r="6" fill="#06b6d4" />
            <circle cx="200" cy="100" r="6" fill="#00f2fe" />
            <circle cx="280" cy="100" r="6" fill="#06b6d4" />
          </svg>
          <div className="text-[11px] font-mono text-cyan-300">
            Curvilinear Fe-Ni-P Lattice Projection • Aspect {aspectRatio}:1
          </div>
        </div>
      ) : (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      )}

      {/* 3D Overlay Badges */}
      <div className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700 text-slate-300 flex items-center gap-1.5 backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        {webGLError ? 'Hardware Accelerated Vector Mesh' : 'Interactive 3D WebGL Nanowire'}
      </div>

      <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-950/80 border border-cyan-800 text-cyan-300 backdrop-blur-md pointer-events-none">
        {webGLError ? 'Curvilinear Chiral Helix' : 'Click & Drag to Rotate • Dynamic Chiral Nodes'}
      </div>
    </div>
  );
}
