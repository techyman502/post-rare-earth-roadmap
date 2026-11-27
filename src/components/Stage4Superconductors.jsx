import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  ThermometerSnowflake, 
  Zap, 
  Train, 
  Anchor, 
  Wind, 
  Sliders, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Scale
} from 'lucide-react';

export default function Stage4Superconductors() {
  const [tempK, setTempK] = useState(20); // 4K to 60K
  const [magneticFieldT, setMagneticFieldT] = useState(3.5); // 0.5T to 6.0T
  const [activeApplication, setActiveApplication] = useState('railway');

  const applications = {
    railway: {
      id: 'railway',
      title: 'Indian Railways & Heavy Freight',
      icon: Train,
      spec: '6.5 MW Traction Drive • WAG-12 Class',
      weightReduction: '-42% Nacelle Mass',
      fuelSynergy: 'Dual-Role Liquid H₂ Tank',
      desc: 'Indian Railways consumes 2.5% of national electricity. MgB₂ eliminates hundreds of kg of imported NdFeB per locomotive while slashing traction motor core mass by over 40%.'
    },
    maritime: {
      id: 'maritime',
      title: 'Commercial Shipping & Tugs',
      icon: Anchor,
      spec: '20 MW - 40 MW Electric Podded Propulsion',
      weightReduction: '-55% Engine Room Volume',
      fuelSynergy: 'Liquid Hydrogen Bunker Fuel',
      desc: 'Liquid hydrogen container vessels circulate 20K LH₂ through the motor stator before feeding solid-oxide fuel cells, achieving lossless propulsion.'
    },
    wind: {
      id: 'wind',
      title: '15+ MW Offshore Wind Turbines',
      icon: Wind,
      spec: 'Direct-Drive 15 MW Generator (8-12 RPM)',
      weightReduction: '-12 Tons Top-Head Mass',
      fuelSynergy: 'Closed-Loop Stirling Cryocooler',
      desc: 'Replaces over 10 metric tons of imported Dysprosium/Neodymium magnets per turbine, removing the offshore crane vessel assembly bottleneck.'
    }
  };

  const currentApp = applications[activeApplication];

  // Superconducting Physics Logic:
  // MgB2 critical temperature Tc = 39K
  const isSuperconducting = tempK <= 39;
  
  // Electrical Resistance (micro-ohm*cm)
  const resistance = isSuperconducting ? 0.0 : parseFloat((0.25 * Math.pow(tempK - 39, 1.2)).toFixed(2));
  
  // Critical Current Density Jc (A/mm^2)
  const currentDensity = isSuperconducting 
    ? Math.round(10500 * (1 - tempK / 39) * (1 - magneticFieldT / 8.5)) 
    : 0;

  // Resistance vs Temperature Chart Data (10K to 55K)
  const tempChartData = [];
  for (let t = 10; t <= 55; t += 2) {
    tempChartData.push({
      temp: t,
      resistance: t <= 39 ? 0 : parseFloat((0.25 * Math.pow(t - 39, 1.2)).toFixed(2)),
      isCurrent: Math.abs(t - tempK) <= 1
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* ==================================================================== */}
      {/* LEFT COLUMN: 7 COLS — SUPERCONDUCTOR PHYSICS & CRYO LAB              */}
      {/* ==================================================================== */}
      <div className="lg:col-span-7 space-y-5">
        
        {/* Lab Controls Header Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                MgB₂ Superconducting Transition &amp; Cryo Lab
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              Critical Temp Tc = 39K
            </span>
          </div>

          {/* Interactive Temperature Slider */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Cryostat Temperature (Kelvin):</span>
              <span className={`font-bold text-sm ${isSuperconducting ? 'text-cyan-400' : 'text-rose-400'}`}>
                {tempK} K • ({tempK - 273}°C)
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="60"
              step="1"
              value={tempK}
              onChange={(e) => setTempK(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>4K (Liquid He)</span>
              <span className="text-cyan-400 font-bold">20K (Liquid H₂ Target)</span>
              <span className="text-rose-400">39K (Tc Transition)</span>
              <span>60K (Thermal Quench)</span>
            </div>
          </div>

          {/* Live Physics Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">State Phase</div>
              <div className={`text-base font-bold mt-0.5 ${isSuperconducting ? 'text-cyan-400' : 'text-rose-400'}`}>
                {isSuperconducting ? 'Superconducting' : 'Thermal Quench'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Electrical Resistance</div>
              <div className="text-base font-bold text-white mt-0.5">
                {resistance.toFixed(3)} <span className="text-xs text-slate-400">μΩ•cm</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#080d1a] border border-slate-800 font-mono col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase">Current Density (Jc)</div>
              <div className="text-base font-bold text-cyan-400 mt-0.5">
                {currentDensity.toLocaleString()} <span className="text-xs text-slate-400">A/mm²</span>
              </div>
            </div>
          </div>

          {/* Target Application Selector */}
          <div className="pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Select Heavy Transit Target Sector:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(applications).map((key) => {
                const app = applications[key];
                const Icon = app.icon;
                const isSelected = activeApplication === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveApplication(key)}
                    className={`p-2.5 rounded-lg border text-left font-mono transition-all flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold truncate">{app.title.split(' ')[0]} {app.title.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resistance vs Temperature Transition Chart */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Electrical Resistivity vs Temperature Curve
            </h4>
            <span className="text-[10px] font-mono text-cyan-400">Lossless @ 20K</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempChartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="temp" 
                  stroke="#64748b" 
                  tickFormatter={(v) => `${v}K`} 
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Temperature (Kelvin)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 5]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2 rounded bg-[#070b14] border border-slate-700 text-xs font-mono text-white shadow-xl">
                          <div>Temp: <span className="font-bold text-cyan-400">{d.temp} K</span></div>
                          <div>Resistivity: <span className="font-bold text-white">{d.resistance} μΩ·cm</span></div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {d.temp <= 39 ? 'Superconducting (0.000 Resistance)' : 'Quenched Normal State'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={39} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Tc = 39K', fill: '#ef4444', fontSize: 9 }} />
                <ReferenceLine x={tempK} stroke="#06b6d4" strokeWidth={2} label={{ value: `Current: ${tempK}K`, fill: '#06b6d4', fontSize: 9 }} />
                <Line 
                  type="stepAfter" 
                  dataKey="resistance" 
                  stroke="#06b6d4" 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] font-mono text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
            Below 39K, electron Cooper pairs travel through MgB₂ honeycomb boron lattice with <strong>zero scattering</strong>. 
            At 20K, current densities exceed 10,000 A/mm²—hundreds of times higher than copper wiring.
          </p>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* RIGHT COLUMN: 5 COLS — JUDGE-FRIENDLY EXECUTIVE BRIEF                */}
      {/* ==================================================================== */}
      <div className="lg:col-span-5 space-y-4">
        
        {/* Crisp KPI Metric Badges */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <div className="text-[10px] font-mono uppercase text-slate-400">Critical Temp</div>
            <div className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">39 Kelvin</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">20K Liquid H₂ Operation</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <div className="text-[10px] font-mono uppercase text-slate-400">Power Density</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">+61%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">vs NdFeB IPMSM</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
            <div className="text-[10px] font-mono uppercase text-slate-400">I²R Heat Loss</div>
            <div className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">0.00 W</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Zero coil resistance</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700">
            <div className="text-[10px] font-mono uppercase text-slate-400">Permanent Magnets</div>
            <div className="text-xl font-extrabold text-white font-mono mt-0.5">0 kg</div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Deleted from architecture</div>
          </div>
        </div>

        {/* Bold 1-Line Engineering Takeaway */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/40">
          <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider mb-1">
            Executive Engineering Takeaway
          </div>
          <p className="text-xs text-slate-200 font-medium leading-snug">
            Liquid hydrogen at 20K acts as both zero-carbon fuel and lossless cryogenic coolant for MgB₂ coils, 
            delivering <strong className="text-cyan-300">+61% higher power density</strong> for heavy transit while 
            completely deleting the permanent magnet.
          </p>
        </div>

        {/* Selected Sector Snapshot Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentApp.title}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
              {currentApp.weightReduction}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {currentApp.desc}
          </p>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Propulsion Rating:</span>
            <span className="text-white font-semibold">{currentApp.spec}</span>
          </div>
        </div>

        {/* Clean Comparison Bars */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
            Industrial Transit Advantages
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Traction Motor Core Mass:</span>
              <span className="text-cyan-300 font-bold">-42% to -55% Mass Reduction</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: '52%' }} className="bg-cyan-400 h-full" />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Imported Dysprosium Exposure:</span>
              <span className="text-emerald-400 font-bold">0 kg (Eliminated)</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: '0%' }} className="bg-emerald-400 h-full" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
