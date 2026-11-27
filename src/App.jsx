import React, { useState, useEffect, useRef } from 'react';
import RightStageCanvas from './components/RightStageCanvas';
import SlideOverDrawer from './components/SlideOverDrawer';
import Tab1Simulator from './components/Tab1Simulator';
import Stage2Tetrataenite from './components/Stage2Tetrataenite';
import Stage3Curvilinear from './components/Stage3Curvilinear';
import Stage4Superconductors from './components/Stage4Superconductors';
import Stage5Altermagnetism from './components/Stage5Altermagnetism';
import Tab3MOFCOMChecker from './components/Tab3MOFCOMChecker';
import ARHologramMode from './components/ar/ARHologramMode';
import { 
  Zap, 
  AlertOctagon, 
  Atom, 
  ThermometerSnowflake, 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  ArrowRight,
  Compass,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [activeStage, setActiveStage] = useState(1);
  const [activeDrawer, setActiveDrawer] = useState(null); // 'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'mofcom'
  const [pricingScenario, setPricingScenario] = useState('china');
  const [isAROpen, setIsAROpen] = useState(false);

  // Stage section refs
  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Scroll spy to detect active stage
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.45;
      for (let i = sectionRefs.length - 1; i >= 0; i--) {
        const el = sectionRefs[i]?.current;
        if (el && el.offsetTop <= scrollY) {
          setActiveStage(i + 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStage = (idx) => {
    const el = sectionRefs[idx]?.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stage Storytelling Data (Strict Apple-style minimalism)
  const stagesData = [
    {
      id: 1,
      number: '01',
      badge: 'TODAY (2026)',
      headline: 'The Motor Swappers',
      sentence: 'Automakers bypass rare earths today using copper wound-rotors and low-cost ferrite reluctance architectures.',
      pills: ['0% NdFeB Required', '+96% Highway Eff'],
      toolLabel: 'Open TCO Simulator & Data',
      drawerId: 'stage1',
      accent: 'cyan'
    },
    {
      id: 2,
      number: '02',
      badge: 'THE WARNING',
      headline: 'The Cosmic Cautionary Tale',
      sentence: 'Cambridge’s rapid tetrataenite claim was formally retracted after testing proved phosphorus contamination created false-positive ordering peaks.',
      pills: ['Dec 2024 Retraction', '0.1% P Artifact'],
      toolLabel: 'Inspect Retraction & Chemistry',
      drawerId: 'stage2',
      accent: 'rose'
    },
    {
      id: 3,
      number: '03',
      badge: 'NEAR FUTURE',
      headline: 'Hardness by Geometry',
      sentence: 'Shape anisotropy in Fe-Ni-P nanowires boosts coercivity toward 440 Oe without rare earth elements.',
      pills: ['440 Oe Lab Benchmark', 'Fe-Ni-P Nanowires'],
      toolLabel: 'Open Shape Anisotropy Lab',
      drawerId: 'stage3',
      accent: 'cyan'
    },
    {
      id: 4,
      number: '04',
      badge: 'HEAVY INDUSTRY',
      headline: 'Delete the Magnet',
      sentence: 'Liquid hydrogen at 20K cools zero-resistance MgB₂ coils, delivering 61% higher power density for heavy transit.',
      pills: ['20K Liquid H₂ Coolant', '+61% Power Density'],
      toolLabel: 'Explore Superconductor Specs',
      drawerId: 'stage4',
      accent: 'cyan'
    },
    {
      id: 5,
      number: '05',
      badge: '2030+ HORIZON',
      headline: 'The Third Magnetism',
      sentence: 'Altermagnetism pairs zero net magnetization with spin-split electron bands, positioning India to leapfrog traditional permanent magnets.',
      pills: ['Terahertz Switching', 'Zero Stray Fields'],
      toolLabel: 'Discover Altermagnetism Matrix',
      drawerId: 'stage5',
      accent: 'cyan'
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative">
      
      {/* Conditionally unmount main roadmap & 3D canvas when AR mode is active to prevent bleed-through and boost FPS */}
      {!isAROpen && (
        <>
          {/* Sleek Minimal Header */}
          <header className="fixed top-0 left-0 right-0 z-40 h-20 px-6 sm:px-12 flex items-center justify-between pointer-events-none">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-extrabold text-sm sm:text-base tracking-tight font-mono text-white">
            POST-RARE-EARTH <span className="text-cyan-400">ROADMAP</span>
          </span>
        </div>

        {/* Global Controls: Pricing Scenario & MOFCOM Radar */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          
          <div className="hidden md:flex items-center bg-[#0d1322]/80 backdrop-blur-md border border-slate-800 rounded-full p-1 text-xs">
            <span className="text-slate-400 px-3 font-mono text-[11px] flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              Scenario:
            </span>
            <button
              onClick={() => setPricingScenario('china')}
              className={`px-3 py-1 rounded-full transition-all font-mono font-medium text-[11px] ${
                pricingScenario === 'china'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              China Domestic
            </button>
            <button
              onClick={() => setPricingScenario('exChinaStress')}
              className={`px-3 py-1 rounded-full transition-all font-mono font-medium text-[11px] ${
                pricingScenario === 'exChinaStress'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2026 Ex-China (Dy 7.5x)
            </button>
          </div>

          <button
            onClick={() => setActiveDrawer('mofcom')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 transition-all text-xs font-mono font-semibold backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>MOFCOM Radar</span>
          </button>

          {/* AR Hand-Exploded Hologram Mode Button */}
          <button
            onClick={() => setIsAROpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-300 transition-all text-xs font-mono font-bold backdrop-blur-md shadow-glow-cyan group"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">AR Hologram Mode</span>
          </button>
        </div>

      </header>

      {/* Far-Left Vertical Progress Rail (5 Clickable Dots - Clean Minimal Dots without Overlapping Tooltips) */}
      <nav 
        aria-label="Stage Progress" 
        className="fixed left-6 sm:left-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-6"
      >
        {stagesData.map((st, idx) => {
          const isActive = activeStage === st.id;
          return (
            <button
              key={st.id}
              onClick={() => scrollToStage(idx)}
              className="group relative flex items-center justify-center p-1 focus:outline-none"
              title={`Stage ${st.number}: ${st.headline}`}
            >
              {/* Dot */}
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-cyan-400 scale-125 shadow-glow-cyan ring-4 ring-cyan-500/20' 
                    : 'bg-slate-700 hover:bg-slate-500 scale-100'
                }`} 
              />
            </button>
          );
        })}
      </nav>

      {/* Main Split Layout */}
      <div className="relative w-full">
        
        {/* Right Half: Persistent 3D Morphing Canvas */}
        <div className="hidden lg:block fixed right-0 top-0 w-1/2 h-screen z-20 pointer-events-auto">
          <RightStageCanvas activeStage={activeStage} />
        </div>

        {/* Left Half: 5 Full-Screen Storytelling Sections (100vh each) */}
        <div className="w-full lg:w-1/2 pl-16 sm:pl-28 pr-6 sm:pr-12 relative z-30">
          
          {stagesData.map((st, idx) => {
            return (
              <section
                key={st.id}
                ref={sectionRefs[idx]}
                className="h-screen flex flex-col justify-center items-start space-y-7 snap-start"
              >
                {/* Stage Badge */}
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 uppercase">
                    STAGE {st.number} • {st.badge}
                  </span>
                </div>

                {/* Big Headline (3-5 words) */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  {st.headline}
                </h2>

                {/* ONE Plain-English sentence (max 20 words) */}
                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-lg">
                  {st.sentence}
                </p>

                {/* 2 Tiny Stat Pills */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {st.pills.map((pill, pIdx) => (
                    <span 
                      key={pIdx}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono font-medium text-slate-200"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Action Button: Opens Glassmorphic Slide-over Drawer */}
                <div className="pt-3">
                  <button
                    onClick={() => setActiveDrawer(st.drawerId)}
                    className="flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#07090e] font-mono text-xs font-bold transition-all shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{st.toolLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </section>
            );
          })}

        </div>

      </div>

      {/* ========================================================= */}
      {/* FULLSCREEN 2-COLUMN VIRTUAL LABS                           */}
      {/* ========================================================= */}

      {/* Virtual Lab 1: Motor Swapper Live Dyno & TCO Simulator */}
      <SlideOverDrawer
        isOpen={activeDrawer === 'stage1'}
        onClose={() => setActiveDrawer(null)}
        title="Stage 01 Virtual Lab: Live Powertrain Dyno & BOM Simulator"
        badge="Stage 01 Virtual Lab"
      >
        <Tab1Simulator 
          pricingScenario={pricingScenario} 
          setPricingScenario={setPricingScenario} 
        />
      </SlideOverDrawer>

      {/* Virtual Lab 2: Phosphorus Contamination & XRD Superlattice Audit */}
      <SlideOverDrawer
        isOpen={activeDrawer === 'stage2'}
        onClose={() => setActiveDrawer(null)}
        title="Stage 02 Virtual Lab: Phosphorus Contamination & XRD Audit"
        badge="Stage 02 Virtual Lab"
      >
        <Stage2Tetrataenite />
      </SlideOverDrawer>

      {/* Virtual Lab 3: Curvilinear Shape Anisotropy Lab */}
      <SlideOverDrawer
        isOpen={activeDrawer === 'stage3'}
        onClose={() => setActiveDrawer(null)}
        title="Stage 03 Virtual Lab: Curvature Domain Pinning & 440 Oe Benchmark"
        badge="Stage 03 Virtual Lab"
      >
        <Stage3Curvilinear />
      </SlideOverDrawer>

      {/* Virtual Lab 4: MgB2 Superconductors Cryo Lab */}
      <SlideOverDrawer
        isOpen={activeDrawer === 'stage4'}
        onClose={() => setActiveDrawer(null)}
        title="Stage 04 Virtual Lab: MgB₂ Superconductor 20K Cryo Lab"
        badge="Stage 04 Virtual Lab"
      >
        <Stage4Superconductors />
      </SlideOverDrawer>

      {/* Virtual Lab 5: Altermagnetism Quantum Matrix */}
      <SlideOverDrawer
        isOpen={activeDrawer === 'stage5'}
        onClose={() => setActiveDrawer(null)}
        title="Stage 05 Virtual Lab: Terahertz Spintronics & Zero-Dipole Matrix"
        badge="Stage 05 Virtual Lab"
      >
        <Stage5Altermagnetism />
      </SlideOverDrawer>

      {/* Global Virtual Lab: MOFCOM Export Compliance Checker */}
      <SlideOverDrawer
        isOpen={activeDrawer === 'mofcom'}
        onClose={() => setActiveDrawer(null)}
        title="Customs Virtual Lab: MOFCOM Export Compliance & 0.1% De Minimis Engine"
        badge="Customs Virtual Lab"
      >
        <Tab3MOFCOMChecker />
      </SlideOverDrawer>
        </>
      )}

      {/* Fullscreen AR Hand-Exploded Hologram Mode */}
      <ARHologramMode
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
      />

    </div>
  );
}
