import React, { useState } from 'react';
import { COERCIVITY_BENCHMARKS } from '../data/motorData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Layers, 
  Sliders, 
  Cpu, 
  Info, 
  AlertCircle, 
  Sparkles, 
  Atom, 
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function Tab2GeometryLab() {
  const [aspectRatio, setAspectRatio] = useState(28); // 1 to 50
  const [curvatureFactor, setCurvatureFactor] = useState(0.65); // 0.1 to 1.0

  // Physics model for Fe-Ni-P Curvilinear Nanowire Coercivity:
  // Base coercivity for bulk/low-aspect Fe-Ni-P ~ 45 Oe
  // Aspect ratio contribution (Stoner-Wohlfarth demag factor difference): up to ~280 Oe
  // Curvature factor contribution (domain wall pinning at curvilinear nodes): up to ~115 Oe
  // Lab ceiling benchmark: capped strictly at 440 Oe
  const rawCoercivity = Math.round(
    45 + 
    ((aspectRatio - 1) / 49) * 280 + 
    Math.sin(curvatureFactor * Math.PI * 0.5) * 115
  );
  const calculatedCoercivity = Math.min(440, Math.max(50, rawCoercivity));

  // Prepare chart data with log scale for clear visualization across 50 to 25,000 Oe
  const chartData = COERCIVITY_BENCHMARKS.map((item) => {
    const value = item.isInteractive ? calculatedCoercivity : item.coercivityOe;
    return {
      name: item.name,
      category: item.category,
      coercivityOe: value,
      color: item.color,
      isInteractive: item.isInteractive,
      description: item.description
    };
  });

  // Nanowire visual path generation for the interactive SVG
  const renderCurvilinearNanowire = () => {
    // Generate curved bezier path based on aspect ratio & curvature
    const width = 340;
    const height = 180;
    const wireThickness = Math.max(3, Math.min(14, 18 - (aspectRatio / 50) * 12));
    const segments = 4;
    const amplitude = (curvatureFactor * 45);
    const lengthScale = (aspectRatio / 50);

    // Points for a curvilinear serpentine / wavy nanowire
    const startX = 30;
    const endX = startX + 160 + lengthScale * 120;
    const midY = height / 2;

    const pathD = `M ${startX} ${midY} 
      Q ${startX + 40} ${midY - amplitude}, ${startX + 80} ${midY} 
      T ${startX + 160} ${midY} 
      T ${startX + 240} ${midY} 
      T ${endX} ${midY}`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grid Lines */}
        <g stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4">
          <line x1="0" y1="45" x2={width} y2="45" />
          <line x1="0" y1="90" x2={width} y2="90" />
          <line x1="0" y1="135" x2={width} y2="135" />
          <line x1="85" y1="0" x2="85" y2={height} />
          <line x1="170" y1="0" x2="170" y2={height} />
          <line x1="255" y1="0" x2="255" y2={height} />
        </g>

        {/* Ghost reference baseline (straight low-aspect cylinder) */}
        <line 
          x1="30" 
          y1={midY} 
          x2="150" 
          y2={midY} 
          stroke="#334155" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeDasharray="2 3"
        />

        {/* Dynamic Curvilinear Nanowire */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="url(#wireGradient)" 
          strokeWidth={wireThickness} 
          strokeLinecap="round" 
          filter="url(#glow)"
        />

        {/* Magnetic Dipole Vector Arrows along the curve */}
        <g fill="#00f2fe" opacity="0.8">
          <circle cx={startX + 20} cy={midY - amplitude * 0.4} r="2.5" />
          <circle cx={startX + 80} cy={midY} r="2.5" />
          <circle cx={startX + 140} cy={midY + amplitude * 0.4} r="2.5" />
          <circle cx={startX + 200} cy={midY} r="2.5" />
        </g>

        {/* Dimension Labels */}
        <text x="35" y="24" fill="#64748b" fontSize="10" fontFamily="monospace">
          L/d Aspect: {aspectRatio}:1
        </text>
        <text x="35" y="165" fill="#00f2fe" fontSize="10" fontFamily="monospace">
          Curvature κ: {curvatureFactor.toFixed(2)} • Fe-Ni-P Lattice
        </text>
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Lab Scope */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-0.5">
            <Atom className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Curvilinear Magnet Geometry & Shape-Anisotropy Lab
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                Nanoscale Physics
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore shape-anisotropy engineering in electrodeposited <span className="text-cyan-300 font-semibold">Fe-Ni-P alloy nanowires</span>. By modulating aspect ratio and chiral curvature, domain wall nucleation is suppressed to elevate coercivity toward the ~440 Oe experimental ceiling.
            </p>
          </div>
        </div>

        {/* Clear Badge Required by Prompt */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 max-w-md shadow-glow-amber">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="font-semibold leading-tight">
            <span className="text-amber-200 uppercase tracking-wider text-[10px] block font-mono">Strategic Reality</span>
            &ldquo;Wedge Market: Micro-sensors & shielding today; not EV traction yet.&rdquo;
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Sliders & Live Physics Readout */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Nanowire Morphological Controls
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                Fe-Ni-P Alloy
              </span>
            </div>

            {/* Slider 1: Nanowire Aspect Ratio (1 to 50) */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  Nanowire Aspect Ratio (L/d)
                  <span className="text-slate-400 font-mono text-[10px]">(Length / Diameter)</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold bg-slate-800 px-2.5 py-0.5 rounded text-sm">
                  {aspectRatio} : 1
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 (Spherical / Isotropic)</span>
                <span>25 (Elongated)</span>
                <span>50 (High-Aspect Needle)</span>
              </div>
            </div>

            {/* Slider 2: Curvature Factor (0.1 to 1.0) */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  Curvature Factor (&kappa;)
                  <span className="text-slate-400 font-mono text-[10px]">(Domain Pinning Arc)</span>
                </label>
                <span className="font-mono text-cyan-300 font-bold bg-slate-800 px-2.5 py-0.5 rounded text-sm">
                  {curvatureFactor.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={curvatureFactor}
                onChange={(e) => setCurvatureFactor(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.10 (Straight Cylinder)</span>
                <span>0.55 (Moderate Arc)</span>
                <span>1.00 (Tight Serpentine)</span>
              </div>
            </div>

            {/* Live Coercivity Readout Gauge Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/60 to-slate-950 border border-cyan-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Calculated Shape Coercivity (H_c)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-300 border border-cyan-700/50">
                  {calculatedCoercivity >= 440 ? 'BENCHMARK CAP REACHED' : 'SCALING'}
                </span>
              </div>

              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight">
                  {calculatedCoercivity}
                </span>
                <span className="text-lg font-bold text-slate-400 font-mono">Oe (Oersteds)</span>
                <span className="text-xs text-slate-400 font-mono">
                  (&sim;{(calculatedCoercivity * 0.07958).toFixed(1)} kA/m)
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-cyan-900/50 text-[11px] text-slate-300 font-mono flex items-center justify-between">
                <span>Lab Benchmark Ceiling:</span>
                <span className="text-cyan-400 font-bold">440 Oe Max</span>
              </div>
            </div>

            {/* Interactive Nanowire Canvas/SVG Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>Live Morphological Geometry Simulation</span>
                <span className="text-cyan-400">2D Projection</span>
              </div>
              <div className="h-44 w-full flex items-center justify-center">
                {renderCurvilinearNanowire()}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Log-Scale Coercivity Benchmark Chart */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Coercivity Landscape: Shape Anisotropy vs. Commercial Magnets</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison against Ferrite Y38, Iron Nitride (Fe16N2), and EV Traction NdFeB (Logarithmic Scale).
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                Log10 Scale (Oe)
              </span>
            </div>

            {/* Recharts Bar Chart on Logarithmic / Clear Magnitude Scale */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis 
                    type="number" 
                    scale="log" 
                    domain={[20, 30000]} 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(val) => `${val.toLocaleString()} Oe`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 500 }}
                    width={140}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono space-y-1">
                            <div className="font-bold text-white text-sm" style={{ color: data.color }}>
                              {data.name}
                            </div>
                            <div className="text-slate-400 text-[11px]">{data.category}</div>
                            <div className="text-cyan-300 font-bold text-base mt-1">
                              {data.coercivityOe.toLocaleString()} Oe
                            </div>
                            <p className="text-slate-400 text-[10px] pt-1 border-t border-slate-800">
                              {data.description}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="coercivityOe" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Material Class Benchmarking Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-cyan-500/30">
                <div className="text-cyan-400 font-bold">Fe-Ni-P (Live)</div>
                <div className="text-white text-xs mt-0.5">{calculatedCoercivity} Oe</div>
                <div className="text-slate-400 text-[10px]">Shape Anisotropy</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-indigo-500/30">
                <div className="text-indigo-400 font-bold">Fe₁₆N₂ Bulk</div>
                <div className="text-white text-xs mt-0.5">2,100 Oe</div>
                <div className="text-slate-400 text-[10px]">Phase Instability</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-amber-500/30">
                <div className="text-amber-400 font-bold">Ferrite Y38</div>
                <div className="text-white text-xs mt-0.5">3,800 Oe</div>
                <div className="text-slate-400 text-[10px]">PMa-SynRM Grade</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-500/30">
                <div className="text-rose-400 font-bold">NdFeB N48UH</div>
                <div className="text-white text-xs mt-0.5">25,000 Oe</div>
                <div className="text-slate-400 text-[10px]">EV Gold Standard</div>
              </div>
            </div>

          </div>

          {/* Startup Commercial Strategy & Thesis Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Startup Commercialization Memo: The Wedge Market Roadmap
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Immediate Wedge Markets (0-2 Years)
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  High-frequency magnetic shielding for 800V SiC inverters, contactless wheel-speed hall-effect sensors, and planar MEMS micro-actuators. Low coercivity (~440 Oe) is an <span className="text-emerald-300 font-semibold">advantage</span> for high-permeability flux concentrators.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold flex items-center gap-1.5 font-mono">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Long-Term Traction Roadmap (5-7 Years)
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  EV traction motors produce back-EMF demagnetizing fields exceeding 15,000 Oe at 160°C. Nanowire arrays cannot resist this demagnetization without composite coupling to exchange-spring hard phases (e.g. FeN or SmCo matrix).
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
