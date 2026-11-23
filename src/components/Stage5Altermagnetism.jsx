import React, { useState } from 'react';
import { 
  Sparkles, 
  Orbit, 
  Layers, 
  Atom, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Globe2, 
  Zap,
  Cpu
} from 'lucide-react';

export default function Stage5Altermagnetism() {
  const [selectedPhase, setSelectedPhase] = useState('altermagnet');

  const phases = {
    ferro: {
      id: 'ferro',
      name: '1. Ferromagnetism',
      era: 'Ancient Antiquity &bull; 1980s NdFeB',
      netMagnetization: 'High Net Dipole (M ≠ 0)',
      spinSplitting: 'Yes (Spin-Polarized Bands)',
      strayField: 'Strong Stray Field Interference',
      speed: '~GHz Switching Speed',
      chokepoint: 'Trapped in China Rare-Earth Monopoly (Nd, Dy, Tb)',
      color: 'rose'
    },
    antiferro: {
      id: 'antiferro',
      name: '2. Antiferromagnetism',
      era: '1930s (Louis Néel Nobel 1970)',
      netMagnetization: 'Zero Net Dipole (M = 0)',
      spinSplitting: 'No (Kramers Spin Degeneracy)',
      strayField: 'Zero Stray Field',
      speed: '~THz Switching Speed',
      chokepoint: 'Difficult to read/write without massive magnetic fields',
      color: 'slate'
    },
    altermagnet: {
      id: 'altermagnet',
      name: '3. Altermagnetism (The 3rd Form)',
      era: 'Discovered 2022–2024 &bull; Šmejkal et al.',
      netMagnetization: 'Zero Net Dipole (M = 0)',
      spinSplitting: 'YES (Strong d/g-wave Spin Splitting!)',
      strayField: 'Zero Stray Field & Crosstalk',
      speed: 'Terahertz (THz) &bull; 1,000x Faster',
      chokepoint: 'Zero Rare Earths Needed (Abundant Mn, Cr, Te, Ru)',
      color: 'cyan'
    }
  };

  const current = phases[selectedPhase];

  return (
    <div className="space-y-6">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-pink-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-pink-950/80 text-pink-400 border border-pink-700/60 uppercase tracking-wider">
              STAGE 5 &bull; 2030+ HORIZON
            </span>
            <span className="text-xs font-mono text-slate-400">Frontier Condensed Matter</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
            <span>Altermagnetism: The 3rd Form of Magnetism</span>
            <Sparkles className="w-6 h-6 text-pink-400" />
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-mono">
          Zero net magnetization combined with 100% spin-polarized bands. How India and next-gen hardware leapfrog the permanent magnet paradigm entirely.
        </p>
      </div>

      {/* Main Comparison Matrix & Futuristic Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: The 3 Magnetic Classes Selector */}
        <div className="lg:col-span-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            Compare The Three States of Matter:
          </label>

          <div className="space-y-2.5">
            {Object.values(phases).map((p) => {
              const isSelected = selectedPhase === p.id;
              const isAlter = p.id === 'altermagnet';

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhase(p.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? isAlter 
                        ? 'bg-gradient-to-r from-pink-950/60 via-slate-900 to-cyan-950/40 border-pink-500 shadow-glow-cyan' 
                        : 'bg-slate-900 border-slate-700'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                      {p.name}
                      {isAlter && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold uppercase">
                          New Paradigm
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.era}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-2 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400">Net Dipole:</span>{' '}
                      <span className={isAlter ? 'text-cyan-300 font-bold' : 'text-slate-200'}>
                        {p.netMagnetization}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Spin Bands:</span>{' '}
                      <span className={isAlter ? 'text-pink-400 font-bold' : 'text-slate-200'}>
                        {p.spinSplitting}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Key Materials Snapshot */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5 font-bold">
              <Atom className="w-4 h-4 text-pink-400" />
              Verified Altermagnetic Crystals:
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-900 text-pink-300 border border-pink-800/40">
                RuO₂ (Ruthenium Dioxide)
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-800/40">
                MnTe (Manganese Telluride)
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 text-amber-300 border border-amber-800/40">
                CrSb (Chromium Antimonide)
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Strategic Vision for India & Global Hardware */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-pink-950/20 to-slate-950 border border-pink-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-pink-400 font-bold">
                  Condensation of Spin Symmetry
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  How Altermagnetism Rewrites Magnetic Physics
                </h4>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">Switching Speed</span>
                <span className="text-pink-400 font-bold">1,000x Faster (THz)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              In conventional ferromagnets, magnetic fields leak into space (stray fields), which causes destructive cross-talk in dense motor sensors and memory arrays. In antiferromagnets, there is no net field, but spins cancel each other completely.
            </p>

            <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/30 text-xs font-mono text-pink-200 leading-relaxed">
              <span className="font-bold text-white block mb-1">The Altermagnetic Breakthrough:</span>
              Opposite spin sublattices are rotated by crystal crystal symmetries (C₄ / d-wave). The macroscopic net dipole remains <span className="text-cyan-300 font-bold">strictly zero</span>, yet electrons moving in specific directions feel an enormous <span className="text-pink-300 font-bold">spin-polarizing exchange field</span>!
            </div>

            {/* Strategic Leapfrog for India */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                Strategic Positioning: India Leapfrogs the NdFeB Era
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                China fought for 40 years to monopolize NdFeB mining and heavy rare-earth refining. By funding domestic altermagnetic crystal synthesis (manganese and chromium-rich ores abundant in the Indian peninsula), India skips trying to copy 1980s Chinese refining chains and directly claims the intellectual property for <span className="text-slate-200 font-semibold">2030s THz contactless couplers, solid-state magnetic switches, and next-gen spintronic motor controllers</span>.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
