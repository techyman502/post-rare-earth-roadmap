import React from 'react';
import { Cpu, ShieldCheck, Zap, Layers, Globe2, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pricingScenario, setPricingScenario }) {
  const tabs = [
    { id: 'tab1', label: '1. Motor TCO Simulator', icon: Zap, badge: 'OEM Economics' },
    { id: 'tab2', label: '2. Curvilinear Geometry Lab', icon: Layers, badge: 'Shape Anisotropy' },
    { id: 'tab3', label: '3. MOFCOM Compliance Checker', icon: ShieldCheck, badge: 'Geopolitics & Sanctions' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07090e]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Pitch Header */}
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="h-full w-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Cpu className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono">
                  POST-RARE-EARTH <span className="text-cyan-400">STUDIO</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  PITCH DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-normal hidden sm:block">
                Next-Gen Non-NdFeB Powertrain Economics & Regulatory Verification
              </p>
            </div>
          </div>

          {/* Pricing Scenario Global Toggle */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center bg-[#0d1322] border border-slate-800 rounded-lg p-1">
              <span className="text-[11px] font-semibold text-slate-400 px-2.5 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                Scenario:
              </span>
              <button
                onClick={() => setPricingScenario('china')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  pricingScenario === 'china'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                China Domestic
              </button>
              <button
                onClick={() => setPricingScenario('exChinaStress')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                  pricingScenario === 'exChinaStress'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                2026 Ex-China (Dy 7.5x)
              </button>
            </div>
          </div>

        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-800/60 py-2.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
