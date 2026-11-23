import React, { useState } from 'react';
import { 
  AlertOctagon, 
  RotateCw, 
  Sparkles, 
  Flame, 
  FileWarning, 
  CheckCircle2, 
  ShieldAlert, 
  Scale, 
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function Stage2Tetrataenite() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-700/60 uppercase tracking-wider">
              STAGE 2 &bull; THE WARNING
            </span>
            <span className="text-xs font-mono text-slate-400">Dec 2024 Academic Milestone</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
            <span>Tetrataenite: The Cosmic Cautionary Tale</span>
            <AlertOctagon className="w-6 h-6 text-rose-500" />
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-mono">
          Why "miracle chemistry" shortcuts failed, and why real-world automotive engineering rejects unverified crystal alchemy.
        </p>
      </div>

      {/* Main Interactive Flip-Card Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 3D Flip Card Container */}
        <div className="lg:col-span-7 perspective-[1200px] min-h-[380px]">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`relative w-full h-full rounded-2xl transition-all duration-700 cursor-pointer transform-style-3d group ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT: The 2022 Miracle Promise */}
            <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 border border-amber-500/40 backface-hidden flex flex-col justify-between shadow-glow-amber transition-all ${
              isFlipped ? 'pointer-events-none' : ''
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                        October 2022 &bull; The Hype
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        The Synthetic Tetrataenite &ldquo;Miracle&rdquo;
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    Click to Flip Card
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Tetrataenite is an equiatomic iron-nickel alloy (L1₀-FeNi) known only in iron meteorites that cooled over <span className="text-amber-300 font-semibold">hundreds of millions of years</span> at 0.1°C per million years. In Oct 2022, Cambridge researchers claimed a sensational breakthrough: adding trace phosphorus (P) unlocked synthetic tetrataenite in a mere <span className="text-amber-300 font-semibold">5 seconds</span>!
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-amber-500/20">
                    <div className="text-slate-400">Claimed Cooling Time:</div>
                    <div className="text-amber-400 font-bold text-sm">5 Seconds</div>
                    <div className="text-[10px] text-slate-400">vs 100M yrs in space</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-amber-500/20">
                    <div className="text-slate-400">Claimed Coercivity:</div>
                    <div className="text-amber-400 font-bold text-sm">High Remanence</div>
                    <div className="text-[10px] text-slate-400">Zero Rare Earths</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px]">
                  <span>Advanced Science publication</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
                <span className="font-mono text-[11px] text-amber-300 underline">
                  Click to reveal the December 2024 Retraction &rarr;
                </span>
              </div>
            </div>

            {/* BACK: The Dec 2024 Retraction Reality */}
            <div className={`absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border border-rose-500/60 backface-hidden rotate-y-180 flex flex-col justify-between shadow-glow-rose transition-all ${
              !isFlipped ? 'pointer-events-none' : ''
            }`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <ShieldAlert className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                        December 2024 &bull; The Truth
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        Formal Cambridge Paper Retraction
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    Click to Flip Back
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-mono leading-relaxed mb-3">
                  &ldquo;The authors retract this article after independent re-investigation revealed that XRD superlattice reflections were misattributed to L1₀ ordering, originating instead from iron-nickel phosphide precipitates.&rdquo;
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  High-resolution synchrotron analysis proved the magnetic anisotropy was a <span className="text-rose-400 font-semibold">spectroscopic artifact</span> of phosphorus contamination. The bulk phase remained chemically disordered.
                </p>
              </div>

              <div className="pt-3 border-t border-rose-900/40 flex items-center justify-between text-xs text-slate-400">
                <span className="text-rose-400 font-mono text-[11px] font-bold">
                  STATUS: RETRACTED &bull; ZERO INDUSTRIAL VALUE
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Click to return
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Strategic Pitch Takeaway */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              Startup & OEM Due-Diligence Lesson
            </div>
            <h4 className="text-base font-bold text-white">
              Why We Never Bet Billions on Miracle Chemistry
            </h4>

            <div className="space-y-3 mt-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  Chemistry Shortcuts Violate Thermodynamics
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Atomic diffusion rates below 320°C in Fe-Ni are astronomically slow (diffusion constant D ≈ 10⁻²⁴ cm²/s). Phosphorus cannot accelerate ordering without forming brittle phosphide secondary phases.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  The Winning Strategy: Mechanical & Geometric Physics
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Instead of praying for unverified alchemy, winning Western & Indian OEMs deploy proven motor swappers (EESM, PMa-SynRM) and engineering shape anisotropy (nanowires).
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-300 font-mono flex items-center justify-between">
            <span>Next Stage: Shape Anisotropy</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

      </div>

    </div>
  );
}
