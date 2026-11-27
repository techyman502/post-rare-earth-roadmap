import * as THREE from 'three';

// Create a glowing circular soft-particle canvas texture
let cachedParticleTexture = null;
export function getParticleTexture() {
  if (cachedParticleTexture) return cachedParticleTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  cachedParticleTexture = new THREE.CanvasTexture(canvas);
  return cachedParticleTexture;
}

// Helper to create wireframe cylinder cage
function createWireframeCylinder(radiusTop, radiusBottom, height, radialSegments, heightSegments, color, opacity = 0.5) {
  const geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, true);
  const wireGeom = new THREE.WireframeGeometry(geom);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.LineSegments(wireGeom, mat);
}

// =========================================================================
// MODEL 1: NdFeB IPMSM (Baseline)
// =========================================================================
export function buildNdFeBIPMSM() {
  const group = new THREE.Group();
  const particleTex = getParticleTexture();
  const components = [];

  // 1. Outer Stator Shell (White Wireframe)
  const statorGroup = new THREE.Group();
  const statorWire = createWireframeCylinder(2.4, 2.4, 2.6, 24, 6, 0xffffff, 0.4);
  statorGroup.add(statorWire);
  
  // Outer mounting rings
  const ringGeom = new THREE.TorusGeometry(2.42, 0.03, 8, 48);
  const ringMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
  const ringTop = new THREE.LineSegments(new THREE.WireframeGeometry(ringGeom), ringMat);
  ringTop.rotation.x = Math.PI / 2;
  ringTop.position.y = 1.3;
  const ringBottom = ringTop.clone();
  ringBottom.position.y = -1.3;
  statorGroup.add(ringTop, ringBottom);

  group.add(statorGroup);
  components.push({
    id: 'stator',
    name: 'Outer Stator Shell',
    badge: '400V Die-Cast Laminated Housing',
    color: '#ffffff',
    object: statorGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 1.8, 0),
    anchorLocal: new THREE.Vector3(1.2, 1.1, 1.8),
    desc: 'Automotive grade structural stator frame with zero rare earth content.'
  });

  // 2. Copper Hairpin Coils (Gold Particles)
  const coilsGroup = new THREE.Group();
  const coilSlotCount = 36;
  const coilPositions = [];
  for (let s = 0; s < coilSlotCount; s++) {
    const angle = (s / coilSlotCount) * Math.PI * 2;
    const r = 2.0;
    for (let h = -1.4; h <= 1.4; h += 0.08) {
      // hairpin vertical bars with slight end bends
      const rOffset = Math.sin((h + 1.4) / 2.8 * Math.PI * 4) * 0.05;
      const x = Math.cos(angle) * (r + rOffset);
      const z = Math.sin(angle) * (r + rOffset);
      coilPositions.push(x, h, z);
    }
  }
  const coilGeom = new THREE.BufferGeometry();
  coilGeom.setAttribute('position', new THREE.Float32BufferAttribute(coilPositions, 3));
  const coilMat = new THREE.PointsMaterial({
    color: 0xf59e0b,
    size: 0.12,
    map: particleTex,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const coilPoints = new THREE.Points(coilGeom, coilMat);
  coilsGroup.add(coilPoints);

  group.add(coilsGroup);
  components.push({
    id: 'coils',
    name: 'Copper Hairpin Coils',
    badge: '96.2% High-Slot Fill Factor',
    color: '#f59e0b',
    object: coilsGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 0.9, 0),
    anchorLocal: new THREE.Vector3(1.4, 0.5, 1.4),
    desc: 'Dense 8-layer oxygen-free copper hairpin windings with 220°C PEEK insulation.'
  });

  // 3. Rotor Core (Cyan Wireframe & Lamination)
  const rotorGroup = new THREE.Group();
  const rotorWire = createWireframeCylinder(1.5, 1.5, 2.4, 20, 8, 0x06b6d4, 0.55);
  rotorGroup.add(rotorWire);

  // Shaft
  const shaftWire = createWireframeCylinder(0.38, 0.38, 3.8, 16, 4, 0x94a3b8, 0.5);
  rotorGroup.add(shaftWire);

  group.add(rotorGroup);
  components.push({
    id: 'rotor',
    name: 'Laminated Silicon Rotor Core',
    badge: '0.25mm Low-Loss Electrical Steel',
    color: '#06b6d4',
    object: rotorGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -0.9, 0),
    anchorLocal: new THREE.Vector3(-1.1, 0, 1.1),
    desc: 'Non-oriented silicon steel laminations with internal V-cavity flux barriers.'
  });

  // 4. Buried Dy/Tb NdFeB Magnets (Glowing Red Alert)
  const magnetGroup = new THREE.Group();
  const poleCount = 8;
  const magnetPositions = [];
  const magnetBoxes = [];
  for (let p = 0; p < poleCount; p++) {
    const baseAngle = (p / poleCount) * Math.PI * 2;
    // V-shaped magnet pair
    [-0.12, 0.12].forEach((offsetAngle, vIdx) => {
      const angle = baseAngle + offsetAngle;
      const r = 1.15;
      const mx = Math.cos(angle) * r;
      const mz = Math.sin(angle) * r;
      
      // Wireframe box for magnet
      const boxGeom = new THREE.BoxGeometry(0.2, 2.1, 0.45);
      const boxWire = new THREE.WireframeGeometry(boxGeom);
      const boxLine = new THREE.LineSegments(
        boxWire,
        new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
      );
      boxLine.position.set(mx, 0, mz);
      boxLine.rotation.y = -angle + (vIdx === 0 ? 0.3 : -0.3);
      magnetGroup.add(boxLine);

      // Dense glowing red point core
      for (let y = -0.95; y <= 0.95; y += 0.12) {
        for (let t = -0.15; t <= 0.15; t += 0.1) {
          magnetPositions.push(mx + Math.cos(angle) * t, y, mz + Math.sin(angle) * t);
        }
      }
    });
  }

  const magnetPtsGeom = new THREE.BufferGeometry();
  magnetPtsGeom.setAttribute('position', new THREE.Float32BufferAttribute(magnetPositions, 3));
  const magnetPtsMat = new THREE.PointsMaterial({
    color: 0xff2222,
    size: 0.14,
    map: particleTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  magnetGroup.add(new THREE.Points(magnetPtsGeom, magnetPtsMat));

  group.add(magnetGroup);
  components.push({
    id: 'magnets',
    name: 'Buried NdFeB Magnets',
    badge: 'CRITICAL: 6.8% Dysprosium / Terbium Alert',
    color: '#ef4444',
    object: magnetGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -2.0, 0),
    anchorLocal: new THREE.Vector3(0.9, -0.4, 0.9),
    desc: 'Sintered Nd-Fe-B Grade 52H magnets with heavy Dy/Tb grain boundary diffusion. Subject to 100% MOFCOM export restrictions.'
  });

  return {
    id: 'ndfeb-ipmsm',
    title: 'NdFeB IPMSM (Baseline)',
    category: 'Commercial Benchmark',
    threatLevel: 'Extreme Supply Chokepoint',
    group,
    components
  };
}

// =========================================================================
// MODEL 2: Ferrite PMa-SynRM (Permanent Magnet Assisted SynRM)
// =========================================================================
export function buildFerriteSynRM() {
  const group = new THREE.Group();
  const particleTex = getParticleTexture();
  const components = [];

  // 1. Stator Frame (White Wireframe)
  const statorGroup = new THREE.Group();
  const statorWire = createWireframeCylinder(2.4, 2.4, 2.5, 24, 6, 0xe2e8f0, 0.4);
  statorGroup.add(statorWire);
  group.add(statorGroup);
  components.push({
    id: 'stator',
    name: 'Standard AC Stator Housing',
    badge: 'Conventional 3-Phase Slot Architecture',
    color: '#e2e8f0',
    object: statorGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 1.8, 0),
    anchorLocal: new THREE.Vector3(1.2, 1.1, 1.8),
    desc: 'Unmodified high-volume stator infrastructure using identical stamping lines as rare-earth motors.'
  });

  // 2. Multi-Layer Flux-Barrier Rotor (Cyan Curved Barriers)
  const rotorGroup = new THREE.Group();
  const barrierLines = [];
  const poles = 4;
  for (let p = 0; p < poles; p++) {
    const baseTheta = (p / poles) * Math.PI * 2;
    // 3 nested flux barrier arcs per pole
    [0.7, 1.1, 1.45].forEach((radius) => {
      for (let step = -0.55; step <= 0.55; step += 0.05) {
        const th = baseTheta + step;
        const x = Math.cos(th) * radius;
        const z = Math.sin(th) * radius;
        for (let y = -1.1; y <= 1.1; y += 0.22) {
          barrierLines.push(x, y, z);
        }
      }
    });
  }
  const barrierGeom = new THREE.BufferGeometry();
  barrierGeom.setAttribute('position', new THREE.Float32BufferAttribute(barrierLines, 3));
  const barrierMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.1,
    map: particleTex,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  rotorGroup.add(new THREE.Points(barrierGeom, barrierMat));

  // Lamination stack cylinder
  const rotorWire = createWireframeCylinder(1.5, 1.5, 2.2, 16, 6, 0x0891b2, 0.35);
  rotorGroup.add(rotorWire);

  group.add(rotorGroup);
  components.push({
    id: 'flux-barriers',
    name: 'Multi-Barrier Reluctance Rotor',
    badge: 'High Saliency Ratio (ξ > 7.5)',
    color: '#00f2fe',
    object: rotorGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -0.6, 0),
    anchorLocal: new THREE.Vector3(1.2, 0.4, 0.8),
    desc: 'Multi-barrier magnetic reluctance channels channel magnetic flux to produce synchronous reluctance torque.'
  });

  // 3. Ceramic Ferrite Inserts (Emerald Green — Zero Rare Earths)
  const ferriteGroup = new THREE.Group();
  const ferritePositions = [];
  for (let p = 0; p < poles; p++) {
    const baseTheta = (p / poles) * Math.PI * 2;
    [0.85, 1.25].forEach((radius) => {
      for (let step = -0.35; step <= 0.35; step += 0.07) {
        const th = baseTheta + step;
        const fx = Math.cos(th) * radius;
        const fz = Math.sin(th) * radius;
        for (let fy = -0.95; fy <= 0.95; fy += 0.15) {
          ferritePositions.push(fx, fy, fz);
        }
      }
    });
  }
  const ferriteGeom = new THREE.BufferGeometry();
  ferriteGeom.setAttribute('position', new THREE.Float32BufferAttribute(ferritePositions, 3));
  const ferriteMat = new THREE.PointsMaterial({
    color: 0x10b981,
    size: 0.13,
    map: particleTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  ferriteGroup.add(new THREE.Points(ferriteGeom, ferriteMat));

  // Add glowing outline boxes for ferrite tiles
  for (let p = 0; p < poles; p++) {
    const baseTheta = (p / poles) * Math.PI * 2;
    const tileBox = new THREE.BoxGeometry(0.35, 1.9, 0.6);
    const tileWire = new THREE.WireframeGeometry(tileBox);
    const tileMesh = new THREE.LineSegments(
      tileWire,
      new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
    );
    tileMesh.position.set(Math.cos(baseTheta) * 1.05, 0, Math.sin(baseTheta) * 1.05);
    tileMesh.rotation.y = -baseTheta;
    ferriteGroup.add(tileMesh);
  }

  group.add(ferriteGroup);
  components.push({
    id: 'ferrite',
    name: 'Ceramic Strontium-Ferrite Slabs',
    badge: '100% Zero Rare Earths ($1.20/kg vs $140/kg)',
    color: '#10b981',
    object: ferriteGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -1.8, 0),
    anchorLocal: new THREE.Vector3(-1.1, -0.2, 0.7),
    desc: 'Cost-effective SrFe12O19 ferrite magnets providing counter-EMF to boost high-speed highway efficiency with zero geopolitical supply risk.'
  });

  // 4. Non-Magnetic Shaft
  const shaftGroup = new THREE.Group();
  const shaftWire = createWireframeCylinder(0.36, 0.36, 3.6, 16, 4, 0x64748b, 0.6);
  shaftGroup.add(shaftWire);
  group.add(shaftGroup);
  components.push({
    id: 'shaft',
    name: 'Non-Magnetic Stainless Shaft',
    badge: 'Austenitic 316L Stainless Steel',
    color: '#94a3b8',
    object: shaftGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -2.6, 0),
    anchorLocal: new THREE.Vector3(0, -1.5, 0.38),
    desc: 'Eliminates rotor shaft magnetic flux leakage.'
  });

  return {
    id: 'ferrite-synrm',
    title: 'Ferrite PMa-SynRM',
    category: 'Commercial Production (Vitesco / ProLog)',
    threatLevel: 'Zero Geopolitical Risk',
    group,
    components
  };
}

// =========================================================================
// MODEL 3: EESM Wound-Rotor (BMW / Renault Architecture)
// =========================================================================
export function buildEESMWoundRotor() {
  const group = new THREE.Group();
  const particleTex = getParticleTexture();
  const components = [];

  // 1. Stator Shell (White Wireframe)
  const statorGroup = new THREE.Group();
  const statorWire = createWireframeCylinder(2.35, 2.35, 2.6, 24, 6, 0xf8fafc, 0.38);
  statorGroup.add(statorWire);
  group.add(statorGroup);
  components.push({
    id: 'stator',
    name: 'Outer Stator Assembly',
    badge: 'Water-Glycol Cooling Jacket Shell',
    color: '#f8fafc',
    object: statorGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 1.9, 0),
    anchorLocal: new THREE.Vector3(1.2, 1.1, 1.8),
    desc: 'Stator housing with integrated cooling jacket for continuous highway cruising.'
  });

  // 2. Salient Rotor Pole Shoes (Cyan Steel)
  const polesGroup = new THREE.Group();
  const poleCount = 4;
  for (let p = 0; p < poleCount; p++) {
    const angle = (p / poleCount) * Math.PI * 2;
    const shoeBox = new THREE.BoxGeometry(0.7, 2.1, 0.9);
    const shoeWire = new THREE.WireframeGeometry(shoeBox);
    const shoeMesh = new THREE.LineSegments(
      shoeWire,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending })
    );
    shoeMesh.position.set(Math.cos(angle) * 1.05, 0, Math.sin(angle) * 1.05);
    shoeMesh.rotation.y = -angle;
    polesGroup.add(shoeMesh);
  }
  group.add(polesGroup);
  components.push({
    id: 'salient-poles',
    name: 'Salient Rotor Core Poles',
    badge: '4-Pole Laminated Electromagnetic Core',
    color: '#38bdf8',
    object: polesGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 0.8, 0),
    anchorLocal: new THREE.Vector3(-1.1, 0.4, 0.8),
    desc: 'Precision laser-cut laminations shaping the dynamic rotor magnetic poles.'
  });

  // 3. Rotor Copper Field Coils (Amber Particles)
  const fieldCoilsGroup = new THREE.Group();
  const coilPts = [];
  for (let p = 0; p < poleCount; p++) {
    const angle = (p / poleCount) * Math.PI * 2;
    const rCenter = 0.95;
    // Wound coils around salient poles
    for (let loop = 0; loop < 18; loop++) {
      const yPos = -0.9 + (loop / 18) * 1.8;
      for (let t = 0; t <= Math.PI * 2; t += 0.15) {
        const lx = Math.cos(t) * 0.45;
        const lz = Math.sin(t) * 0.35;
        // transform to pole orientation
        const gx = Math.cos(angle) * (rCenter + lx) - Math.sin(angle) * lz;
        const gz = Math.sin(angle) * (rCenter + lx) + Math.cos(angle) * lz;
        coilPts.push(gx, yPos, gz);
      }
    }
  }
  const fieldGeom = new THREE.BufferGeometry();
  fieldGeom.setAttribute('position', new THREE.Float32BufferAttribute(coilPts, 3));
  const fieldMat = new THREE.PointsMaterial({
    color: 0xd97706,
    size: 0.12,
    map: particleTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  fieldCoilsGroup.add(new THREE.Points(fieldGeom, fieldMat));
  group.add(fieldCoilsGroup);
  components.push({
    id: 'field-coils',
    name: 'Rotor Copper Field Windings',
    badge: 'Zero Magnets — 100% Software-Tunable Flux',
    color: '#d97706',
    object: fieldCoilsGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -0.9, 0),
    anchorLocal: new THREE.Vector3(1.15, -0.1, 0.85),
    desc: 'Electromagnet coils excited by controllable DC current. Allows complete flux shutoff at 130 km/h for zero drag and 96.8% highway efficiency.'
  });

  // 4. Brushless Inductive Exciter Ring (Amber Glowing Ring)
  const exciterGroup = new THREE.Group();
  const torusGeom = new THREE.TorusGeometry(0.85, 0.18, 12, 36);
  const torusWire = new THREE.WireframeGeometry(torusGeom);
  const torusLine = new THREE.LineSegments(
    torusWire,
    new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })
  );
  torusLine.rotation.x = Math.PI / 2;
  torusLine.position.y = -1.6;
  exciterGroup.add(torusLine);

  // Rotating rectifier disc points
  const discPts = [];
  for (let th = 0; th < Math.PI * 2; th += 0.08) {
    for (let r = 0.4; r <= 0.85; r += 0.09) {
      discPts.push(Math.cos(th) * r, -1.6, Math.sin(th) * r);
    }
  }
  const discGeom = new THREE.BufferGeometry();
  discGeom.setAttribute('position', new THREE.Float32BufferAttribute(discPts, 3));
  const discMat = new THREE.PointsMaterial({
    color: 0xfbbf24,
    size: 0.1,
    map: particleTex,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  exciterGroup.add(new THREE.Points(discGeom, discMat));

  group.add(exciterGroup);
  components.push({
    id: 'exciter',
    name: 'Brushless Inductive Exciter Wheel',
    badge: 'Zero Carbon Brushes / Contactless Wireless Transfer',
    color: '#f59e0b',
    object: exciterGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -2.1, 0),
    anchorLocal: new THREE.Vector3(0, -1.6, 0.85),
    desc: 'High-frequency wireless rotary transformer transmitting power to the rotating field windings without wearing slip rings or dust.'
  });

  return {
    id: 'eesm-wound-rotor',
    title: 'EESM Wound-Rotor',
    category: 'Tier-1 Automakers (BMW Gen5, Renault)',
    threatLevel: 'Zero Rare Earths (100% Copper)',
    group,
    components
  };
}

// =========================================================================
// MODEL 4: Curvilinear Nanowire (Shape Anisotropy Lab)
// =========================================================================
export function buildCurvilinearNanowire() {
  const group = new THREE.Group();
  const particleTex = getParticleTexture();
  const components = [];

  // 1. Helical Fe-Ni-P Outer Nanowire (Cyan Glowing Points & Spine)
  const outerHelixGroup = new THREE.Group();
  const outerHelixPts = [];
  const helixTurns = 5;
  const heightTotal = 3.6;
  for (let t = 0; t <= helixTurns * Math.PI * 2; t += 0.035) {
    const progress = t / (helixTurns * Math.PI * 2);
    const y = -heightTotal / 2 + progress * heightTotal;
    const r = 1.35 + Math.sin(progress * Math.PI * 3) * 0.15;
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    outerHelixPts.push(x, y, z);
    // Add micro-cluster particles along the strand
    for (let c = 0; c < 3; c++) {
      const spread = 0.08;
      outerHelixPts.push(
        x + (Math.random() - 0.5) * spread,
        y + (Math.random() - 0.5) * spread,
        z + (Math.random() - 0.5) * spread
      );
    }
  }
  const outerGeom = new THREE.BufferGeometry();
  outerGeom.setAttribute('position', new THREE.Float32BufferAttribute(outerHelixPts, 3));
  const outerMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.12,
    map: particleTex,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  outerHelixGroup.add(new THREE.Points(outerGeom, outerMat));
  group.add(outerHelixGroup);
  components.push({
    id: 'outer-helix',
    name: 'Fe-Ni-P Helical Nanostructure',
    badge: '440 Oe Shape Anisotropy Coercivity',
    color: '#06b6d4',
    object: outerHelixGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(1.2, 0.8, 0),
    anchorLocal: new THREE.Vector3(1.35, 0.6, 0.5),
    desc: 'Synthesized via template-assisted electrodeposition. Uses geometrical chirality to trap magnetic domains without expensive lanthanides.'
  });

  // 2. Chiral Domain Wall Counter-Spiral (Magenta Glow)
  const innerHelixGroup = new THREE.Group();
  const innerHelixPts = [];
  for (let t = 0; t <= helixTurns * Math.PI * 2; t += 0.04) {
    const progress = t / (helixTurns * Math.PI * 2);
    const y = -heightTotal / 2 + progress * heightTotal;
    const r = 0.85;
    // Counter-phase helix
    const x = Math.cos(-t + Math.PI) * r;
    const z = Math.sin(-t + Math.PI) * r;
    innerHelixPts.push(x, y, z);
    for (let c = 0; c < 2; c++) {
      innerHelixPts.push(
        x + (Math.random() - 0.5) * 0.06,
        y + (Math.random() - 0.5) * 0.06,
        z + (Math.random() - 0.5) * 0.06
      );
    }
  }
  const innerGeom = new THREE.BufferGeometry();
  innerGeom.setAttribute('position', new THREE.Float32BufferAttribute(innerHelixPts, 3));
  const innerMat = new THREE.PointsMaterial({
    color: 0xec4899,
    size: 0.11,
    map: particleTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  innerHelixGroup.add(new THREE.Points(innerGeom, innerMat));
  group.add(innerHelixGroup);
  components.push({
    id: 'domain-walls',
    name: 'Topological Domain Wall Spin Chain',
    badge: 'Chiral Vortex Pinned Boundaries',
    color: '#ec4899',
    object: innerHelixGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(-1.2, -0.6, 0),
    anchorLocal: new THREE.Vector3(-0.85, -0.4, 0.7),
    desc: 'Curvature-induced effective Dzyaloshinskii-Moriya interaction stabilizing chiral magnetic solitons.'
  });

  // 3. Central Axis Spine & Geometric Matrix (Gold)
  const axisGroup = new THREE.Group();
  const spineLineGeom = new THREE.CylinderGeometry(0.04, 0.04, 4.2, 12);
  const spineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
  axisGroup.add(new THREE.Mesh(spineLineGeom, spineMat));

  // Radial connector spokes
  const spokesPts = [];
  for (let s = -1.8; s <= 1.8; s += 0.3) {
    const angle = (s / 1.8) * Math.PI * 4;
    spokesPts.push(0, s, 0);
    spokesPts.push(Math.cos(angle) * 1.1, s, Math.sin(angle) * 1.1);
  }
  const spokesGeom = new THREE.BufferGeometry();
  spokesGeom.setAttribute('position', new THREE.Float32BufferAttribute(spokesPts, 3));
  const spokesLine = new THREE.LineSegments(
    spokesGeom,
    new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
  );
  axisGroup.add(spokesLine);

  group.add(axisGroup);
  components.push({
    id: 'axis-spine',
    name: 'Geometric Anisotropy Axis',
    badge: 'Template Matrix Vector Alignment',
    color: '#f59e0b',
    object: axisGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 1.8, 0),
    anchorLocal: new THREE.Vector3(0, 1.8, 0.1),
    desc: 'Anodized aluminum oxide (AAO) nanopore template axis guaranteeing parallel magnetization direction.'
  });

  return {
    id: 'curvilinear-nanowire',
    title: 'Curvilinear Nanowire',
    category: 'Advanced Nano-Physics Lab',
    threatLevel: 'Zero Rare Earths (Shape Engineered)',
    group,
    components
  };
}

// =========================================================================
// MODEL 5: MgB2 Superconductor (20K Cryogenic Architecture)
// =========================================================================
export function buildMgB2Superconductor() {
  const group = new THREE.Group();
  const particleTex = getParticleTexture();
  const components = [];

  // 1. 20K Cryostat Shell (Ice Blue Wireframe)
  const cryoGroup = new THREE.Group();
  const cryoWire = createWireframeCylinder(2.5, 2.5, 3.2, 24, 8, 0x38bdf8, 0.45);
  cryoGroup.add(cryoWire);

  // Vacuum barrier outer rings
  const ringGeom = new THREE.TorusGeometry(2.55, 0.04, 8, 48);
  const ringMat = new THREE.LineBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.65 });
  const ringTop = new THREE.LineSegments(new THREE.WireframeGeometry(ringGeom), ringMat);
  ringTop.rotation.x = Math.PI / 2;
  ringTop.position.y = 1.6;
  const ringBottom = ringTop.clone();
  ringBottom.position.y = -1.6;
  cryoGroup.add(ringTop, ringBottom);

  group.add(cryoGroup);
  components.push({
    id: 'cryostat',
    name: 'Double-Wall Vacuum Cryostat',
    badge: 'High-Vacuum Multi-Layer Insulation (10⁻⁵ mbar)',
    color: '#38bdf8',
    object: cryoGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 2.0, 0),
    anchorLocal: new THREE.Vector3(1.2, 1.3, 1.9),
    desc: 'Double-wall stainless vacuum chamber shielding the 20K superconducting stator from 300K ambient thermal conduction.'
  });

  // 2. Lossless MgB2 Superconducting Coils (Bright Cyan Particle Rings)
  const coilsGroup = new THREE.Group();
  const coilRingCount = 6;
  const coilPts = [];
  for (let c = 0; c < coilRingCount; c++) {
    const yCenter = -1.25 + (c / (coilRingCount - 1)) * 2.5;
    for (let th = 0; th < Math.PI * 2; th += 0.06) {
      for (let r = 1.6; r <= 1.95; r += 0.07) {
        coilPts.push(Math.cos(th) * r, yCenter + (Math.random() - 0.5) * 0.08, Math.sin(th) * r);
      }
    }
  }
  const coilsGeom = new THREE.BufferGeometry();
  coilsGeom.setAttribute('position', new THREE.Float32BufferAttribute(coilPts, 3));
  const coilsMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.13,
    map: particleTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  coilsGroup.add(new THREE.Points(coilsGeom, coilsMat));

  // Add racetrack wireframes
  for (let c = 0; c < coilRingCount; c++) {
    const yCenter = -1.25 + (c / (coilRingCount - 1)) * 2.5;
    const torus = new THREE.TorusGeometry(1.78, 0.16, 12, 36);
    const wire = new THREE.WireframeGeometry(torus);
    const mesh = new THREE.LineSegments(
      wire,
      new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending })
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = yCenter;
    coilsGroup.add(mesh);
  }

  group.add(coilsGroup);
  components.push({
    id: 'mgb2-coils',
    name: 'Lossless MgB₂ Superconducting Coils',
    badge: 'Critical Temp Tc = 39K (Zero Electrical Resistance)',
    color: '#00f2fe',
    object: coilsGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 0.7, 0),
    anchorLocal: new THREE.Vector3(1.78, 0.4, 0.7),
    desc: 'Magnesium Diboride tapes carrying up to 10,000 A/cm² current density with zero I²R Joule heating losses, boosting power density by +61%.'
  });

  // 3. Liquid Hydrogen Cryogenic Channel (Cyan / Deep Ice-Blue Core)
  const h2Group = new THREE.Group();
  const h2Pts = [];
  for (let i = 0; i < 450; i++) {
    const r = Math.random() * 0.95;
    const th = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 3.2;
    h2Pts.push(Math.cos(th) * r, y, Math.sin(th) * r);
  }
  const h2Geom = new THREE.BufferGeometry();
  h2Geom.setAttribute('position', new THREE.Float32BufferAttribute(h2Pts, 3));
  const h2Mat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.14,
    map: particleTex,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  h2Group.add(new THREE.Points(h2Geom, h2Mat));

  const coreCylinder = createWireframeCylinder(0.98, 0.98, 3.2, 16, 6, 0x0891b2, 0.5);
  h2Group.add(coreCylinder);

  group.add(h2Group);
  components.push({
    id: 'lh2-cooling',
    name: 'Liquid Hydrogen Cooling Channel (20K)',
    badge: 'Dual Role: Cryogenic Coolant + Fuel Cell Fuel',
    color: '#06b6d4',
    object: h2Group,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -1.2, 0),
    anchorLocal: new THREE.Vector3(0, -0.6, 0.98),
    desc: '20 Kelvin liquid hydrogen acts as both high-density cryogenic refrigerant and the onboard fuel for heavy-duty long-haul transport.'
  });

  // 4. Gold Radiation Shield Barrier
  const shieldGroup = new THREE.Group();
  const shieldWire = createWireframeCylinder(2.2, 2.2, 2.9, 20, 6, 0xf59e0b, 0.5);
  shieldGroup.add(shieldWire);
  group.add(shieldGroup);
  components.push({
    id: 'mli-shield',
    name: 'Gold Multi-Layer Thermal Shield',
    badge: 'Radiative Heat Transfer Attenuation',
    color: '#f59e0b',
    object: shieldGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -2.4, 0),
    anchorLocal: new THREE.Vector3(-1.3, -1.1, 1.4),
    desc: '40 layers of aluminized mylar and gold foil reflecting 99.7% of infrared thermal radiation.'
  });

  return {
    id: 'mgb2-superconductor',
    title: 'MgB2 Superconductor',
    category: 'Cryogenic Heavy Haul (Airbus / CRRC)',
    threatLevel: 'Zero REE (+61% Power Density)',
    group,
    components
  };
}

// =========================================================================
// MODEL 6: Altermagnetism (THz Zero-Dipole) — Model 06
// =========================================================================
export function buildAltermagnetUnitCell() {
  const group = new THREE.Group();
  const particleTex = getParticleTexture();
  const components = [];

  const spinPivotsA = [];
  const spinPivotsB = [];

  // Helper: Create a directional spin vector arrow inside a precessing pivot
  function createSpinArrow(colorHex, isUpward = true) {
    const pivot = new THREE.Group();
    
    // Cylindrical shaft
    const shaftGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.54, 8);
    const shaftMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const shaft = new THREE.Mesh(shaftGeom, shaftMat);
    shaft.position.y = isUpward ? 0.27 : -0.27;

    // Conical arrowhead
    const headGeom = new THREE.ConeGeometry(0.075, 0.18, 8);
    const headMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = isUpward ? 0.54 : -0.54;
    if (!isUpward) {
      head.rotation.x = Math.PI;
    }

    // Precession cone tilt container (~14° cone angle)
    const arrowContainer = new THREE.Group();
    arrowContainer.add(shaft, head);
    arrowContainer.rotation.z = isUpward ? 0.24 : -0.24;

    pivot.add(arrowContainer);
    return pivot;
  }

  // -------------------------------------------------------------------------
  // 1. Sublattice A: Cyan Glowing Spheres with Upward Precessing Spin Vectors
  // -------------------------------------------------------------------------
  const sublatticeAGroup = new THREE.Group();
  const sitesA = [
    new THREE.Vector3(-0.85, 0.85, -0.85),
    new THREE.Vector3(0.85, 0.85, 0.85),
    new THREE.Vector3(-0.85, -0.85, 0.85),
    new THREE.Vector3(0.85, -0.85, -0.85),
  ];

  sitesA.forEach((pos) => {
    // Cyan atom core sphere
    const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    sphere.position.copy(pos);
    sublatticeAGroup.add(sphere);

    // Cyan glowing particle halo
    const spriteMat = new THREE.SpriteMaterial({
      map: particleTex,
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(pos);
    sprite.scale.set(0.65, 0.65, 0.65);
    sublatticeAGroup.add(sprite);

    // Upward precessing spin vector
    const arrowPivot = createSpinArrow(0x22d3ee, true);
    arrowPivot.position.copy(pos);
    sublatticeAGroup.add(arrowPivot);
    spinPivotsA.push(arrowPivot);
  });

  group.add(sublatticeAGroup);
  components.push({
    id: 'sublattice-a',
    name: 'Sublattice A (Cyan Spin-Up)',
    badge: '100% Spin-Polarized State • Upward Moments',
    color: '#06b6d4',
    object: sublatticeAGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, 1.8, 0),
    anchorLocal: new THREE.Vector3(0.85, 0.85, 0.85),
    desc: 'Crystalline sublattice of magnetic ions (Cr/Ru) carrying coherent spin-up magnetic moments precessing at Terahertz resonance.'
  });

  // -------------------------------------------------------------------------
  // 2. Sublattice B: Amber Glowing Spheres with Downward Antiparallel Spins
  // -------------------------------------------------------------------------
  const sublatticeBGroup = new THREE.Group();
  const sitesB = [
    new THREE.Vector3(0, 0, 0),       // Central unit cell ion
    new THREE.Vector3(-0.85, 0.85, 0.85),
    new THREE.Vector3(0.85, 0.85, -0.85),
    new THREE.Vector3(-0.85, -0.85, -0.85),
    new THREE.Vector3(0.85, -0.85, 0.85),
  ];

  sitesB.forEach((pos) => {
    // Amber atom core sphere
    const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    sphere.position.copy(pos);
    sublatticeBGroup.add(sphere);

    // Amber glowing particle halo
    const spriteMat = new THREE.SpriteMaterial({
      map: particleTex,
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.copy(pos);
    sprite.scale.set(0.65, 0.65, 0.65);
    sublatticeBGroup.add(sprite);

    // Downward antiparallel precessing spin vector
    const arrowPivot = createSpinArrow(0xfbbf24, false);
    arrowPivot.position.copy(pos);
    sublatticeBGroup.add(arrowPivot);
    spinPivotsB.push(arrowPivot);
  });

  group.add(sublatticeBGroup);
  components.push({
    id: 'antiparallel-sublattices',
    name: 'Antiparallel Sublattices (M = 0)',
    badge: 'Zero Net Dipole • Zero Stray Dipolar Fields',
    color: '#f59e0b',
    object: sublatticeBGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(0, -1.8, 0),
    anchorLocal: new THREE.Vector3(0, 0, 0),
    desc: 'Sublattices A and B have strictly antiparallel spin orientations that cancel to zero net magnetization (M = 0), preventing crosstalk between adjacent spintronic bits.'
  });

  // -------------------------------------------------------------------------
  // 3. Rotated Local Non-Magnetic Ligand Cages (Crystal-Rotation Symmetry)
  // -------------------------------------------------------------------------
  const ligandCagesGroup = new THREE.Group();

  // Outer Crystalline Unit Cell Wireframe Box
  const unitBoxGeom = new THREE.BoxGeometry(2.2, 2.2, 2.2);
  const unitBoxWire = new THREE.WireframeGeometry(unitBoxGeom);
  const unitBoxLine = new THREE.LineSegments(
    unitBoxWire,
    new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.55 })
  );
  ligandCagesGroup.add(unitBoxLine);

  // Local non-magnetic ligand octahedra around Sublattice A sites (0° rotation)
  sitesA.forEach((pos) => {
    const octGeom = new THREE.OctahedronGeometry(0.48);
    const octWire = new THREE.WireframeGeometry(octGeom);
    const cageA = new THREE.LineSegments(
      octWire,
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
    );
    cageA.position.copy(pos);
    ligandCagesGroup.add(cageA);
  });

  // Local non-magnetic ligand octahedra around Sublattice B sites (ROTATED 90° relative to A)
  sitesB.forEach((pos) => {
    const octGeom = new THREE.OctahedronGeometry(0.48);
    const octWire = new THREE.WireframeGeometry(octGeom);
    const cageB = new THREE.LineSegments(
      octWire,
      new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending })
    );
    cageB.position.copy(pos);
    cageB.rotation.set(Math.PI / 4, Math.PI / 2, 0); // 90° crystal-rotation symmetry
    ligandCagesGroup.add(cageB);
  });

  // Lattice coordination bonding struts
  const bondPts = [];
  sitesA.forEach((aPos) => {
    bondPts.push(0, 0, 0, aPos.x, aPos.y, aPos.z);
  });
  const bondGeom = new THREE.BufferGeometry();
  bondGeom.setAttribute('position', new THREE.Float32BufferAttribute(bondPts, 3));
  const bondLines = new THREE.LineSegments(
    bondGeom,
    new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 })
  );
  ligandCagesGroup.add(bondLines);

  group.add(ligandCagesGroup);
  components.push({
    id: 'ligand-cages',
    name: 'Crystal-Rotation Symmetry',
    badge: 'Rotated 90° Octahedral Ligand Cages',
    color: '#f59e0b',
    object: ligandCagesGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(1.8, 0, -1.6),
    anchorLocal: new THREE.Vector3(1.1, 0, 0),
    desc: 'Local non-magnetic ligand octahedra are rotated by 90° between Sublattices A and B. This spatial rotation breaks time-reversal symmetry without requiring net magnetic dipoles.'
  });

  // -------------------------------------------------------------------------
  // 4. Momentum-Space Spin-Splitting Lobes (d-wave / g-wave)
  // -------------------------------------------------------------------------
  const fermiLobeGroup = new THREE.Group();

  // 4 alternating d-wave Fermi lobes (dx2-y2 style in momentum space)
  // Lobe 1 (+X & -X): Spin-Up Cyan
  const lobeGeomX = new THREE.SphereGeometry(0.55, 20, 20);
  lobeGeomX.scale(1.7, 0.75, 0.75);

  const matCyanLobe = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const matCyanWire = new THREE.LineBasicMaterial({
    color: 0x22d3ee,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const lobePosX = new THREE.Mesh(lobeGeomX, matCyanLobe);
  lobePosX.position.set(0.95, 0, 0);
  lobePosX.add(new THREE.LineSegments(new THREE.WireframeGeometry(lobeGeomX), matCyanWire));

  const lobeNegX = new THREE.Mesh(lobeGeomX, matCyanLobe);
  lobeNegX.position.set(-0.95, 0, 0);
  lobeNegX.add(new THREE.LineSegments(new THREE.WireframeGeometry(lobeGeomX), matCyanWire));

  // Lobe 2 (+Z & -Z): Spin-Down Amber
  const lobeGeomZ = new THREE.SphereGeometry(0.55, 20, 20);
  lobeGeomZ.scale(0.75, 0.75, 1.7);

  const matAmberLobe = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const matAmberWire = new THREE.LineBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const lobePosZ = new THREE.Mesh(lobeGeomZ, matAmberLobe);
  lobePosZ.position.set(0, 0, 0.95);
  lobePosZ.add(new THREE.LineSegments(new THREE.WireframeGeometry(lobeGeomZ), matAmberWire));

  const lobeNegZ = new THREE.Mesh(lobeGeomZ, matAmberLobe);
  lobeNegZ.position.set(0, 0, -0.95);
  lobeNegZ.add(new THREE.LineSegments(new THREE.WireframeGeometry(lobeGeomZ), matAmberWire));

  // Central momentum k-space origin node
  const kNodeGeom = new THREE.SphereGeometry(0.12, 12, 12);
  const kNodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const kNode = new THREE.Mesh(kNodeGeom, kNodeMat);

  fermiLobeGroup.add(lobePosX, lobeNegX, lobePosZ, lobeNegZ, kNode);

  group.add(fermiLobeGroup);
  components.push({
    id: 'fermi-lobes',
    name: 'Alternating Spin-Split Bands (THz)',
    badge: 'd-wave Momentum Splitting • Zero Stray Field',
    color: '#06b6d4',
    object: fermiLobeGroup,
    basePosition: new THREE.Vector3(0, 0, 0),
    explodeOffset: new THREE.Vector3(-1.8, 0, 1.6),
    anchorLocal: new THREE.Vector3(0, 0, 1.3),
    desc: 'Alternating d-wave Fermi lobes yield 100% spin-polarized conduction currents at Terahertz frequencies with pure M = 0 zero stray dipolar field leakage.'
  });

  // Dynamic animation loop for high-speed precession & Fermi pulse
  const update = (time, explode) => {
    const spinAngleA = time * 0.007;
    const spinAngleB = spinAngleA + Math.PI;

    for (let i = 0; i < spinPivotsA.length; i++) {
      spinPivotsA[i].rotation.y = spinAngleA;
    }
    for (let i = 0; i < spinPivotsB.length; i++) {
      spinPivotsB[i].rotation.y = spinAngleB;
    }

    const pulse = 1.0 + Math.sin(time * 0.005) * 0.09;
    fermiLobeGroup.scale.set(pulse, pulse, pulse);
  };

  return {
    id: 'altermagnetism-thz',
    title: 'Altermagnetism',
    subtitle: 'THz Zero-Dipole',
    category: 'Quantum Spintronics (CrSb / RuO2)',
    threatLevel: 'Zero REE (M = 0 Terahertz)',
    group,
    components,
    update
  };
}

// Registry map of model builders
export const MODEL_BUILDERS = [
  { id: 'ndfeb-ipmsm', title: 'NdFeB IPMSM', subtitle: 'Baseline Commercial', builder: buildNdFeBIPMSM, accent: '#ef4444' },
  { id: 'ferrite-synrm', title: 'Ferrite PMa-SynRM', subtitle: 'Zero Rare Earths', builder: buildFerriteSynRM, accent: '#10b981' },
  { id: 'eesm-wound-rotor', title: 'EESM Wound-Rotor', subtitle: '100% Copper Field', builder: buildEESMWoundRotor, accent: '#f59e0b' },
  { id: 'curvilinear-nanowire', title: 'Curvilinear Nanowire', subtitle: '440 Oe Shape Coercivity', builder: buildCurvilinearNanowire, accent: '#06b6d4' },
  { id: 'mgb2-superconductor', title: 'MgB2 Superconductor', subtitle: '20K Cryogenic Lossless', builder: buildMgB2Superconductor, accent: '#38bdf8' },
  { id: 'altermagnetism-thz', title: 'Altermagnetism', subtitle: 'THz Zero-Dipole', builder: buildAltermagnetUnitCell, accent: '#06b6d4' },
];
