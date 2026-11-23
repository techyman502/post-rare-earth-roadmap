import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function RightStageCanvas({ activeStage = 1 }) {
  const mountRef = useRef(null);
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer, reqId;

    try {
      const width = mount.clientWidth || 600;
      const height = mount.clientHeight || 700;

      // WebGL capability check
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLError(true);
        return;
      }

      // Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 7.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);

      // Ambient & Directional Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const light1 = new THREE.DirectionalLight(0x00f2fe, 3.5);
      light1.position.set(5, 8, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xec4899, 2.5);
      light2.position.set(-5, -6, -3);
      scene.add(light2);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // ==========================================
      // STAGE 1: ELECTRIC MOTOR ROTOR (EESM / SynRM)
      // ==========================================
      const stage1Group = new THREE.Group();
      rootGroup.add(stage1Group);

      // Rotor core cylinder
      const rotorGeom = new THREE.CylinderGeometry(1.6, 1.6, 2.8, 32);
      const rotorMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.25,
      });
      const rotorCore = new THREE.Mesh(rotorGeom, rotorMat);
      stage1Group.add(rotorCore);

      // Drive shaft
      const shaftGeom = new THREE.CylinderGeometry(0.35, 0.35, 4.4, 24);
      const shaftMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.95,
        roughness: 0.1,
      });
      const shaft = new THREE.Mesh(shaftGeom, shaftMat);
      stage1Group.add(shaft);

      // Copper rotor bar windings / flux slots
      const barCount = 12;
      for (let b = 0; b < barCount; b++) {
        const theta = (b / barCount) * Math.PI * 2;
        const barGeom = new THREE.BoxGeometry(0.2, 2.9, 0.2);
        const barMat = new THREE.MeshStandardMaterial({
          color: b % 2 === 0 ? 0x00f2fe : 0x10b981,
          metalness: 0.8,
          roughness: 0.2,
          emissive: b % 2 === 0 ? 0x002233 : 0x002211,
        });
        const bar = new THREE.Mesh(barGeom, barMat);
        bar.position.set(Math.cos(theta) * 1.65, 0, Math.sin(theta) * 1.65);
        bar.rotation.y = -theta;
        stage1Group.add(bar);
      }

      // Orbiting stator flux ring
      const ringGeom = new THREE.TorusGeometry(2.3, 0.05, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      stage1Group.add(ring);

      // ==========================================
      // STAGE 2: WARNING CRYSTAL (Tetrataenite)
      // ==========================================
      const stage2Group = new THREE.Group();
      rootGroup.add(stage2Group);

      const crystalGeom = new THREE.OctahedronGeometry(2.0, 1);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0xf43f5e,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: true,
        emissive: 0x330011,
      });
      const crystal = new THREE.Mesh(crystalGeom, crystalMat);
      stage2Group.add(crystal);

      // Inner dense nucleus (the false ordered phase)
      const innerGeom = new THREE.IcosahedronGeometry(1.0, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.1,
      });
      const innerNucleus = new THREE.Mesh(innerGeom, innerMat);
      stage2Group.add(innerNucleus);

      // Defect clouds (Phosphorus contamination particles)
      const defectCount = 30;
      for (let d = 0; d < defectCount; d++) {
        const dGeom = new THREE.SphereGeometry(0.06, 8, 8);
        const dMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
        const dMesh = new THREE.Mesh(dGeom, dMat);
        const radius = 2.4 + Math.random() * 0.8;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI;
        dMesh.position.set(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi),
          radius * Math.sin(theta) * Math.cos(phi)
        );
        stage2Group.add(dMesh);
      }

      // ==========================================
      // STAGE 3: CURVED NANOWIRE HELIX (Shape Anisotropy)
      // ==========================================
      const stage3Group = new THREE.Group();
      rootGroup.add(stage3Group);

      const wirePoints = [];
      const numPts = 60;
      for (let i = 0; i <= numPts; i++) {
        const t = (i / numPts) - 0.5;
        const angle = t * Math.PI * 2 * 3.0;
        const x = Math.cos(angle) * 1.0;
        const y = t * 4.2;
        const z = Math.sin(angle) * 0.7;
        wirePoints.push(new THREE.Vector3(x, y, z));
      }
      const wireCurve = new THREE.CatmullRomCurve3(wirePoints);
      const wireTubeGeom = new THREE.TubeGeometry(wireCurve, 70, 0.12, 12, false);
      const wireTubeMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x002233,
      });
      const wireMesh = new THREE.Mesh(wireTubeGeom, wireTubeMat);
      stage3Group.add(wireMesh);

      // Pinning nodes
      for (let n = 0; n < 8; n++) {
        const tNode = n / 7;
        const pt = wireCurve.getPoint(tNode);
        const nodeG = new THREE.SphereGeometry(0.2, 10, 10);
        const nodeM = new THREE.MeshBasicMaterial({ color: n % 2 === 0 ? 0x00f2fe : 0x818cf8 });
        const nodeObj = new THREE.Mesh(nodeG, nodeM);
        nodeObj.position.copy(pt);
        stage3Group.add(nodeObj);
      }

      // ==========================================
      // STAGE 4: SUPERCONDUCTING COIL (MgB₂)
      // ==========================================
      const stage4Group = new THREE.Group();
      rootGroup.add(stage4Group);

      // Toroidal cryo-coil
      const coilGeom = new THREE.TorusGeometry(1.8, 0.45, 24, 64);
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.95,
        roughness: 0.15,
        emissive: 0x220044,
      });
      const coil = new THREE.Mesh(coilGeom, coilMat);
      stage4Group.add(coil);

      // Inner Meissner magnetic vortex
      const vortexGeom = new THREE.CylinderGeometry(0.6, 0.6, 3.2, 24, 1, true);
      const vortexMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const vortex = new THREE.Mesh(vortexGeom, vortexMat);
      stage4Group.add(vortex);

      // Cryogenic shield rings
      const shield1 = new THREE.TorusGeometry(2.5, 0.04, 12, 48);
      const shieldMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
      const shieldMesh1 = new THREE.Mesh(shield1, shieldMat);
      shieldMesh1.rotation.x = Math.PI / 3;
      stage4Group.add(shieldMesh1);

      // ==========================================
      // STAGE 5: ALTERMAGNETIC SPIN LATTICE
      // ==========================================
      const stage5Group = new THREE.Group();
      rootGroup.add(stage5Group);

      const latticeRows = 3;
      const latticeCols = 3;
      const latticeLevels = 3;
      const spacing = 1.0;

      for (let lx = -1; lx <= 1; lx++) {
        for (let ly = -1; ly <= 1; ly++) {
          for (let lz = -1; lz <= 1; lz++) {
            const isSpinUp = (lx + ly + lz) % 2 === 0;
            const nodeG = new THREE.SphereGeometry(0.12, 8, 8);
            const nodeM = new THREE.MeshBasicMaterial({
              color: isSpinUp ? 0xec4899 : 0x00f2fe,
            });
            const node = new THREE.Mesh(nodeG, nodeM);
            node.position.set(lx * spacing, ly * spacing, lz * spacing);
            stage5Group.add(node);

            // Spin vector arrows (Antiparallel d-wave alignment)
            const arrowDir = isSpinUp ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, -1, 0);
            const arrowColor = isSpinUp ? 0xec4899 : 0x00f2fe;
            const arrow = new THREE.ArrowHelper(arrowDir, node.position, 0.45, arrowColor, 0.18, 0.08);
            stage5Group.add(arrow);
          }
        }
      }

      // Drag interaction
      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };

      const onMouseDown = (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rootGroup.rotation.y += dx * 0.008;
        rootGroup.rotation.x += dy * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      };
      const onMouseUp = () => (isDragging = false);

      mount.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Handle window resize
      const handleResize = () => {
        if (!mount) return;
        const nw = mount.clientWidth;
        const nh = mount.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop
      const stageGroups = [stage1Group, stage2Group, stage3Group, stage4Group, stage5Group];

      const animate = () => {
        reqId = requestAnimationFrame(animate);

        // Auto spin current active stage
        if (!isDragging) {
          rootGroup.rotation.y += 0.008;
          rootGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.15;
        }

        // Rotor specific spin
        rotorCore.rotation.y += 0.02;
        shaft.rotation.y += 0.02;

        // Crystal pulse
        crystal.rotation.y += 0.015;
        innerNucleus.rotation.z -= 0.01;

        // Coil tilt
        coil.rotation.x = Math.PI / 4 + Math.sin(Date.now() * 0.001) * 0.2;

        // Smooth Opacity & Scale transitions between the 5 stages
        stageGroups.forEach((grp, idx) => {
          const target = (idx + 1) === activeStage ? 1.0 : 0.0;
          const currentScale = grp.scale.x;
          const newScale = THREE.MathUtils.lerp(currentScale, target, 0.08);

          grp.scale.set(newScale, newScale, newScale);
          grp.visible = newScale > 0.02;
        });

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(reqId);
        window.removeEventListener('resize', handleResize);
        mount.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('RightStageCanvas WebGL error:', err);
      setWebGLError(true);
    }
  }, [activeStage]);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto select-none">
      {webGLError ? (
        // High-fidelity SVG Fallback
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <div className="text-cyan-400 font-mono text-sm mb-3">
            Hardware 3D Mesh Mode (Stage 0{activeStage})
          </div>
          <div className="w-56 h-56 rounded-full border border-cyan-500/30 flex items-center justify-center animate-pulse">
            <div className="w-36 h-36 rounded-full border border-dashed border-violet-500/40 animate-spin" />
          </div>
        </div>
      ) : (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Floating 3D Control Pill */}
      <div className="absolute bottom-8 right-8 text-[11px] font-mono px-3 py-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-400 backdrop-blur-md flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Stage 0{activeStage} &bull; Drag to rotate 3D</span>
      </div>
    </div>
  );
}
