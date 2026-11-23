import React, { useState, useEffect, useRef } from 'react';
import MagneticBackground from './components/MagneticBackground';
import Stage1MotorSwappers from './components/Stage1MotorSwappers';
import Stage2Tetrataenite from './components/Stage2Tetrataenite';
import Stage3Curvilinear from './components/Stage3Curvilinear';
import Stage4Superconductors from './components/Stage4Superconductors';
import Stage5Altermagnetism from './components/Stage5Altermagnetism';
import Tab3MOFCOMChecker from './components/Tab3MOFCOMChecker';
import { 
  Zap, 
  AlertOctagon, 
  Atom, 
  ThermometerSnowflake, 
  Sparkles, 
  ShieldCheck, 
  Globe2, 
  ChevronRight, 
  Sliders, 
  Maximize2,
  X,
  Compass,
  Layers,
  ArrowUp,
  Cpu
} from 'lucide-react';

export default function App() {
  const [activeStage, setActiveStage] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pricingScenario, setPricingScenario] = useState('china');
  const [isMofcomModalOpen, setIsMofcomModalOpen] = useState(false);

  // References for smooth scroll navigation
  const stageRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
    4: useRef(null),
    5: useRef(null),
    mofcom: useRef(null)
  };

  const scrollToStage = (stageKey) => {
    const el = stageRefs[stageKey]?.current;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll listener to update timeline progress and active stage
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalScroll > 0 ? Math.min(1, Math.max(0, currentScroll / totalScroll)) : 0;
      setScrollProgress(progress);

      // Determine active stage based on position
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      for (let s = 5; s >= 1; s--) {
        const el = stageRefs[s]?.current;
        if (el && el.offsetTop <= scrollY) {
          setActiveStage(s);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stages = [
    { id: 1, title: 'Stage 1: Motor Swappers', subtitle: 'TODAY (2026)', icon: Zap, color: 'cyan' },
    { id: 2, title: 'Stage 2: Tetrataenite Warning', subtitle: 'CAUTION', icon: AlertOctagon, color: 'rose' },
    { id: 3, title: 'Stage 3: Curvilinear Magnetism', subtitle: 'NEAR FUTURE', icon: Atom, color: 'blue' },
    { id: 4, title: 'Stage 4: MgB₂ Superconductors', subtitle: 'HEAVY INDUSTRY', icon: ThermometerSnowflake, color: 'violet' },
    { id: 5, title: 'Stage 5: Altermagnetism', subtitle: '2030+ HORIZON', icon: Sparkles, color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* 3D Interactive Magnetic Field Canvas (Reacts to scroll & mouse) */}
      <MagneticBackground currentStage={activeStage} scrollProgress={scrollProgress} />

      {/* Sticky Pitch Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#06080d]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Title & Pitch Badge */}
            <div className="flex items-center space-x-3.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-violet-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="h-full w-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                  <Compass className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold tracking-tight text-lg text-white font-mono">
                    THE POST-RARE-EARTH <span className="text-cyan-400">ROADMAP</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                    LIVING PITCH
                  </span>
                </div>
                <p className="text-xs text-slate-400 tracking-normal hidden sm:block">
                  A Scroll-Driven 5-Stage Blueprint Beyond China's Magnet Monopoly
                </p>
              </div>
            </div>

            {/* Quick Actions: Global Pricing Scenario & Floating MOFCOM Trigger */}
            <div className="flex items-center space-x-3">
              
              {/* Scenario Toggle */}
              <div className="hidden md:flex items-center bg-[#0d1322] border border-slate-800 rounded-lg p-1 text-xs">
                <span className="text-slate-400 px-2 font-mono flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                  Scenario:
                </span>
                <button
                  onClick={() => setPricingScenario('china')}
                  className={`px-3 py-1 rounded-md transition-all font-mono font-medium ${
                    pricingScenario === 'china'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  China Domestic
                </button>
                <button
                  onClick={() => setPricingScenario('exChinaStress')}
                  className={`px-3 py-1 rounded-md transition-all font-mono font-medium ${
                    pricingScenario === 'exChinaStress'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  2026 Ex-China (Dy 7.5x)
                </button>
              </div>

              {/* Floating Quick Tool Trigger */}
              <button
                onClick={() => setIsMofcomModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 transition-all text-xs font-mono font-semibold shadow-glow-rose"
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>MOFCOM Radar</span>
              </button>
            </div>

          </div>

          {/* Quick-Jump Timeline Navigation Bar */}
          <div className="flex items-center space-x-2 border-t border-slate-800/60 py-2 overflow-x-auto no-scrollbar text-xs">
            {stages.map((st) => {
              const Icon = st.icon;
              const isActive = activeStage === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => scrollToStage(st.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-mono ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="font-semibold">{st.title}</span>
                  <span className="text-[10px] text-slate-400 hidden lg:inline">
                    &bull; {st.subtitle}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => scrollToStage('mofcom')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/30 border border-rose-500/20 font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>MOFCOM Compliance</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container with Glowing Vertical Spine */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Living Timeline Grid Layout: Left Spine + Right Content Sections */}
        <div className="relative">
          
          {/* Animated Vertical Glowing Spine (Desktop) */}
          <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-1 bg-slate-800/80 rounded-full overflow-hidden">
            <div 
              className="w-full bg-gradient-to-b from-cyan-400 via-violet-400 to-pink-500 shadow-glow-cyan transition-all duration-300"
              style={{ height: `${Math.max(6, scrollProgress * 100)}%` }}
            />
          </div>

          <div className="space-y-24 lg:pl-20">
            
            {/* STAGE 1: THE MOTOR SWAPPERS */}
            <section ref={stageRefs[1]} className="scroll-mt-28 relative">
              {/* Glowing Timeline Marker */}
              <div className="hidden lg:flex absolute -left-[76px] top-6 w-10 h-10 rounded-full bg-[#080d17] border-2 border-cyan-400 items-center justify-center shadow-glow-cyan text-cyan-300 font-mono text-xs font-bold">
                01
              </div>
              <Stage1MotorSwappers 
                pricingScenario={pricingScenario} 
                setPricingScenario={setPricingScenario} 
              />
            </section>

            {/* STAGE 2: TETRATAENITE - THE COSMIC CAUTIONARY TALE */}
            <section ref={stageRefs[2]} className="scroll-mt-28 relative">
              <div className="hidden lg:flex absolute -left-[76px] top-6 w-10 h-10 rounded-full bg-[#080d17] border-2 border-rose-500 items-center justify-center shadow-glow-rose text-rose-400 font-mono text-xs font-bold">
                02
              </div>
              <Stage2Tetrataenite />
            </section>

            {/* STAGE 3: CURVILINEAR MAGNETISM */}
            <section ref={stageRefs[3]} className="scroll-mt-28 relative">
              <div className="hidden lg:flex absolute -left-[76px] top-6 w-10 h-10 rounded-full bg-[#080d17] border-2 border-cyan-400 items-center justify-center shadow-glow-cyan text-cyan-300 font-mono text-xs font-bold">
                03
              </div>
              <Stage3Curvilinear />
            </section>

            {/* STAGE 4: MGB2 SUPERCONDUCTORS */}
            <section ref={stageRefs[4]} className="scroll-mt-28 relative">
              <div className="hidden lg:flex absolute -left-[76px] top-6 w-10 h-10 rounded-full bg-[#080d17] border-2 border-violet-400 items-center justify-center shadow-glow-cyan text-violet-300 font-mono text-xs font-bold">
                04
              </div>
              <Stage4Superconductors />
            </section>

            {/* STAGE 5: ALTERMAGNETISM */}
            <section ref={stageRefs[5]} className="scroll-mt-28 relative">
              <div className="hidden lg:flex absolute -left-[76px] top-6 w-10 h-10 rounded-full bg-[#080d17] border-2 border-pink-400 items-center justify-center shadow-glow-cyan text-pink-300 font-mono text-xs font-bold">
                05
              </div>
              <Stage5Altermagnetism />
            </section>

            {/* TERMINAL WIDGET: MOFCOM EXPORT COMPLIANCE CHECKER */}
            <section ref={stageRefs.mofcom} className="scroll-mt-28 relative pt-6 border-t border-slate-800">
              <div className="hidden lg:flex absolute -left-[76px] top-12 w-10 h-10 rounded-full bg-[#080d17] border-2 border-rose-500 items-center justify-center shadow-glow-rose text-rose-400 font-mono text-xs font-bold">
                QC
              </div>
              <Tab3MOFCOMChecker />
            </section>

          </div>

        </div>

      </main>

      {/* Floating Bottom Navigation HUD */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
        
        {/* Scroll To Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all shadow-xl backdrop-blur-md"
          title="Return to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {/* Floating MOFCOM Quick-Tool Button */}
        <button
          onClick={() => setIsMofcomModalOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-mono text-xs font-bold shadow-2xl shadow-rose-950 hover:scale-105 transition-all border border-rose-400/40"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Launch MOFCOM Radar</span>
        </button>

      </div>

      {/* Floating Modal for MOFCOM Quick-Tool */}
      {isMofcomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d16] border border-rose-500/40 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  MOFCOM Export Compliance &amp; De Minimis Quick Radar
                </h3>
              </div>
              <button
                onClick={() => setIsMofcomModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Tab3MOFCOMChecker />
          </div>
        </div>
      )}

      {/* Pitch Demo Footer */}
      <footer className="border-t border-slate-900 bg-[#05070a] py-8 text-xs text-slate-400 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
              &mu;
            </div>
            <div>
              <div className="text-slate-300 font-semibold font-mono">
                The Post-Rare-Earth Roadmap &bull; Technical Memorandum
              </div>
              <div className="text-[11px] text-slate-400">
                Data sources: MOFCOM Dual-Use Catalog 2025-2027, Nature / Cambridge Tetrataenite Retraction Dec 2024, Physical Review X (Altermagnetism).
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scroll-Driven Roadmap Active</span>
            </div>
            <span className="text-slate-400">Three.js + Recharts + WebGL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
