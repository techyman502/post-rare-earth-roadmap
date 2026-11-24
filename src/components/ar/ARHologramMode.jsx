import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { 
  X, 
  Camera, 
  CameraOff, 
  RotateCw, 
  Sliders, 
  Sparkles, 
  Hand, 
  RefreshCw,
  Eye,
  Activity,
  AlertCircle,
  ZoomIn
} from 'lucide-react';
import { MODEL_BUILDERS } from './hologramModels';

export default function ARHologramMode({ isOpen, onClose }) {
  // Model state
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [explodeSliderVal, setExplodeSliderVal] = useState(0.45);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isMediaPipeLoading, setIsMediaPipeLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState({
    handsDetected: 0,
    gesture: 'Initializing Hand Tracking...',
    fps: 0,
    explodePercent: 45,
    zoomScale: 1.0,
  });
  const [autoRotate, setAutoRotate] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);

  // DOM Refs
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hudCanvasRef = useRef(null);
  const threeMountRef = useRef(null);

  // Runtime Refs
  const streamRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastLandmarksRef = useRef([]);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameRef = useRef(null);
  const threeStateRef = useRef(null);
  const activeModelDataRef = useRef(null);

  // Smoothed gesture state refs (EMA filter for zero-jitter lerp)
  const gestureStateRef = useRef({
    targetExplode: 0.45,
    currentExplode: 0.45,
    targetRotX: 0.2,
    targetRotY: -0.4,
    currentRotX: 0.2,
    currentRotY: -0.4,
    targetScale: 1.0,
    currentScale: 1.0,
    lastPalmPoint: null,
    isZooming: false,
    handsCount: 0,
  });

  // Callout leader lines projection data
  const [projectedLabels, setProjectedLabels] = useState([]);

  // =========================================================================
  // 1. WEBCAM LIFECYCLE (React StrictMode Race Condition Fixed with isCancelled)
  // =========================================================================
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    setIsVideoReady(false);

    async function startCamera() {
      if (!isWebcamEnabled) {
        setIsVideoReady(false);
        return;
      }

      try {
        setWebcamError(null);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Webcam access not supported in this environment.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
          audio: false
        });

        // StrictMode race check: immediately release if unmounted
        if (isCancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;

          // Wait for onloadedmetadata
          await new Promise((resolve) => {
            if (video.readyState >= 1 && video.videoWidth > 0) {
              resolve();
            } else {
              const onMeta = () => {
                video.removeEventListener('loadedmetadata', onMeta);
                resolve();
              };
              video.addEventListener('loadedmetadata', onMeta);
              setTimeout(resolve, 2000); // Safety fallback timeout
            }
          });

          if (isCancelled) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }

          // Explicitly call play
          await video.play();

          // Wait until videoWidth > 0 before signaling readiness
          if (video.videoWidth > 0 && !isCancelled) {
            setIsVideoReady(true);
          } else {
            const checkInterval = setInterval(() => {
              if (isCancelled) {
                clearInterval(checkInterval);
                return;
              }
              if (video && video.videoWidth > 0) {
                clearInterval(checkInterval);
                setIsVideoReady(true);
              }
            }, 40);
            setTimeout(() => clearInterval(checkInterval), 2000);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Camera initialization error:", err);
          setWebcamError("Camera unavailable. Fallback mouse drag & slider enabled.");
          setIsVideoReady(false);
        }
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
      setIsVideoReady(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isOpen, isWebcamEnabled]);

  // Clean shutdown on unmount / exit
  const handleExitAR = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
    onClose();
  }, [onClose]);

  // =========================================================================
  // 2. MEDIAPIPE HAND LANDMARKER SETUP (CDN WASM + 0.35 Confidence)
  // =========================================================================
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    async function initMediaPipe() {
      setIsMediaPipeLoading(true);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
        );

        if (isCancelled) return;

        const landmarkerConfig = {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.35,
          minHandPresenceConfidence: 0.35,
          minTrackingConfidence: 0.35
        };

        let landmarker;
        try {
          landmarker = await HandLandmarker.createFromOptions(vision, landmarkerConfig);
        } catch (gpuErr) {
          console.warn("MediaPipe GPU delegate failed, falling back to CPU:", gpuErr);
          if (isCancelled) return;
          landmarker = await HandLandmarker.createFromOptions(vision, {
            ...landmarkerConfig,
            baseOptions: {
              ...landmarkerConfig.baseOptions,
              delegate: 'CPU'
            }
          });
        }

        if (!isCancelled) {
          handLandmarkerRef.current = landmarker;
          setIsMediaPipeLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("MediaPipe initialization error:", err);
          setIsMediaPipeLoading(false);
          setWebcamError("Hand tracking initialization failed. Interactive mouse & slider mode active.");
        }
      }
    }

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (handLandmarkerRef.current) {
        try {
          handLandmarkerRef.current.close();
        } catch (e) {
          // ignore
        }
        handLandmarkerRef.current = null;
      }
      lastLandmarksRef.current = [];
    };
  }, [isOpen]);

  // =========================================================================
  // 3. THREE.JS SCENE SETUP (Transparent WebGL Background gl={{ alpha: true }})
  // =========================================================================
  useEffect(() => {
    if (!isOpen || !threeMountRef.current) return;

    const mount = threeMountRef.current;
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // Scene, Camera, Transparent WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = null; // No background color, ensures video behind is visible!

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // gl={{ alpha: true }}
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0); // 100% transparent clear color
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Subtle Sci-Fi Ambience Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f2fe, 3.8);
    cyanLight.position.set(4, 6, 6);
    scene.add(cyanLight);

    const magentaLight = new THREE.DirectionalLight(0xec4899, 2.8);
    magentaLight.position.set(-5, -4, -4);
    scene.add(magentaLight);

    const modelRootGroup = new THREE.Group();
    scene.add(modelRootGroup);

    threeStateRef.current = {
      scene,
      camera,
      renderer,
      modelRootGroup,
      width,
      height
    };

    const handleResize = () => {
      if (!threeStateRef.current || !threeMountRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      threeStateRef.current.width = w;
      threeStateRef.current.height = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [isOpen]);

  // Switch Active 3D Model
  useEffect(() => {
    if (!threeStateRef.current) return;
    const { modelRootGroup } = threeStateRef.current;

    while (modelRootGroup.children.length > 0) {
      const obj = modelRootGroup.children[0];
      modelRootGroup.remove(obj);
    }

    const builderObj = MODEL_BUILDERS[activeModelIndex];
    if (builderObj && builderObj.builder) {
      const modelData = builderObj.builder();
      modelRootGroup.add(modelData.group);
      activeModelDataRef.current = modelData;
    }
  }, [activeModelIndex]);

  // =========================================================================
  // 4. ANIMATION & CONFLICT-FREE GESTURE RECOGNITION LOOP
  // =========================================================================
  useEffect(() => {
    if (!isOpen) return;

    let frameCount = 0;
    let lastFpsCalc = performance.now();
    let currentFps = 60;

    const renderLoop = () => {
      animationFrameRef.current = requestAnimationFrame(renderLoop);

      const now = performance.now();
      frameCount++;
      if (now - lastFpsCalc >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (now - lastFpsCalc));
        frameCount = 0;
        lastFpsCalc = now;
      }

      const hudCanvas = hudCanvasRef.current;
      const video = videoRef.current;
      const threeState = threeStateRef.current;
      const landmarker = handLandmarkerRef.current;
      const gState = gestureStateRef.current;

      if (hudCanvas && (hudCanvas.width !== window.innerWidth || hudCanvas.height !== window.innerHeight)) {
        hudCanvas.width = window.innerWidth;
        hudCanvas.height = window.innerHeight;
      }

      const ctx = hudCanvas ? hudCanvas.getContext('2d') : null;
      if (ctx && hudCanvas) {
        ctx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
      }

      // -----------------------------------------------------------
      // MediaPipe Detection: ONLY when isVideoReady & video.videoWidth > 0
      // -----------------------------------------------------------
      if (
        isVideoReady &&
        landmarker &&
        video &&
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        video.readyState >= 2 &&
        !video.paused
      ) {
        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          try {
            const results = landmarker.detectForVideo(video, now);
            if (results && results.landmarks) {
              lastLandmarksRef.current = results.landmarks;
            }
          } catch (e) {
            console.warn("detectForVideo error:", e);
          }
        }
      }

      const detectedHands = isVideoReady ? (lastLandmarksRef.current || []) : [];
      gState.handsCount = detectedHands.length;
      let activeGestureName = 'IDLE';

      // -----------------------------------------------------------
      // HAND GESTURES & 2D HUD DRAWING (Cleanly Separated)
      // -----------------------------------------------------------
      if (ctx && hudCanvas) {
        const cw = hudCanvas.width;
        const ch = hudCanvas.height;
        const handCenters = [];

        // Helper Euclidean distance
        const dist2D = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

        // Process landmarks for detected hands
        const processedHands = detectedHands.map((landmarks) => {
          // Map to mirrored screen coordinates: (1 - x) * cw
          const pts = landmarks.map(lm => ({
            x: (1 - lm.x) * cw,
            y: lm.y * ch,
            z: lm.z
          }));
          const palmCenter = {
            x: (pts[0].x + pts[5].x + pts[9].x + pts[13].x + pts[17].x) / 5,
            y: (pts[0].y + pts[5].y + pts[9].y + pts[13].y + pts[17].y) / 5
          };
          return { pts, palmCenter };
        });

        // -----------------------------------------------------------
        // CASE A: 2 HANDS DETECTED (Two-Hand Spread Explode)
        // Disable single-hand zoom and rotate while 2 hands are active!
        // -----------------------------------------------------------
        if (processedHands.length >= 2) {
          gState.lastPalmPoint = null;
          gState.isZooming = false;

          const h1 = processedHands[0].palmCenter;
          const h2 = processedHands[1].palmCenter;
          const distancePx = dist2D(h1, h2);
          const normDist = distancePx / cw;

          const minSpread = 0.16;
          const maxSpread = 0.62;
          const mappedExplode = Math.max(0, Math.min(1, (normDist - minSpread) / (maxSpread - minSpread)));

          gState.targetExplode = mappedExplode;
          activeGestureName = `👐 2-HAND PULL [${(mappedExplode * 100).toFixed(0)}%]`;

          // Draw Glowing Laser Link between hands
          ctx.save();
          const gradient = ctx.createLinearGradient(h1.x, h1.y, h2.x, h2.y);
          gradient.addColorStop(0, '#00f2fe');
          gradient.addColorStop(0.5, '#ffffff');
          gradient.addColorStop(1, '#f59e0b');

          ctx.beginPath();
          ctx.moveTo(h1.x, h1.y);
          ctx.lineTo(h2.x, h2.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2.5;
          ctx.setLineDash([8, 8]);
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Center HUD badge along laser line
          const midX = (h1.x + h2.x) / 2;
          const midY = (h1.y + h2.y) / 2;
          ctx.fillStyle = 'rgba(7, 10, 18, 0.92)';
          ctx.strokeStyle = '#00f2fe';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.roundRect(midX - 75, midY - 14, 150, 28, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#00f2fe';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`✦ EXPLODE: ${(mappedExplode * 100).toFixed(0)}% ✦`, midX, midY);
          ctx.restore();
        } 
        // -----------------------------------------------------------
        // CASE B: 1 HAND DETECTED (Two-Finger Zoom OR Palm Move Rotate)
        // -----------------------------------------------------------
        else if (processedHands.length === 1) {
          const { pts, palmCenter } = processedHands[0];
          const wrist = pts[0];

          // Determine finger curl states
          // A finger is curled down when fingertip is closer to wrist than PIP joint
          const isCurled = (tipIdx, pipIdx) => dist2D(pts[tipIdx], wrist) < dist2D(pts[pipIdx], wrist) * 1.05;
          
          const middleCurled = isCurled(12, 10);
          const ringCurled = isCurled(16, 14);
          const pinkyCurled = isCurled(20, 18);
          const indexExtended = dist2D(pts[8], wrist) > dist2D(pts[6], wrist) * 1.1;

          // Trigger zoom ONLY when middle, ring, and pinky fingers are curled down
          const isTwoFingerZoomPose = middleCurled && ringCurled && pinkyCurled && indexExtended;

          if (isTwoFingerZoomPose) {
            // =======================================================
            // 1. TWO-FINGER ZOOM (Thumb Tip 4 to Index Tip 8)
            // =======================================================
            gState.lastPalmPoint = null; // Do not rotate while zooming!
            gState.isZooming = true;

            const fingerDist = dist2D(pts[4], pts[8]);
            const normFingerDist = fingerDist / Math.min(cw, ch);

            // Map distance to scale between 0.6x (pinched) and 2.2x (fingers spread wide)
            const minSpread = 0.04;
            const maxSpread = 0.25;
            const t = Math.max(0, Math.min(1, (normFingerDist - minSpread) / (maxSpread - minSpread)));
            const targetScale = 0.6 + t * (2.2 - 0.6);
            gState.targetScale = targetScale;

            activeGestureName = `✌ 2-FINGER ZOOM [${gState.currentScale.toFixed(1)}x]`;

            // Draw glowing cyan line connecting thumb tip and index tip
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[4].x, pts[4].y);
            ctx.lineTo(pts[8].x, pts[8].y);
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([5, 5]);
            ctx.shadowColor = '#00f2fe';
            ctx.shadowBlur = 12;
            ctx.stroke();

            // Glowing circles on thumb & index tips
            [4, 8].forEach(tipIdx => {
              ctx.beginPath();
              ctx.arc(pts[tipIdx].x, pts[tipIdx].y, 6, 0, Math.PI * 2);
              ctx.fillStyle = '#00f2fe';
              ctx.fill();
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            });

            // Floating zoom label right next to the fingers
            const midX = (pts[4].x + pts[8].x) / 2;
            const midY = (pts[4].y + pts[8].y) / 2;
            const badgeWidth = 96;
            const badgeHeight = 24;
            ctx.fillStyle = 'rgba(6, 12, 24, 0.92)';
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1.2;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.roundRect(midX + 16, midY - 12, badgeWidth, badgeHeight, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#00f2fe';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`ZOOM ${gState.currentScale.toFixed(1)}x`, midX + 23, midY);
            ctx.restore();

          } else {
            // =======================================================
            // 2. 1-HAND OPEN PALM MOVE: ROTATES 3D MODEL
            // =======================================================
            gState.isZooming = false;

            if (gState.lastPalmPoint) {
              const deltaX = (palmCenter.x - gState.lastPalmPoint.x) / cw;
              const deltaY = (palmCenter.y - gState.lastPalmPoint.y) / ch;
              gState.targetRotY += deltaX * 3.8;
              gState.targetRotX += deltaY * 3.8;
            }
            gState.lastPalmPoint = palmCenter;
            activeGestureName = '✋ PALM MOVE (ROTATING)';
          }
        } else {
          // 0 hands
          gState.lastPalmPoint = null;
          gState.isZooming = false;
        }

        // Draw standard hand skeleton & landmark reticles for all visible hands
        processedHands.forEach(({ pts, palmCenter }, hIdx) => {
          const isPrimary = hIdx === 0;
          const strokeColor = isPrimary ? '#00f2fe' : '#f59e0b';
          const glowColor = isPrimary ? 'rgba(0, 242, 254, 0.45)' : 'rgba(245, 158, 11, 0.45)';

          // Sleek Concentric HUD Reticle
          const timeSec = now * 0.0025;
          ctx.save();
          ctx.translate(palmCenter.x, palmCenter.y);

          ctx.beginPath();
          ctx.arc(0, 0, 36, 0, Math.PI * 2);
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.stroke();

          ctx.rotate(timeSec * (isPrimary ? 1 : -1));
          ctx.beginPath();
          for (let a = 0; a < 4; a++) {
            const angle = (a * Math.PI) / 2;
            const tx = Math.cos(angle) * 36;
            const ty = Math.sin(angle) * 36;
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx + Math.cos(angle) * 8, ty + Math.sin(angle) * 8);
          }
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();

          // Palm Triangles
          ctx.save();
          const drawTriangle = (pA, pB, pC) => {
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.lineTo(pC.x, pC.y);
            ctx.closePath();
            ctx.fillStyle = isPrimary ? 'rgba(0, 242, 254, 0.08)' : 'rgba(245, 158, 11, 0.08)';
            ctx.fill();
            ctx.strokeStyle = isPrimary ? 'rgba(0, 242, 254, 0.55)' : 'rgba(245, 158, 11, 0.55)';
            ctx.lineWidth = 1;
            ctx.stroke();
          };

          drawTriangle(pts[0], pts[5], pts[9]);
          drawTriangle(pts[0], pts[9], pts[13]);
          drawTriangle(pts[0], pts[13], pts[17]);

          // Finger Bones
          const fingerConnections = [
            [0, 1, 2, 3, 4],     // Thumb
            [0, 5, 6, 7, 8],     // Index
            [0, 9, 10, 11, 12],  // Middle
            [0, 13, 14, 15, 16], // Ring
            [0, 17, 18, 19, 20]  // Pinky
          ];

          ctx.strokeStyle = isPrimary ? 'rgba(0, 242, 254, 0.35)' : 'rgba(245, 158, 11, 0.35)';
          ctx.lineWidth = 1.5;
          fingerConnections.forEach(chain => {
            ctx.beginPath();
            ctx.moveTo(pts[chain[0]].x, pts[chain[0]].y);
            for (let i = 1; i < chain.length; i++) {
              ctx.lineTo(pts[chain[i]].x, pts[chain[i]].y);
            }
            ctx.stroke();
          });

          // Fingertip points
          [4, 8, 12, 16, 20].forEach(tipIdx => {
            const tip = pts[tipIdx];
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          // Hand Tag
          ctx.fillStyle = strokeColor;
          ctx.font = '10px monospace';
          ctx.fillText(`[HAND: ${isPrimary ? 'ALPHA' : 'BETA'}]`, pts[0].x - 30, pts[0].y + 26);
          ctx.restore();
        });
      }

      // -----------------------------------------------------------
      // ZERO-JITTER LERP SMOOTHING (EMA Filter)
      // -----------------------------------------------------------
      const lerpFactor = 0.14;
      gState.currentExplode += (gState.targetExplode - gState.currentExplode) * lerpFactor;
      gState.currentRotX += (gState.targetRotX - gState.currentRotX) * 0.12;
      gState.currentRotY += (gState.targetRotY - gState.currentRotY) * 0.12;
      gState.currentScale += (gState.targetScale - gState.currentScale) * 0.14;

      if (autoRotate && !gState.isZooming && processedHandsCount(detectedHands) === 0) {
        gState.targetRotY += 0.006;
      }

      // -----------------------------------------------------------
      // Update Three.js Model & Project Component Callouts
      // -----------------------------------------------------------
      if (threeState && activeModelDataRef.current) {
        const { camera, renderer, scene, modelRootGroup, width, height } = threeState;
        const modelData = activeModelDataRef.current;

        // Apply smooth orientation and smooth zoom scale
        modelRootGroup.rotation.x = gState.currentRotX;
        modelRootGroup.rotation.y = gState.currentRotY;
        modelRootGroup.scale.setScalar(gState.currentScale);

        const curExp = gState.currentExplode;
        const newProjected = [];

        modelData.components.forEach(comp => {
          if (comp.object) {
            comp.object.position.copy(comp.basePosition).addScaledVector(comp.explodeOffset, curExp);
          }

          if (comp.anchorLocal && camera) {
            const worldVec = comp.anchorLocal.clone();
            comp.object.localToWorld(worldVec);
            worldVec.project(camera);

            const screenX = ((worldVec.x + 1) / 2) * width;
            const screenY = ((-worldVec.y + 1) / 2) * height;
            const isVisible = worldVec.z < 1.0;

            if (isVisible) {
              newProjected.push({
                id: comp.id,
                name: comp.name,
                badge: comp.badge,
                color: comp.color,
                desc: comp.desc,
                sx: screenX,
                sy: screenY,
                dist: worldVec.z
              });
            }
          }
        });

        renderer.render(scene, camera);
        setProjectedLabels(newProjected);
      }

      // Sync state to UI (throttled)
      if (frameCount % 6 === 0) {
        setTrackingInfo({
          handsDetected: detectedHands.length,
          gesture: !isVideoReady 
            ? 'INITIALIZING CAMERA...' 
            : (detectedHands.length === 0 
                ? (webcamError ? 'MOUSE / SLIDER ACTIVE' : 'NO HANDS DETECTED') 
                : activeGestureName),
          fps: currentFps,
          explodePercent: Math.round(gState.currentExplode * 100),
          zoomScale: parseFloat(gState.currentScale.toFixed(1)),
        });
        setExplodeSliderVal(gState.currentExplode);
      }
    };

    function processedHandsCount(hands) {
      return hands ? hands.length : 0;
    }

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isVideoReady, autoRotate, webcamError]);

  // =========================================================================
  // 5. FALLBACK INTERACTIVE CONTROLS (Mouse Drag & Wheel Zoom)
  // =========================================================================
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    gestureStateRef.current.targetRotY += dx * 0.008;
    gestureStateRef.current.targetRotX += dy * 0.008;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    // Smooth zoom via scroll wheel fallback
    gestureStateRef.current.targetScale = Math.max(
      0.5,
      Math.min(2.5, gestureStateRef.current.targetScale - e.deltaY * 0.0015)
    );
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setExplodeSliderVal(val);
    gestureStateRef.current.targetExplode = val;
  };

  const handleResetView = () => {
    gestureStateRef.current.targetRotX = 0.2;
    gestureStateRef.current.targetRotY = -0.4;
    gestureStateRef.current.targetExplode = 0.45;
    gestureStateRef.current.targetScale = 1.0;
  };

  if (!isOpen) return null;

  const activeModelMeta = MODEL_BUILDERS[activeModelIndex];

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="fixed inset-0 z-[100] overflow-hidden bg-black select-none cursor-grab active:cursor-grabbing font-sans"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. SOLID LIVE WEBCAM VIDEO (opacity-100, brightness-75)       */}
      {/* ------------------------------------------------------------- */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="fixed inset-0 w-full h-full object-cover -scale-x-100 z-0 opacity-100 filter brightness-75"
        style={{
          opacity: 1,
          filter: 'brightness(0.75)',
          objectFit: 'cover',
          transform: 'scaleX(-1)'
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* 2. THREE.JS 3D CANVAS MOUNT (z-10, Transparent gl={{alpha:true}})*/}
      {/* ------------------------------------------------------------- */}
      <div
        ref={threeMountRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* ------------------------------------------------------------- */}
      {/* 3. 2D HUD OVERLAY CANVAS (Hand tracking geometric rings) (z-20) */}
      {/* ------------------------------------------------------------- */}
      <canvas
        ref={hudCanvasRef}
        className="fixed inset-0 pointer-events-none w-full h-full z-20"
      />

      {/* ------------------------------------------------------------- */}
      {/* 4. FLOATING LEADER-LINE HTML CALLOUT BADGES (z-30)           */}
      {/* ------------------------------------------------------------- */}
      {showCallouts && projectedLabels.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {projectedLabels.map((lbl, idx) => {
            const sx = lbl.sx;
            const sy = lbl.sy;
            const cardWidth = 240;
            const isRightSide = sx < window.innerWidth * 0.52;

            // Smart header avoidance: Header occupies top-left (left: 0..390px, top: 0..115px)
            let cardLeft, cardTop;

            if (isRightSide) {
              cardLeft = Math.min(window.innerWidth - cardWidth - 24, sx + 65);
              if (cardLeft < 390 && sy < 115) {
                cardLeft = 400; // Nudge safely inward to the right of header
              }
            } else {
              cardLeft = Math.max(20, sx - cardWidth - 65);
            }

            cardTop = Math.max(24, sy - 28);
            if (cardLeft < 390 && cardTop < 115) {
              cardTop = 118; // Nudge down below the header
              if (cardLeft < 100) cardLeft = 100;
            }

            cardTop = Math.max(105, Math.min(window.innerHeight - 170, cardTop));
            cardLeft = Math.max(20, Math.min(window.innerWidth - cardWidth - 20, cardLeft));

            const elbowX = cardLeft > sx ? cardLeft - 10 : cardLeft + cardWidth + 10;
            const elbowY = cardTop + 24;

            const explodeAlpha = Math.max(0.12, Math.min(1, (gestureStateRef.current.currentExplode - 0.1) / 0.35));

            return (
              <div 
                key={lbl.id || idx}
                style={{ opacity: explodeAlpha }}
                className="absolute transition-opacity duration-150"
              >
                {/* SVG Leader line */}
                <svg 
                  className="absolute top-0 left-0 overflow-visible pointer-events-none"
                  style={{ width: 1, height: 1 }}
                >
                  <circle cx={sx} cy={sy} r="3.5" fill={lbl.color} />
                  <circle cx={sx} cy={sy} r="8" fill="none" stroke={lbl.color} strokeWidth="1" strokeDasharray="3 3" />
                  <path
                    d={`M ${sx} ${sy} L ${elbowX} ${elbowY} L ${cardLeft > sx ? cardLeft : cardLeft + cardWidth} ${elbowY}`}
                    fill="none"
                    stroke={lbl.color}
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                </svg>

                {/* Glassmorphic Callout Card */}
                <div
                  style={{
                    left: cardLeft,
                    top: cardTop,
                    width: cardWidth
                  }}
                  className="absolute pointer-events-auto bg-[#070b14]/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 shadow-2xl text-left transform transition-transform duration-75 hover:scale-105"
                >
                  <div className="flex items-center space-x-1.5 pb-1">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse" 
                      style={{ backgroundColor: lbl.color, boxShadow: `0 0 8px ${lbl.color}` }}
                    />
                    <span className="font-mono text-[11px] font-bold text-white tracking-wide truncate">
                      {lbl.name}
                    </span>
                  </div>
                  <div 
                    className="inline-block text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border mb-1.5"
                    style={{
                      borderColor: `${lbl.color}55`,
                      backgroundColor: `${lbl.color}15`,
                      color: lbl.color
                    }}
                  >
                    {lbl.badge}
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    {lbl.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. TOP HUD BAR: BRAND, METRICS, CLOSE BUTTON (z-40)           */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
        
        {/* Left: AR Mode Title & Status */}
        <div className="flex items-center space-x-3 bg-[#080d1a]/85 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-4 py-2.5 shadow-glow-cyan">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white tracking-wider">
                AR HOLOGRAM VIEW
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                {activeModelMeta.title}
              </span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-2">
              <span>{trackingInfo.gesture}</span>
              <span>&bull;</span>
              <span>{trackingInfo.fps} FPS</span>
            </div>
          </div>
        </div>

        {/* Center: Live Gesture Instruction Pill (Conflict-Free Guide) */}
        <div className="hidden lg:flex items-center space-x-4 bg-[#080d1a]/85 backdrop-blur-md border border-slate-800 rounded-full px-5 py-2 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span>✌ 2-Finger Spread: Zoom ({trackingInfo.zoomScale}x)</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5 text-amber-300">
            <span>✋ Palm Move: Rotate</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span>👐 2-Hand Pull: Explode ({trackingInfo.explodePercent}%)</span>
          </div>
        </div>

        {/* Right: Quick Controls & Close Button */}
        <div className="flex items-center space-x-2.5">
          {/* Toggle Webcam */}
          <button
            onClick={() => setIsWebcamEnabled(!isWebcamEnabled)}
            title={isWebcamEnabled ? "Disable Webcam" : "Enable Webcam"}
            className={`p-2.5 rounded-xl border transition-all ${
              isWebcamEnabled 
                ? 'bg-slate-900/80 border-slate-700 text-cyan-400 hover:bg-slate-800' 
                : 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900'
            }`}
          >
            {isWebcamEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
          </button>

          {/* Toggle Callouts */}
          <button
            onClick={() => setShowCallouts(!showCallouts)}
            title="Toggle Component Labels"
            className={`p-2.5 rounded-xl border transition-all ${
              showCallouts 
                ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300' 
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetView}
            title="Reset Orientation & Scale"
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Exit Fullscreen AR Mode */}
          <button
            onClick={handleExitAR}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-rose-900/50"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit AR</span>
          </button>
        </div>

      </header>

      {/* ------------------------------------------------------------- */}
      {/* 6. WEBCAM OFFLINE / LOADING NOTICES                          */}
      {/* ------------------------------------------------------------- */}
      {isMediaPipeLoading && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-cyan-950/90 border border-cyan-600/60 text-cyan-200 px-4 py-2 rounded-full font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-xl animate-pulse">
          <Activity className="w-4 h-4 animate-spin" />
          <span>Spinning up MediaPipe GPU Vision Pipeline...</span>
        </div>
      )}

      {webcamError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-amber-500/40 text-amber-200 px-4 py-2 rounded-xl font-mono text-xs flex items-center gap-2.5 backdrop-blur-md shadow-xl max-w-md">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{webcamError}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. BOTTOM CONTROLS & MODEL SWITCHER PILL BAR (z-40)           */}
      {/* ------------------------------------------------------------- */}
      <footer className="fixed bottom-6 left-0 right-0 z-40 flex flex-col items-center space-y-3 pointer-events-auto px-4">
        
        {/* Fallback Explode Slider & Scale Metrics */}
        <div className="flex items-center space-x-4 bg-[#080d1a]/85 backdrop-blur-md border border-slate-800 rounded-full px-5 py-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Explode:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodeSliderVal}
            onChange={handleSliderChange}
            className="w-32 sm:w-48 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-cyan-300 font-bold w-10 text-right">
            {(explodeSliderVal * 100).toFixed(0)}%
          </span>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          {/* Current Zoom Readout */}
          <div className="flex items-center gap-1 font-mono text-slate-300 text-[11px]">
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>{trackingInfo.zoomScale}x</span>
          </div>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 rounded-full font-mono text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              autoRotate 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>Orbit</span>
          </button>
        </div>

        {/* 5-Model Switching Glassmorphic Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full p-1.5 bg-[#070b14]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
          {MODEL_BUILDERS.map((model, idx) => {
            const isActive = activeModelIndex === idx;
            return (
              <button
                key={model.id}
                onClick={() => setActiveModelIndex(idx)}
                className={`relative px-4 py-2 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all duration-200 flex flex-col items-center ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-white border shadow-lg scale-105' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
                style={{
                  borderColor: isActive ? model.accent : 'transparent',
                  boxShadow: isActive ? `0 0 16px ${model.accent}40` : 'none'
                }}
              >
                <div className="flex items-center space-x-1.5">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: model.accent }} 
                  />
                  <span>{model.title}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-normal">
                  {model.subtitle}
                </span>
              </button>
            );
          })}
        </div>

      </footer>

    </div>
  );
}
