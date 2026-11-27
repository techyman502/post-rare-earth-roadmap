// Motor, Geometry, and Compliance Datasets for Post-Rare-Earth EV Motor Studio

export const VEHICLE_CLASSES = {
  scooter: {
    id: 'scooter',
    name: '2W Scooter',
    subtitle: 'Urban Micro-mobility',
    powerKw: 10,
    batteryKwh: 3.5,
    batteryCostPerKwh: 115,
    ndfebKg: 0.20,
    pricing: {
      china: 13,
      exChinaStress: 25,
    },
    specs: {
      voltage: '48V - 72V',
      topSpeed: '85 km/h',
      annualProduction: '250,000 units',
      urbanStopGo: 'Very High (85%)'
    }
  },
  bev: {
    id: 'bev',
    name: 'Passenger BEV',
    subtitle: 'C/D-Segment Sedan / SUV',
    powerKw: 150,
    batteryKwh: 60,
    batteryCostPerKwh: 115,
    ndfebKg: 1.9,
    pricing: {
      china: 131,
      exChinaStress: 281,
    },
    specs: {
      voltage: '400V - 800V',
      range: '480 km (WLTP)',
      annualProduction: '100,000 units',
      urbanStopGo: 'Moderate (55%)'
    }
  },
  bus: {
    id: 'bus',
    name: 'Electric Bus',
    subtitle: '12m Transit City Bus',
    powerKw: 250,
    batteryKwh: 280,
    batteryCostPerKwh: 115,
    ndfebKg: 4.5,
    pricing: {
      china: 315,
      exChinaStress: 694,
    },
    specs: {
      voltage: '600V - 750V',
      dailyMileage: '280 km',
      annualProduction: '10,000 units',
      urbanStopGo: 'Extreme (90%)'
    }
  }
};

export const REPLACEMENT_TOPOLOGIES = {
  eesm: {
    id: 'eesm',
    name: 'EESM',
    fullName: 'Electrically Excited Synchronous Motor',
    pf: 0.90,
    inverterKvaDelta: 3.9, // +3.9%
    effDelta: -0.5, // -0.5%
    drawback: 'Slip-ring wear or inductive exciter complexity; high BMW/ZF patent density',
    rareEarthFree: true,
    ferriteUsage: false,
    keyOems: ['BMW (5th Gen eDrive)', 'ZF Friedrichshafen', 'Renault Megane E-Tech', 'Mahle'],
    technologyReadiness: 'TRL 9 (Series Mass Production)',
    rotorArchitecture: 'Wound copper rotor with brushless inductive contactless exciter',
    inverterSiliconImpact: 'Minimal (+3.9% kVA rating; standard SiC / IGBT 6-pack)',
    thermalManagement: 'Direct rotor shaft oil cooling required for rotor copper I²R losses',
    patentLandscape: 'High concentration of foundational brushless exciter IP with BMW AG & ZF'
  },
  pma_synrm: {
    id: 'pma_synrm',
    name: 'Ferrite PMa-SynRM',
    fullName: 'Permanent Magnet-assisted SynRM (SrFe Ferrite)',
    pf: 0.78,
    inverterKvaDelta: 19.8, // +19.8%
    effDelta: -1.5, // -1.5%
    drawback: '~30% larger/heavier; cold-weather demag risk at -20°C to -40°C',
    rareEarthFree: true,
    ferriteUsage: true,
    keyOems: ['Nissan e-Power (Gen 3 study)', 'Stellantis / Nidec JV', 'Proterial (formerly Hitachi Metals)'],
    technologyReadiness: 'TRL 7 (Vehicle Prototypes & Pre-series)',
    rotorArchitecture: 'Laminated flux barriers loaded with non-critical Strontium Ferrite (SrFeO) tiles',
    inverterSiliconImpact: 'Moderate (+19.8% kVA oversizing; larger SiC MOSFET dies or paralleling)',
    thermalManagement: 'Critical inverted demagnetization risk: Ferrite coercivity drops precipitously at sub-zero cold starts (-20°C to -40°C)',
    patentLandscape: 'Moderate; barrier geometry patented by Proterial, ABB, and university consortia'
  },
  induction: {
    id: 'induction',
    name: 'AC Induction',
    fullName: 'Asynchronous Squirrel-Cage Induction Motor',
    pf: 0.83,
    inverterKvaDelta: 14.5, // +14.5%
    effDelta: -2.5, // -2.5%
    drawback: 'Higher rotor slip heat; lower urban partial-load efficiency',
    rareEarthFree: true,
    ferriteUsage: false,
    keyOems: ['Tesla (Front secondary axle on Dual-Motor)', 'Audi e-tron / Q8 e-tron', 'Mercedes EQB'],
    technologyReadiness: 'TRL 9 (Global Benchmark Standard)',
    rotorArchitecture: 'Die-cast copper or aluminum squirrel-cage conductor bars',
    inverterSiliconImpact: 'Moderate (+14.5% kVA to supply rotor magnetizing current component)',
    thermalManagement: 'High continuous rotor slip I²R losses, especially at low-speed high-torque hill climbs',
    patentLandscape: 'Open / Expired core patents; modern field-oriented control algorithms commoditized'
  },
  synrm: {
    id: 'synrm',
    name: 'Pure SynRM',
    fullName: 'Pure Synchronous Reluctance Motor',
    pf: 0.70,
    inverterKvaDelta: 35.7, // +35.7%
    effDelta: -2.0, // -2.0%
    drawback: 'Higher torque ripple; requires tight air-gap & custom control',
    rareEarthFree: true,
    ferriteUsage: false,
    keyOems: ['ABB Industrial Traction', 'KSB Pumps', 'Mahle MCT Research'],
    technologyReadiness: 'TRL 6-7 (Commercial in pumps/fans; emerging in EV)',
    rotorArchitecture: 'Zero magnet; heavily slotted steel laminations forming d/q axis saliency ratio',
    inverterSiliconImpact: 'High (+35.7% kVA penalty due to low PF 0.70; SiC inverter cost rises ~22%)',
    thermalManagement: 'Cold rotor running (zero rotor current); excellent thermal reliability',
    patentLandscape: 'Rib geometry and structural web reinforcement IP held by ABB, KSB, and Valeo'
  },
  srm: {
    id: 'srm',
    name: 'SRM / SSRD',
    fullName: 'Switched Reluctance / Segmented Rotor Motor',
    pf: 0.62,
    inverterKvaDelta: 54.9, // +54.9%
    effDelta: -2.0, // -2.0%
    drawback: 'High acoustic noise/whine; requires asymmetric-bridge inverter',
    rareEarthFree: true,
    ferriteUsage: false,
    keyOems: ['Enedym (McMaster spin-off)', 'Turntide Technologies', 'JLR Advanced Research'],
    technologyReadiness: 'TRL 5-6 (Demonstrator vehicles, industrial HVAC fleets)',
    rotorArchitecture: 'Doubly salient laminated poles, no windings, no bars, ultra-robust mechanical integrity',
    inverterSiliconImpact: 'Severe (+54.9% kVA oversizing; non-standard asymmetric H-bridge or modified topology)',
    thermalManagement: 'Ultra-low rotor heat; capable of extreme 200°C+ ambient harsh mining/off-road duty',
    patentLandscape: 'Acoustic cancellation and radial force harmonic dampening control algorithms heavily patented'
  }
};

export const PRICING_SCENARIOS = {
  china: {
    id: 'china',
    name: 'China Domestic',
    tag: 'Baseline Supply Chain',
    dyMultiplier: '1.0x (Baseline)',
    desc: 'Unrestricted domestic Chinese tolling; low Dy oxide prices (~$240/kg USD equivalent)',
    color: '#10b981'
  },
  exChinaStress: {
    id: 'exChinaStress',
    name: '2026 Ex-China Stress (Dy 7.5x)',
    tag: 'Geopolitical Embargo Stress',
    dyMultiplier: '7.5x Dysprosium Spike',
    desc: 'MOFCOM export licenses restricted; ex-China Dysprosium (Dy) surges 7.5x to ~$1,800/kg',
    color: '#f43f5e'
  }
};

// TAB 2: Curvilinear Magnet Lab Benchmarks
export const COERCIVITY_BENCHMARKS = [
  {
    name: 'Curvilinear Fe-Ni-P',
    category: 'Nanowire Lab Prototype',
    coercivityOe: 440,
    color: '#00f2fe',
    description: 'Shape-anisotropy electrodeposited nanowires (lab ceiling: ~440 Oe)',
    isInteractive: true,
  },
  {
    name: 'Iron Nitride (Fe₁₆N₂)',
    category: 'Emerging Non-RE Bulk',
    coercivityOe: 2100,
    color: '#38bdf8',
    description: 'Metastable alpha-prime Fe16N2; phase instability above 150°C',
    isInteractive: false,
  },
  {
    name: 'Ferrite Y38 (SrFeO)',
    category: 'Automotive Grade Ferrite',
    coercivityOe: 3800,
    color: '#f59e0b',
    description: 'Ceramic magnet in PMa-SynRM; vulnerable to cold demagnetization (-20°C)',
    isInteractive: false,
  },
  {
    name: 'NdFeB N48UH (Dy-doped)',
    category: 'EV Traction Benchmark',
    coercivityOe: 25000,
    color: '#f43f5e',
    description: 'Gold standard for EV traction; 3-4% Dy content, high thermal stability (180°C)',
    isInteractive: false,
  }
];

// TAB 3: MOFCOM Export Compliance Rules
export const MAGNET_GRADES = {
  N52: {
    id: 'N52',
    name: 'N52 (LREE-only)',
    subtitle: 'High Remanence, Zero Heavy Rare Earths',
    defaultDyTb: 0.0,
    maxTemp: '80°C',
    brKgs: '14.2 - 14.7 kGs',
    hcjKoe: '≥ 11 kOe',
    heavyReElements: '0% (Pure Neodymium / Praseodymium)',
    typicalUses: 'Consumer electronics, voice coil motors, room-temperature actuators',
    description: 'No Dysprosium or Terbium added. Thermally unsuitable for primary EV traction motors.'
  },
  N42SH: {
    id: 'N42SH',
    name: 'N42SH',
    subtitle: 'Super High Temp Grade',
    defaultDyTb: 1.8,
    maxTemp: '150°C',
    brKgs: '12.8 - 13.4 kGs',
    hcjKoe: '≥ 21 kOe',
    heavyReElements: '1.5% - 2.5% Dy/Tb (by wt)',
    typicalUses: 'Electric power steering (EPS), auxiliary e-compressors, hybrid e-axles',
    description: 'Contains moderate Dy/Tb to resist demagnetization up to 150°C continuous.'
  },
  N48UH: {
    id: 'N48UH',
    name: 'N48UH',
    subtitle: 'Ultra High Temp Traction Grade',
    defaultDyTb: 3.5,
    maxTemp: '180°C',
    brKgs: '13.7 - 14.3 kGs',
    hcjKoe: '≥ 25 kOe',
    heavyReElements: '3.0% - 4.5% Dy/Tb (by wt)',
    typicalUses: 'Primary EV Traction Motors (Tesla Model 3/Y rear, BYD, Porsche Taycan)',
    description: 'Industry benchmark for permanent magnet EV traction; heavily dependent on Chinese HREE separation.'
  },
  N42EH: {
    id: 'N42EH',
    name: 'N42EH',
    subtitle: 'Extra High Temp Extreme Duty',
    defaultDyTb: 5.0,
    maxTemp: '200°C',
    brKgs: '12.8 - 13.4 kGs',
    hcjKoe: '≥ 30 kOe',
    heavyReElements: '4.8% - 6.5% Dy/Tb (by wt)',
    typicalUses: 'Heavy commercial transit, high-performance hypercars, defense/aerospace',
    description: 'Maximum thermal resilience; extreme heavy rare earth loading and highest regulatory vulnerability.'
  }
};
