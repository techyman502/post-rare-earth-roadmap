import React, { useState } from 'react';
import { 
  Zap, 
  Wind, 
  Anchor, 
  Train, 
  Car, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Flame, 
  Gauge,
  ThermometerSnowflake,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Stage4Superconductors() {
  const [activeApplication, setActiveApplication] = useState('railway');

  const applications = {
    railway: {
      id: 'railway',
      title: 'Indian Railways & Heavy Freight',
      icon: Train,
      spec: '6.5 MW Traction Drive &bull; WAG-12 / Vande Bharat Heavy',
      fit: 'PERFECT FIT',
      fitColor: 'emerald',
      weightReduction: '-42% Nacelle Mass',
      fuelSynergy: 'Dual-fuel Hydrogen / Catenary Hybrid',
      desc: 'Indian Railways consumes 2.5% of national electricity. MgB2 eliminates hundreds of kg of imported NdFeB per locomotive while slashing traction motor core weight by over 40%.'
    },
    maritime: {
      id: 'maritime',
      title: 'Commercial Shipping & Tugs',
      icon: Anchor,
      spec: '20 MW - 40 MW Electric Podded Propulsion',
      fit: 'PERFECT FIT',
      fitColor: 'emerald',
      weightReduction: '-55% Engine Room Volume',
      fuelSynergy: 'Cryogenic Liquid Hydrogen Cargo Tanks',
      desc: 'Liquid hydrogen-fueled container vessels circulate 20K LH2 through the motor stator before feeding the solid-oxide fuel cell, achieving zero-loss cooling.'
    },
    wind: {
      id: 'wind',
      title: '15+ MW Offshore Wind Nacelles',
      icon: Wind,
      spec: 'Direct-Drive 15 MW Generator &bull; 8-12 RPM',
      fit: 'PERFECT FIT',
      fitColor: 'emerald',
      weightReduction: '-12 Tons Top-Head Mass',
      fuelSynergy: 'Closed-loop Stirling Cryocooler',
      desc: 'Replaces over 10 metric tons of imported Dysprosium/Neodymium magnets per offshore turbine, preventing crane vessel bottleneck and gearbox maintenance.'
    },
    passengerCar: {
      id: 'passengerCar',
      title: 'Road Passenger Cars (Passenger BEV)',
      icon: Car,
      spec: '150 kW Automotive Powertrain',
      fit: 'NOT VIABLE FOR ROAD CARS',
      fitColor: 'rose',
      weightReduction: 'Parasitic Cryo Weight Penalty',
      fuelSynergy: 'Vacuum Dewars & Boil-Off Complexity',
      desc: 'Automotive stop-start thermal cycles and 48-hour parking make cryogenic boil-off management impractical for consumer vehicles. Passenger cars are better served by EESM and Ferrite PMa-SynRM.'
    }
  };

  const app = applications[activeApplication];

  return (
    <div className="space-y-6">
      
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-violet-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-violet-950/80 text-violet-400 border border-violet-700/60 uppercase tracking-wider">
              STAGE 4 &bull; HEAVY INDUSTRY
            </span>
            <span className="text-xs font-mono text-slate-400">Cryogenic Megawatt-Scale</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 flex items-center gap-2.5">
            <span>MgB₂ Superconductors: Delete the Magnet</span>
            <ThermometerSnowflake className="w-6 h-6 text-violet-400" />
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-md font-mono">
          Replacing permanent magnets with 20K zero-resistance coils to yield massive 4+ Tesla airgaps for railways, maritime, and wind.
        </p>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Core Physics & 20K LH2 Synergy Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-violet-950/20 to-slate-950 border border-violet-500/30 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono uppercase text-violet-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-400" />
              Magnesium Diboride (MgB₂) Physics
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-700/50">
              Zero Magnet Material
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Magnesium Diboride (MgB₂) transitions into a superconductor at 39K. At <span className="text-violet-300 font-semibold">20 Kelvin</span>, it carries astronomical current densities without resistive loss (zero I²R loss), generating airgap magnetic fluxes exceeding <span className="text-violet-300 font-semibold">3.5 to 5.0 Tesla</span> (triple that of NdFeB).
          </p>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-violet-500/20">
              <div className="text-2xl font-extrabold text-violet-400">+61%</div>
              <div className="text-[10px] text-slate-400 mt-1">Power Density</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-violet-500/20">
              <div className="text-2xl font-extrabold text-cyan-400">20 K</div>
              <div className="text-[10px] text-slate-400 mt-1">Liquid H₂ Temp</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-violet-500/20">
              <div className="text-2xl font-extrabold text-emerald-400">0 kg</div>
              <div className="text-[10px] text-slate-400 mt-1">NdFeB Needed</div>
            </div>
          </div>

          {/* The Liquid Hydrogen Synergy Box */}
          <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-bold text-xs font-mono">
              <ThermometerSnowflake className="w-4 h-4 text-violet-400" />
              The Liquid-Hydrogen (LH₂) Dual-Role Miracle
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Liquid hydrogen boils at <span className="text-cyan-300 font-mono">20.28 Kelvin</span>. In heavy hydrogen-powered transport (trains, ships), the LH₂ fuel is circulated through the motor stator jackets as coolant <span className="text-white font-semibold">before</span> entering the fuel cell stack, making cryo-cooling virtually free!
            </p>
          </div>

        </div>

        {/* Right Column: Heavy Industry Application Selector */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              Select Deployment Domain:
            </label>
            <span className="text-xs text-slate-400 font-mono">Indian Strategic Context</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.values(applications).map((item) => {
              const isSelected = activeApplication === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveApplication(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-violet-950/60 to-slate-900 border-violet-500 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className={`p-2 rounded-lg w-fit mb-2 ${isSelected ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-white line-clamp-1">{item.title}</div>
                  <span className={`text-[9px] font-mono mt-1 block font-semibold ${
                    item.fitColor === 'emerald' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {item.fitColor === 'emerald' ? 'Strategic Target' : 'Not Road Viable'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Application Deep-Dive Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  {app.spec}
                </span>
                <h4 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                  {app.title}
                  {app.fitColor === 'emerald' ? (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {app.fit}
                    </span>
                  ) : (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {app.fit}
                    </span>
                  )}
                </h4>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">Mass Impact</span>
                <span className={`font-bold ${app.fitColor === 'emerald' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {app.weightReduction}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {app.desc}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Cooling Architecture:</span>
                <span className="text-cyan-300 font-semibold">{app.fuelSynergy}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Rare-Earth Geopolitical Risk:</span>
                <span className="text-emerald-400 font-semibold">100% Eliminated (MgB₂ Wire)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
