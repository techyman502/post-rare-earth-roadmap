import React, { useState } from 'react';
import { 
  VEHICLE_CLASSES, 
  REPLACEMENT_TOPOLOGIES, 
  PRICING_SCENARIOS 
} from '../data/motorData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  BatteryCharging, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Info,
  Car,
  Truck,
  Bike,
  Scale
} from 'lucide-react';

export default function Tab1Simulator({ pricingScenario, setPricingScenario }) {
  const [selectedVehicle, setSelectedVehicle] = useState('bev');
  const [selectedTopology, setSelectedTopology] = useState('eesm');
  const [customBatteryPrice, setCustomBatteryPrice] = useState(115); // $/kWh
  const [inverterCostPerKva, setInverterCostPerKva] = useState(12); // $/kVA base estimate

  const vehicle = VEHICLE_CLASSES[selectedVehicle];
  const topology = REPLACEMENT_TOPOLOGIES[selectedTopology];
  const scenario = PRICING_SCENARIOS[pricingScenario];

  // Calculations
  // 1. Baseline Magnet BOM Saved ($)
  // For Ferrite PMa-SynRM, ceramic ferrite magnets cost ~$10 for BEV, ~$2 for scooter, ~$25 for bus
  const ferriteCost = topology.ferriteUsage 
    ? (selectedVehicle === 'bev' ? 12 : selectedVehicle === 'scooter' ? 2 : 28) 
    : 0;
  
  const rawMagnetSaved = vehicle.pricing[pricingScenario];
  const netMagnetSaved = rawMagnetSaved - ferriteCost;

  // 2. Extra Battery Cost ($) to maintain range
  // Battery penalty = Battery_kWh * (|effDelta| / 100) * $/kWh
  const extraBatteryKwh = vehicle.batteryKwh * (Math.abs(topology.effDelta) / 100);
  const extraBatteryCost = extraBatteryKwh * customBatteryPrice;

  // 3. Inverter kVA Oversizing & Cost ($)
  // Base inverter kVA ≈ vehicle.powerKw / 0.95 (assumed baseline PM motor PF 0.95)
  const baseInverterKva = vehicle.powerKw / 0.95;
  const oversizedKva = baseInverterKva * (topology.inverterKvaDelta / 100);
  const extraInverterCost = oversizedKva * inverterCostPerKva;

  // 4. Net Vehicle Cost Impact ($)
  // Net Impact = Extra Battery + Extra Inverter - Magnet Saved
  // If negative: Vehicle is cheaper! (Green savings)
  // If positive: Vehicle costs more! (Red cost adder)
  const netCostImpact = extraBatteryCost + extraInverterCost - netMagnetSaved;
  const netSavings = -netCostImpact;

  // Data for side-by-side comparison chart across all topologies for this vehicle & scenario
  const topologyComparisonData = Object.values(REPLACEMENT_TOPOLOGIES).map(t => {
    const tFerriteCost = t.ferriteUsage 
      ? (selectedVehicle === 'bev' ? 12 : selectedVehicle === 'scooter' ? 2 : 28) 
      : 0;
    const magSaved = rawMagnetSaved - tFerriteCost;
    const battPenalty = vehicle.batteryKwh * (Math.abs(t.effDelta) / 100) * customBatteryPrice;
    const invAdder = (vehicle.powerKw / 0.95) * (t.inverterKvaDelta / 100) * inverterCostPerKva;
    const net = magSaved - battPenalty - invAdder;

    return {
      name: t.name,
      id: t.id,
      magnetSaved: Math.round(magSaved),
      batteryPenalty: Math.round(battPenalty),
      inverterAdder: Math.round(invAdder),
      netSavings: Math.round(net),
      effDelta: t.effDelta,
      inverterDelta: t.inverterKvaDelta
    };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner: Pitch Thesis */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900/40 border border-cyan-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Powertrain Replacement TCO & Geopolitical Arbitrage
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                Live Engineering Model
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Eliminating NdFeB magnets removes supply chain vulnerability, but lower efficiency and power factor impose <span className="text-cyan-300 font-semibold">battery range penalties</span> and <span className="text-cyan-300 font-semibold">inverter kVA oversizing</span>. Evaluate the true net BOM delta across three critical EV classes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-mono">Scenario:</span>
          <div className="inline-flex rounded-lg border border-slate-700 p-0.5 bg-slate-900/90 text-xs">
            <button
              onClick={() => setPricingScenario('china')}
              className={`px-3 py-1 rounded-md transition-colors ${
                pricingScenario === 'china' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              China Domestic
            </button>
            <button
              onClick={() => setPricingScenario('exChinaStress')}
              className={`px-3 py-1 rounded-md transition-colors ${
                pricingScenario === 'exChinaStress' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ex-China Stress
            </button>
          </div>
        </div>
      </div>

      {/* Control Grid: 1. Vehicle Class & 2. Replacement Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step 1: Vehicle Class Selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[11px]">1</span>
              Vehicle Class
            </label>
            <span className="text-xs text-slate-400 font-mono">Baseline NdFeB Mass</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {Object.values(VEHICLE_CLASSES).map((v) => {
              const isSelected = selectedVehicle === v.id;
              const Icon = v.id === 'scooter' ? Bike : v.id === 'bev' ? Car : Truck;
              const magCost = v.pricing[pricingScenario];

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          {v.name}
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400">{v.subtitle}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-300">${magCost}</div>
                      <div className="text-[10px] text-slate-400 font-mono">NdFeB BOM</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400">Power:</span> <span className="text-slate-200 font-semibold">{v.powerKw} kW</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Battery:</span> <span className="text-slate-200 font-semibold">{v.batteryKwh} kWh</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">NdFeB:</span> <span className="text-amber-300 font-semibold">{v.ndfebKg} kg</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Model Assumptions accordion / fine-tuning */}
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                Pack Cost Benchmark:
              </span>
              <span className="font-mono text-slate-200 font-semibold">${customBatteryPrice}/kWh</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Silicon Inverter Baseline:</span>
              <span className="font-mono text-slate-200 font-semibold">${inverterCostPerKva}/kVA</span>
            </div>
          </div>
        </div>

        {/* Step 2: Replacement Topology Selection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[11px]">2</span>
              Replacement Non-NdFeB Topology
            </label>
            <span className="text-xs text-slate-400 font-mono">Efficiency & Inverter Deltas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(REPLACEMENT_TOPOLOGIES).map((topo) => {
              const isSelected = selectedTopology === topo.id;

              return (
                <button
                  key={topo.id}
                  onClick={() => setSelectedTopology(topo.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-950/50 to-slate-900 border-cyan-500/60 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white flex items-center gap-1.5">
                      {topo.name}
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      topo.effDelta >= -0.5 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      Eff: {topo.effDelta}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {topo.fullName}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400">Power Factor:</span>{' '}
                      <span className="text-cyan-300 font-bold">{topo.pf}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Inv kVA:</span>{' '}
                      <span className="text-amber-400 font-bold">+{topo.inverterKvaDelta}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Topology Maturity Snapshot */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Active Topology Readiness:
            </span>
            <span className="font-mono text-cyan-300 font-semibold">{topology.technologyReadiness}</span>
          </div>
        </div>

      </div>

      {/* LIVE KPI OUTPUT CARDS (4 Cards Required by Prompt) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Live TCO & BOM Impact Matrix ({vehicle.name} &bull; {topology.name})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {scenario.name} (${rawMagnetSaved} baseline)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Magnet BOM Saved ($) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Magnet BOM Saved</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight text-emerald-400">
              ${Math.round(netMagnetSaved)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center justify-between">
              <span>{vehicle.ndfebKg} kg NdFeB</span>
              <span className="text-emerald-400 font-semibold">100% RE-free</span>
            </div>
            {topology.ferriteUsage && (
              <div className="text-[10px] text-amber-400 mt-1 font-mono">
                Less ${ferriteCost} Ferrite tiles BOM
              </div>
            )}
          </div>

          {/* Card 2: Inverter kVA Oversizing (%) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Inverter kVA Oversizing</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight text-amber-400">
              +{topology.inverterKvaDelta}%
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center justify-between">
              <span>PF {topology.pf}</span>
              <span className="text-amber-400 font-semibold">+${Math.round(extraInverterCost)} SiC Adder</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Base: {Math.round(baseInverterKva)} kVA &rarr; {Math.round(baseInverterKva + oversizedKva)} kVA
            </div>
          </div>

          {/* Card 3: Extra Battery Cost to Keep Range ($) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden group hover:border-rose-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Extra Battery for Range</span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <BatteryCharging className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tracking-tight text-rose-400">
              ${extraBatteryCost.toFixed(1)}
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center justify-between">
              <span>{topology.effDelta}% motor eff.</span>
              <span className="text-rose-400 font-semibold">+{extraBatteryKwh.toFixed(2)} kWh</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              @ ${customBatteryPrice}/kWh pack cost
            </div>
          </div>

          {/* Card 4: Net Vehicle Cost Impact ($) */}
          <div className={`p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border relative overflow-hidden group transition-all ${
            netSavings >= 0 
              ? 'border-emerald-500/40 shadow-glow-emerald hover:border-emerald-500/60' 
              : 'border-rose-500/40 shadow-glow-rose hover:border-rose-500/60'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Net Vehicle Cost Impact</span>
              <div className={`p-2 rounded-lg border ${
                netSavings >= 0 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {netSavings >= 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
            </div>
            <div className={`text-3xl font-extrabold font-mono tracking-tight ${
              netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {netSavings >= 0 ? `-$${Math.round(netSavings)}` : `+$${Math.round(Math.abs(netSavings))}`}
            </div>
            <div className="text-[11px] mt-2 font-mono flex items-center justify-between">
              <span className="text-slate-400">Net Delta:</span>
              <span className={`font-bold ${netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netSavings >= 0 ? 'Net BOM Savings' : 'Cost Adder Penalty'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              BOM Saved ({Math.round(netMagnetSaved)}) - Batt ({Math.round(extraBatteryCost)}) - Inv ({Math.round(extraInverterCost)})
            </div>
          </div>

        </div>
      </div>

      {/* Side-by-Side Comparison Chart (Recharts) */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>BOM Trade-Off: Magnet Savings vs. Battery & Inverter Penalties</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {vehicle.name} &bull; {scenario.name}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Positive green bars show magnet dollars saved; red/amber bars show vehicle cost penalties incurred to compensate for motor physics.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            Selected: <span className="text-cyan-300 font-bold">{topology.name}</span>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topologyComparisonData}
              margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                tickLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fill: '#94a3b8', fontSize: 11 }} 
                unit="$" 
                tickLine={{ stroke: '#334155' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs font-mono space-y-1.5">
                        <div className="font-bold text-white text-sm border-b border-slate-800 pb-1">
                          {label}
                        </div>
                        <div className="text-emerald-400 flex justify-between gap-4">
                          <span>Magnet BOM Saved:</span>
                          <span className="font-bold">+${data.magnetSaved}</span>
                        </div>
                        <div className="text-rose-400 flex justify-between gap-4">
                          <span>Battery Range Penalty:</span>
                          <span className="font-bold">-${data.batteryPenalty} ({data.effDelta}%)</span>
                        </div>
                        <div className="text-amber-400 flex justify-between gap-4">
                          <span>Inverter kVA Adder:</span>
                          <span className="font-bold">-${data.inverterAdder} (+{data.inverterDelta}%)</span>
                        </div>
                        <div className={`pt-1 border-t border-slate-800 font-bold flex justify-between gap-4 ${
                          data.netSavings >= 0 ? 'text-cyan-300' : 'text-rose-400'
                        }`}>
                          <span>Net TCO Impact:</span>
                          <span>{data.netSavings >= 0 ? `+$${data.netSavings} Net Savings` : `-$${Math.abs(data.netSavings)} Net Penalty`}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
              />
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="magnetSaved" name="Magnet BOM Saved ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="batteryPenalty" name="Battery Penalty ($)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inverterAdder" name="Inverter Adder ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netSavings" name="Net Advantage ($)" fill="#00f2fe" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engineering Drawback Callout Box (Required by Prompt) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-rose-950/20 border border-amber-500/30 backdrop-blur-md relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60">
                  HONEST ENGINEERING TRADE-OFF &bull; {topology.name}
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  Primary Architectural Drawback & Risk Factor
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">OEM Adopters:</span>
                <div className="flex flex-wrap gap-1">
                  {topology.keyOems.map((oem, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {oem}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* The exact honest limitation required by prompt */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-slate-200 font-mono text-sm leading-relaxed text-amber-200">
              &ldquo;{topology.drawback}&rdquo;
            </div>

            {/* Deep Technical Drilldown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Inverter / Silicon Rating
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {topology.inverterSiliconImpact}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Thermal / Reliability
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {topology.thermalManagement}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Patent Density & Freedom to Operate
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {topology.patentLandscape}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
