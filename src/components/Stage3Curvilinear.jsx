import React, { useState } from 'react';
import Nanowire3DCanvas from './Nanowire3DCanvas';
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
  AlertCircle, 
  Sparkles, 
  Atom, 
  ShieldCheck, 
  Compass, 
  ArrowRight 
} from 'lucide-react';

export default function Stage3Curvilinear() {
  const [aspectRatio, setAspectRatio] = useState(28); // 1 to 50
  const [curvatureFactor, setCurvatureFactor] = useState(0.65); // 0.1 to 1.0

  // Physics model for Fe-Ni-P Curvilinear Nanowire Coercivity:
  const rawCoercivity = Math.round(
    45 + 
    ((aspectRatio - 1) / 49) * 280 + 
    Math.sin(curvatureFactor * Math.PI * 0.5) * 115
  );
  const calculatedCoercivity = Math.min(440, Math.max(50, rawCoercivity));

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

  return (
    <div className="space-y-6">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 uppercase tracking-wider">
              STAGE 3 &bull; NEAR FUTURE
            </span>
            <span className="text-xs font-mono text-slate-400">Nanoscale Shape Anisotropy</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
            <span>Curvilinear Magnetism: Hardness by Geometry</span>
            <Atom className="w-6 h-6 text-cyan-400" />
          </h3>
        </div>
        
        {/* Strategic Badge Required by Prompt */}
        <div className="p-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 max-w-md shadow-glow-amber">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold text-[11px]">
            &ldquo;Wedge Market: Micro-sensors & shielding today; not EV traction yet.&rdquo;
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 3D Rotating Nanowire WebGL Canvas + Sliders */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Interactive 3D WebGL Helix */}
          <Nanowire3DCanvas aspectRatio={aspectRatio} curvature={curvatureFactor} />

          {/* Morphological Sliders Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Fe-Ni-P Lattice Geometric Controls
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                L/d: {aspectRatio}:1 &bull; &kappa;: {curvatureFactor.toFixed(2)}
              </span>
            </div>

            {/* Slider 1: Nanowire Aspect Ratio */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">
                  Nanowire Aspect Ratio (L/d)
                </label>
                <span className="font-mono text-cyan-300 font-bold bg-slate-800 px-2 py-0.5 rounded text-xs">
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
                <span>1 (Isotropic Spheres)</span>
                <span>25</span>
                <span>50 (High-Aspect Needle)</span>
              </div>
            </div>

            {/* Slider 2: Curvature Factor */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">
                  Curvature Factor (&kappa;) &mdash; Domain Pinning
                </label>
                <span className="font-mono text-cyan-300 font-bold bg-slate-800 px-2 py-0.5 rounded text-xs">
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
                <span>0.55</span>
                <span>1.00 (Tight Helix)</span>
              </div>
            </div>

            {/* Live Coercivity Readout */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Computed Shape Coercivity (H_c)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-cyan-300 font-mono">
                    {calculatedCoercivity}
                  </span>
                  <span className="text-xs font-mono text-slate-300">Oe (Oersteds)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-900/80 text-cyan-200 border border-cyan-700 block">
                  {calculatedCoercivity >= 440 ? 'LAB CAP REACHED' : 'SCALING'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Ceiling: 440 Oe
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Log-scale Benchmark Bar Chart & Wedge Market Strategy */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white font-mono">
                Coercivity Benchmark Landscape (Log10 Scale)
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">
                Oe (Oersteds)
              </span>
            </div>

            <div className="h-60 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis 
                    type="number" 
                    scale="log" 
                    domain={[20, 30000]} 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(val) => `${val.toLocaleString()} Oe`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: '#e2e8f0', fontSize: 10 }}
                    width={130}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950/95 border border-slate-700 p-2.5 rounded-xl text-xs font-mono">
                            <div className="font-bold text-white" style={{ color: data.color }}>
                              {data.name}
                            </div>
                            <div className="text-cyan-300 font-bold mt-0.5">
                              {data.coercivityOe.toLocaleString()} Oe
                            </div>
                            <div className="text-slate-400 text-[10px] mt-1">{data.description}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="coercivityOe" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Benchmark Comparison Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-center">
              <div className="p-2 rounded bg-slate-950/60 border border-cyan-500/30">
                <div className="text-cyan-400 font-bold">Fe-Ni-P</div>
                <div className="text-white">{calculatedCoercivity} Oe</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-indigo-500/30">
                <div className="text-indigo-400 font-bold">Fe₁₆N₂</div>
                <div className="text-white">2,100 Oe</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-amber-500/30">
                <div className="text-amber-400 font-bold">Ferrite Y38</div>
                <div className="text-white">3,800 Oe</div>
              </div>
              <div className="p-2 rounded bg-slate-950/60 border border-rose-500/30">
                <div className="text-rose-400 font-bold">NdFeB N48UH</div>
                <div className="text-white">25,000 Oe</div>
              </div>
            </div>
          </div>

          {/* Wedge Market Commercial Strategy */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30 space-y-2 text-xs">
            <span className="font-bold text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              The Commercialization Roadmap: Wedge Markets
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              While ~440 Oe is far too low for EV traction back-EMF demagnetization (&gt;15,000 Oe required at 150°C), electrodeposited Fe-Ni-P nanowires excel at:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <span className="text-cyan-400 font-bold block">1. 800V SiC Shielding</span>
                High-permeability EMI shielding for motor power inverters.
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-bold block">2. Micro-Sensors</span>
                Planar fluxgate current sensors & contactless wheel encoders.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
