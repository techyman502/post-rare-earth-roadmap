import React, { useState } from 'react';
import { MAGNET_GRADES } from '../data/motorData';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  FileWarning, 
  CheckCircle, 
  Layers, 
  Compass, 
  Info,
  Scale,
  Building2,
  AlertOctagon,
  FileText
} from 'lucide-react';

export default function Tab3MOFCOMChecker() {
  const [selectedGrade, setSelectedGrade] = useState('N48UH');
  const [dyTbContent, setDyTbContent] = useState(3.5); // wt.% (0 to 5%)

  const grade = MAGNET_GRADES[selectedGrade];

  // When user switches grade, reset dyTbContent to typical default for that grade
  const handleGradeChange = (gradeKey) => {
    setSelectedGrade(gradeKey);
    setDyTbContent(MAGNET_GRADES[gradeKey].defaultDyTb);
  };

  // Compliance Logic:
  // 1. April 2025 MOFCOM License Requirement:
  // Mandated for any rare-earth magnet containing heavy rare earths (Dy, Tb) or high-coercivity grades (SH, UH, EH)
  const isApril2025LicenseRequired = dyTbContent > 0 || selectedGrade !== 'N52';

  // 2. Jan 10, 2027 Strict 0.1% De Minimis Risk:
  // Material containing >= 0.10 wt.% Dy or Tb triggers secondary supply-chain embargo / de minimis extraterritorial control
  const is2027DeMinimisBreach = dyTbContent >= 0.10;

  // Status determinations
  const overallRiskLevel = is2027DeMinimisBreach 
    ? 'CRITICAL_RISK' 
    : isApril2025LicenseRequired 
      ? 'LICENSE_MANDATORY' 
      : 'COMPLIANT_EXEMPT';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Regulatory Context */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              MOFCOM Export Compliance & De Minimis Risk Engine
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">
                Customs Verification
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Verify EV traction magnet formulations against the <span className="text-rose-300 font-semibold">April 2025 MOFCOM Dual-Use License</span> mandate and upcoming <span className="text-rose-300 font-semibold">Jan 10, 2027 0.1% de minimis</span> supply chain embargo rules.
            </p>
          </div>
        </div>

        <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Authority</span>
          <span className="text-xs font-bold text-white font-mono">MOFCOM &bull; GACC Dual-Use</span>
        </div>
      </div>

      {/* Main Interactive Controls & Live Compliance Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Grade Selector & Dy/Tb Slider */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            
            {/* Input 1: Magnet Grade Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[11px]">1</span>
                  Select Sintered NdFeB Grade
                </span>
                <span className="text-slate-400 font-normal">Thermal Class</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(MAGNET_GRADES).map((g) => {
                  const isSelected = selectedGrade === g.id;
                  const isLree = g.id === 'N52';

                  return (
                    <button
                      key={g.id}
                      onClick={() => handleGradeChange(g.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-500/60 shadow-glow-cyan'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white font-mono">{g.name}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isLree ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {g.maxTemp}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{g.subtitle}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-2 pt-1.5 border-t border-slate-800/80 flex justify-between">
                        <span>Hcj: {g.hcjKoe}</span>
                        <span className={isLree ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {isLree ? '0% HREE' : '~' + g.defaultDyTb + '% HREE'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: Dy / Tb Content Slider (0% to 5%) */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[11px]">2</span>
                  Dysprosium (Dy) + Terbium (Tb) Weight %
                </label>
                <span className={`font-mono font-bold px-2.5 py-0.5 rounded text-sm ${
                  dyTbContent >= 0.1 
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-700' 
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                }`}>
                  {dyTbContent.toFixed(1)} wt.%
                </span>
              </div>

              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={dyTbContent}
                onChange={(e) => setDyTbContent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">0.0% (LREE Pure)</span>
                <span className="text-amber-400 font-bold">0.10% (De Minimis Line)</span>
                <span className="text-rose-400 font-bold">5.0% (Heavy EH Grade)</span>
              </div>

              {/* Threshold Indicator Callout */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current HREE Content:</span>
                  <span className={`font-bold ${dyTbContent >= 0.1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {dyTbContent >= 0.1 ? `${dyTbContent.toFixed(1)}% (EXCEEDS 0.1% LIMIT)` : `${dyTbContent.toFixed(1)}% (BELOW LIMIT)`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Customs Sampling Method:</span>
                  <span className="text-slate-300">GB/T 18882 ICP-MS Assay</span>
                </div>
              </div>
            </div>

            {/* Selected Grade Profile */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                {grade.name} Thermal Specification
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {grade.description}
              </p>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                Typical Automotive Application: <span className="text-slate-200">{grade.typicalUses}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Instant Red/Green Compliance Badges & Supply Chain Audits */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TWO PRIMARY COMPLIANCE OUTPUTS REQUIRED BY PROMPT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Output 1: April 2025 MOFCOM Export License Requirement */}
            <div className={`p-5 rounded-2xl border relative overflow-hidden backdrop-blur-md transition-all ${
              isApril2025LicenseRequired 
                ? 'bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-950 border-rose-500/50 shadow-glow-rose'
                : 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border-emerald-500/50 shadow-glow-emerald'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
                  April 2025 MOFCOM License
                </span>
                <div className={`p-2 rounded-xl border ${
                  isApril2025LicenseRequired 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isApril2025LicenseRequired ? <AlertOctagon className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
              </div>

              <div className={`text-xl font-extrabold font-mono tracking-tight ${
                isApril2025LicenseRequired ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {isApril2025LicenseRequired ? 'LICENSE MANDATORY' : 'EXEMPT / GREEN CHANNEL'}
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {isApril2025LicenseRequired 
                  ? 'Contains heavy rare earths (Dy/Tb). Requires dual-use export permit, end-user verification, and supply chain tracing.'
                  : 'Zero Dy/Tb heavy rare earth formulation. Standard customs export clearance permitted under LREE exemption.'
                }
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Customs Lead Time:</span>
                <span className={`font-bold ${isApril2025LicenseRequired ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isApril2025LicenseRequired ? '+60 to 120 Days Delay' : 'Standard 3-5 Days'}
                </span>
              </div>
            </div>

            {/* Output 2: Jan 10, 2027 Strict 0.1% De Minimis Risk */}
            <div className={`p-5 rounded-2xl border relative overflow-hidden backdrop-blur-md transition-all ${
              is2027DeMinimisBreach 
                ? 'bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-950 border-rose-500/50 shadow-glow-rose'
                : 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border-emerald-500/50 shadow-glow-emerald'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
                  Jan 10, 2027 0.1% De Minimis
                </span>
                <div className={`p-2 rounded-xl border ${
                  is2027DeMinimisBreach 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {is2027DeMinimisBreach ? <FileWarning className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </div>
              </div>

              <div className={`text-xl font-extrabold font-mono tracking-tight ${
                is2027DeMinimisBreach ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {is2027DeMinimisBreach ? 'CRITICAL EMBARGO RISK' : 'DE MINIMIS COMPLIANT'}
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {is2027DeMinimisBreach 
                  ? `At ${dyTbContent.toFixed(1)} wt.%, magnet breaches the 0.10% extraterritorial threshold, exposing Western Tier-1 subassemblies to secondary customs impoundment.`
                  : `Dy/Tb content is below 0.10% threshold. Meets future extraterritorial de minimis safe harbor regulations.`
                }
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Sanctions Vulnerability:</span>
                <span className={`font-bold ${is2027DeMinimisBreach ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {is2027DeMinimisBreach ? 'High Secondary Risk' : 'Low Exposure'}
                </span>
              </div>
            </div>

          </div>

          {/* Supply Chain Audit & Documentation Dashboard */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                MOFCOM Tier-1 Customs Filing Checklist
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                HS Code: 8505.11.00 (Rare-Earth Permanent Magnets)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${
                dyTbContent > 0 
                  ? 'bg-rose-950/20 border-rose-900/40 text-slate-300' 
                  : 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white font-mono">1. End-User Certificate</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    dyTbContent > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {dyTbContent > 0 ? 'Mandatory Audit' : 'Self-Declaration'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Guarantees civil automotive powertrain use only; non-defense certification required.
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${
                dyTbContent >= 0.1 
                  ? 'bg-rose-950/20 border-rose-900/40 text-slate-300' 
                  : 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white font-mono">2. Chemical ICP-MS Assay</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    dyTbContent >= 0.1 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {dyTbContent >= 0.1 ? 'Failed 0.1% Cap' : 'Passed De Minimis'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mass spectrometry verification of trace Dy/Tb/Ho elements down to 10 ppm sensitivity.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white font-mono">3. Smelter Origin Tracking</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Sino-Southern HREE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Mine-to-magnet chain of custody linking batch to China Rare Earth Group (CREG) or Northern RE.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white font-mono">4. GBD Process Disclosure</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Grain Boundary Diffusion
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Surface vapor deposition vs bulk alloying disclosure to verify minimal Dy boundary utilization.
                </p>
              </div>
            </div>
          </div>

          {/* OEM Geopolitical Mitigation Action Plan */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              OEM Powertrain Strategy Team Recommendations
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-[12px]">
                    Transition Primary Axle to EESM or PMa-SynRM (See Tab 1)
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Adopt BMW/Renault wound-rotor synchronous (EESM) or Nissan ferrite-assisted SynRM architectures to achieve 100% decoupling from Chinese heavy rare earth export licensing.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-[12px]">
                    Ex-China Heavy Rare Earth Tolling & GBD Optimization
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    If NdFeB is retained, engineer heavy grain boundary diffusion (GBD) to cut Dy/Tb below 0.10 wt.% or contract secondary tolling via Lynas / MP Materials / VAC Magnetics.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
