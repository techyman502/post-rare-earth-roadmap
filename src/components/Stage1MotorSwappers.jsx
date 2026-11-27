import React from 'react';
import Tab1Simulator from './Tab1Simulator';
import { Zap, ShieldCheck, Cpu, ArrowDownCircle, Layers, CheckCircle2 } from 'lucide-react';

export default function Stage1MotorSwappers({ pricingScenario, setPricingScenario }) {
  return (
    <div className="space-y-6">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 uppercase tracking-wider">
              STAGE 1 • TODAY (2026)
            </span>
            <span className="text-xs font-mono text-slate-400">Production Series Architecture</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
            <span>The Motor Swappers: Divide &amp; Conquer</span>
            <Zap className="w-6 h-6 text-cyan-400" />
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-mono">
          How automakers bypass China's 90% Dysprosium grip today by segmenting powertrains into EESM, Ferrite PMa-SynRM, and Induction.
        </p>
      </div>

      {/* OEM Divide & Conquer Strategic Blueprint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white font-mono">1. Premium &amp; Highway</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300">EESM</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Wound rotor with brushless excitation. Delivers 96% highway cruise efficiency (zero rotor iron drag). Championed by <span className="text-white">BMW &amp; Renault</span>.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white font-mono">2. Mass &amp; Urban</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Ferrite PMa-SynRM</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Strontium ferrite tiles embedded in flux barriers. Low raw material cost; trade-off is +30% volume and cold-demag risk. Pioneered by <span className="text-white">Proterial &amp; Nissan</span>.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white font-mono">3. Secondary AWD Axle</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300">AC Induction</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Zero freewheeling drag when de-energized. Ideal for dual-motor front axles. Mass-produced by <span className="text-white">Tesla &amp; Audi</span>.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white font-mono">4. Heavy &amp; Mining</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">Pure SynRM / SRM</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Completely magnet-free rotor steel. Operates in extreme 200°C+ ambient heat with zero demagnetization danger. Commercialized by <span className="text-white">ABB &amp; Turntide</span>.
          </p>
        </div>
      </div>

      {/* Embedded Live Motor Swapper TCO Simulator */}
      <div className="pt-2">
        <Tab1Simulator 
          pricingScenario={pricingScenario} 
          setPricingScenario={setPricingScenario} 
        />
      </div>

    </div>
  );
}
