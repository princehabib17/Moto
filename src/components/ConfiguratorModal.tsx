import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Zap, Sparkles, Scale, DollarSign, Cpu } from 'lucide-react';

interface ConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfiguratorModal({ isOpen, onClose }: ConfiguratorModalProps) {
  // Config states
  const [model, setModel] = useState('KRGT-1');
  const [finish, setFinish] = useState('Billet Raw');
  const [wheels, setWheels] = useState('Carbon Fiber BST');
  const [exhaust, setExhaust] = useState('Titanium 2-into-1');
  const [saddle, setSaddle] = useState('Solo Alcantara');
  const [accent, setAccent] = useState('Crimson Red');
  
  // Commission form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [commissionId, setCommissionId] = useState('');

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Options Data
  const models = [
    { name: 'KRGT-1', basePrice: 94000, baseHP: 122, baseWeight: 538 },
    { name: 'ARCH 1s', basePrice: 115000, baseHP: 124, baseWeight: 512 },
    { name: 'Method 143', basePrice: 160000, baseHP: 145, baseWeight: 495 }
  ];

  const finishes = [
    { name: 'Billet Raw', price: 0, colorCode: '#bcbcbc' },
    { name: 'Stealth Black', price: 3500, colorCode: '#121212' },
    { name: 'Obsidian Red', price: 4200, colorCode: '#b91c1c' },
    { name: 'Electro Gold', price: 5800, colorCode: '#d4af37' }
  ];

  const wheelOptions = [
    { name: 'Carbon Fiber BST', price: 0, weightMod: 0 },
    { name: 'Forged Concave', price: 2200, weightMod: 8 },
    { name: 'Billet Multi-Spoke', price: 1800, weightMod: 15 }
  ];

  const exhaustOptions = [
    { name: 'Titanium 2-into-1', price: 0, hpMod: 0 },
    { name: 'Straight Pipe Drag', price: 1500, hpMod: 6 },
    { name: 'Slashed Blackout Duals', price: 1200, hpMod: 2 }
  ];

  const saddleOptions = [
    { name: 'Solo Alcantara', price: 0 },
    { name: 'Premium Horween Leather', price: 850 },
    { name: 'Minimalist Race Foam', price: -200 }
  ];

  const accentColors = [
    { name: 'Crimson Red', code: '#E11D2A' },
    { name: 'Liquid Blue', code: '#2563EB' },
    { name: 'Gunmetal Gray', code: '#4B5563' },
    { name: 'Solar Gold', code: '#D97706' }
  ];

  // Calculations
  const selectedModel = models.find(m => m.name === model) || models[0];
  const selectedFinish = finishes.find(f => f.name === finish) || finishes[0];
  const selectedWheel = wheelOptions.find(w => w.name === wheels) || wheelOptions[0];
  const selectedExhaust = exhaustOptions.find(e => e.name === exhaust) || exhaustOptions[0];
  const selectedSaddle = saddleOptions.find(s => s.name === saddle) || saddleOptions[0];
  const selectedAccent = accentColors.find(a => a.name === accent) || accentColors[0];

  const totalPrice = selectedModel.basePrice + selectedFinish.price + selectedWheel.price + selectedExhaust.price + selectedSaddle.price;
  const totalHP = selectedModel.baseHP + selectedExhaust.hpMod;
  const totalWeight = selectedModel.baseWeight + selectedWheel.weightMod;

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) return;
    
    // Generate custom commission code
    const rand = Math.floor(1000 + Math.random() * 9000);
    setCommissionId(`RVT-${model.replace('-', '')}-${rand}`);
    setFormSubmitted(true);
  };

  const resetConfigurator = () => {
    setFormSubmitted(false);
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md pointer-events-auto overflow-y-auto">
      <div 
        className="relative w-full max-w-6xl min-h-screen sm:min-h-[85vh] bg-[#0c0c0c] sm:rounded-3xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl"
        id="configurator-container"
      >
        {/* Editorial border chrome */}
        <div className="absolute inset-[10px] border border-white/5 pointer-events-none rounded-2xl hidden sm:block"></div>
        <div className="absolute top-[16px] left-[16px] w-2 h-2 border-t border-l border-white/50 hidden sm:block"></div>
        <div className="absolute top-[16px] right-[16px] w-2 h-2 border-t border-r border-white/50 hidden sm:block"></div>
        <div className="absolute bottom-[16px] left-[16px] w-2 h-2 border-b border-l border-white/50 hidden sm:block"></div>
        <div className="absolute bottom-[16px] right-[16px] w-2 h-2 border-b border-r border-white/50 hidden sm:block"></div>

        {/* Top bar header */}
        <div className="relative z-10 px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-anton text-h3 tracking-wider text-white uppercase m-0 leading-none">Bespoke Configurator</h3>
            <h6 className="font-mono text-nano text-[#E11D2A] uppercase tracking-[0.25em] font-medium block mt-1">Series 04 / machined precision</h6>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            id="close-configurator-btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content body split */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 bg-transparent overflow-y-auto">
          
          {/* Left panel: Customizer selectors */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[70vh] lg:max-h-[650px] scrollbar-thin scrollbar-thumb-white/10">
            {!formSubmitted ? (
              <>
                {/* 1. SELECT BASE MOTOCYCLE */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-anton text-[#E11D2A] text-h3">01</span>
                    <h6 className="font-mono text-micro font-black uppercase tracking-wider text-white">Chassis Series</h6>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {models.map((m) => (
                      <button
                        key={m.name}
                        onClick={() => setModel(m.name)}
                        className={`btn-active-scale p-4 rounded-xl text-left border transition-all ${
                          model === m.name
                            ? 'bg-white/5 border-[#E11D2A] text-white shadow-[0_0_15px_rgba(225,29,42,0.15)]'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-200'
                        }`}
                      >
                        <h5 className="font-bold text-body tracking-wide mb-1 select-none">{m.name}</h5>
                        <div className="font-mono text-body opacity-75">
                          ${m.basePrice.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. CHASSIS FINISH */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-anton text-[#E11D2A] text-h3">02</span>
                    <h6 className="font-mono text-micro font-black uppercase tracking-wider text-white">Aluminum Finish</h6>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {finishes.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setFinish(f.name)}
                        className={`btn-active-scale p-3 rounded-xl border flex flex-col items-start gap-2 transition-all text-left ${
                          finish === f.name
                            ? 'bg-white/5 border-[#E11D2A] text-white'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: f.colorCode }} />
                        <div>
                          <div className="font-bold text-body leading-tight">{f.name}</div>
                          <div className="font-mono text-body opacity-75 mt-0.5">
                            {f.price === 0 ? 'Included' : `+$${f.price.toLocaleString()}`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. WHEEL CONFIGURATION */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-anton text-[#E11D2A] text-h3">03</span>
                    <h6 className="font-mono text-micro font-black uppercase tracking-wider text-white">BST Rim Setup</h6>
                  </div>
                  <div className="space-y-2">
                    {wheelOptions.map((w) => (
                      <button
                        key={w.name}
                        onClick={() => setWheels(w.name)}
                        className={`btn-active-scale w-full p-3 px-4 rounded-xl text-left border flex items-center justify-between gap-3 transition-all ${
                          wheels === w.name
                            ? 'bg-white/5 border-[#E11D2A] text-white'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-black border border-white/15 flex items-center justify-center">
                            {wheels === w.name && <Check size={10} className="text-[#E11D2A]" />}
                          </div>
                          <div>
                            <span className="font-bold text-body">{w.name}</span>
                            <h6 className="text-nano opacity-60 ml-2 font-mono inline-block">
                              {w.weightMod === 0 ? 'Lightest' : `+${w.weightMod} lbs`}
                            </h6>
                          </div>
                        </div>
                        <span className="font-mono text-body">
                          {w.price === 0 ? 'Standard' : `+$${w.price}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. EXHAUST SPECIFICATION */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-anton text-[#E11D2A] text-h3">04</span>
                    <h6 className="font-mono text-micro font-black uppercase tracking-wider text-white">Powerplant Pipe & Tuning</h6>
                  </div>
                  <div className="space-y-2">
                    {exhaustOptions.map((e) => (
                      <button
                        key={e.name}
                        onClick={() => setExhaust(e.name)}
                        className={`btn-active-scale w-full p-3 px-4 rounded-xl text-left border flex items-center justify-between gap-3 transition-all ${
                          exhaust === e.name
                            ? 'bg-white/5 border-[#E11D2A] text-white'
                            : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-black border border-white/15 flex items-center justify-center">
                            {exhaust === e.name && <Check size={10} className="text-[#E11D2A]" />}
                          </div>
                          <div>
                            <span className="font-bold text-body">{e.name}</span>
                            <h6 className="text-nano opacity-60 ml-2 font-mono inline-block">
                              {e.hpMod === 0 ? 'Engine Spec' : `+${e.hpMod} HP output`}
                            </h6>
                          </div>
                        </div>
                        <span className="font-mono text-body">
                          {e.price === 0 ? 'Standard' : `+$${e.price}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. SADDLE TYPE & COLOR ACCENT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Saddle Type */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-anton text-[#E11D2A] text-h3">05</span>
                      <h6 className="font-mono text-micro font-black uppercase tracking-wider text-white">Bespoke Saddle</h6>
                    </div>
                    <div className="space-y-2">
                      {saddleOptions.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => setSaddle(s.name)}
                          className={`btn-active-scale w-full p-2.5 px-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                            saddle === s.name
                              ? 'bg-white/5 border-[#E11D2A] text-white'
                              : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          <span className="font-bold text-body select-none">{s.name}</span>
                          <span className="font-mono text-body">
                            {s.price === 0 ? 'Bespoke' : s.price < 0 ? `-$${Math.abs(s.price)}` : `+$${s.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlight Accents */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-anton text-[#E11D2A] text-h3">06</span>
                      <h6 className="font-mono text-micro font-black uppercase tracking-wider text-white">Accent Anodize</h6>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {accentColors.map((a) => (
                        <button
                          key={a.name}
                          onClick={() => setAccent(a.name)}
                          className={`btn-active-scale p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                            accent === a.name
                              ? 'bg-white/5 border-[#E11D2A] text-white'
                              : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full inline-block shrink-0 border border-white/15" style={{ backgroundColor: a.code }} />
                          <h6 className="font-bold text-nano tracking-tight truncate select-none inline-block">{a.name}</h6>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Success Commission Sheet Overlay */
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-650/10 border border-[#E11D2A] flex items-center justify-center text-[#E11D2A] animate-pulse">
                  <Sparkles size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-anton text-h2 text-white uppercase tracking-wider">Commission Acknowledged</h4>
                  <h6 className="font-mono text-micro text-[#E11D2A] tracking-widest font-black uppercase">COMMISSION ID: {commissionId}</h6>
                  <p className="text-gray-400 text-body max-w-md mx-auto leading-relaxed mt-4">
                    Thank you, <strong className="text-white">{buyerName}</strong>. Our Master Builder is reviewing your billet-grade configuration specifications. We have sent the technical build proposal and pricing outline to <strong className="text-white">{buyerEmail}</strong>.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-left w-full max-w-md space-y-3 font-mono text-gray-400 leading-snug">
                  <h6 className="text-[#E11D2A] font-bold text-micro border-b border-white/10 pb-2 mb-2">COMMISSION CERTIFICATE</h6>
                  <h6 className="text-nano">CHASSIS: <span className="text-white float-right">{model}</span></h6>
                  <h6 className="text-nano">FINISH: <span className="text-white float-right">{finish}</span></h6>
                  <h6 className="text-nano">BST WHEELS: <span className="text-white float-right">{wheels}</span></h6>
                  <h6 className="text-nano">EXHAUST: <span className="text-white float-right">{exhaust}</span></h6>
                  <h6 className="text-nano">SADDLE: <span className="text-white float-right">{saddle}</span></h6>
                  <h6 className="text-nano">ANODIZE AT: <span className="text-white float-right" style={{ color: selectedAccent.code }}>{accent}</span></h6>
                  <h6 className="border-t border-white/10 pt-2 mt-2 font-bold text-white text-nano">BILL OF MATERIALS: <span className="text-[#E11D2A] float-right">${totalPrice.toLocaleString()} USD</span></h6>
                </div>

                <button 
                  onClick={resetConfigurator}
                  className="bg-transparent border border-white/20 hover:border-[#E11D2A] text-white hover:text-[#E11D2A] px-6 py-2.5 rounded-full text-body font-mono tracking-widest transition-all font-bold uppercase cursor-pointer"
                >
                  Configure Another Build
                </button>
              </div>
            )}
          </div>

          {/* Right panel: Spec Sheet & Price Summary */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-black/60 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <h6 className="font-mono text-nano uppercase tracking-[0.3em] text-gray-500 font-extrabold">Selected Prototype</h6>
                <h4 className="font-anton text-display text-[#E11D2A] tracking-wider leading-none">{model}</h4>
              </div>

              {/* Specs readout */}
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-white/15">
                <div className="text-center">
                  <h6 className="text-nano font-mono text-gray-500 tracking-wider uppercase flex justify-center items-center gap-1">
                    <Zap size={10} style={{ color: selectedAccent.code }} /> Max Output
                  </h6>
                  <div className="font-anton text-h3 text-white mt-1 leading-none">{totalHP} <h6 className="text-nano font-mono font-bold inline-block" style={{ color: selectedAccent.code }}>HP</h6></div>
                </div>
                <div className="text-center border-l border-r border-white/10">
                  <h6 className="text-nano font-mono text-gray-500 tracking-wider uppercase flex justify-center items-center gap-1">
                    <Scale size={10} style={{ color: selectedAccent.code }} /> Dry Mass
                  </h6>
                  <div className="font-anton text-h3 text-white mt-1 leading-none">{totalWeight} <h6 className="text-nano font-mono font-bold inline-block" style={{ color: selectedAccent.code }}>LBS</h6></div>
                </div>
                <div className="text-center">
                  <h6 className="text-nano font-mono text-gray-500 tracking-wider uppercase flex justify-center items-center gap-1">
                    <Cpu size={10} style={{ color: selectedAccent.code }} /> Lead Time
                  </h6>
                  <div className="font-anton text-h3 text-white mt-1 leading-none">6-8 <h6 className="text-nano font-mono font-bold inline-block" style={{ color: selectedAccent.code }}>MO</h6></div>
                </div>
              </div>

              {/* dynamic customizer mock rendering of details */}
              <div className="bg-[#111111] p-4 rounded-xl border border-white/5 space-y-3 font-mono text-body leading-relaxed">
                <div className="text-gray-500 font-black tracking-widest uppercase flex items-center justify-between text-body">
                  <span>BILL OF MATERIALS</span>
                  <h6 className="text-nano font-normal lowercase tracking-normal">Calculated USD</h6>
                </div>
                <div className="h-[1px] bg-white/5" />
                
                <div className="flex justify-between">
                  <span className="text-gray-400">{model} Billet Chassis</span>
                  <span className="text-white font-bold">${selectedModel.basePrice.toLocaleString()}</span>
                </div>

                {selectedFinish.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Finish — {selectedFinish.name}</span>
                    <span className="text-white">+${selectedFinish.price.toLocaleString()}</span>
                  </div>
                )}

                {selectedWheel.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wheels — {selectedWheel.name}</span>
                    <span className="text-white">+${selectedWheel.price.toLocaleString()}</span>
                  </div>
                )}

                {selectedExhaust.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Exhaust — {selectedExhaust.name}</span>
                    <span className="text-white">+${selectedExhaust.price.toLocaleString()}</span>
                  </div>
                )}

                {selectedSaddle.price !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Saddle — {selectedSaddle.name}</span>
                    <span className="text-white">
                      {selectedSaddle.price < 0 ? `-$${Math.abs(selectedSaddle.price)}` : `+$${selectedSaddle.price}`}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 text-body">
                  <span>Accent Anodize color</span>
                  <span style={{ color: selectedAccent.code }}>{selectedAccent.name}</span>
                </div>
 
                <div className="h-[1px] bg-white/5" />
                <div className="flex justify-between items-baseline text-body font-bold text-white">
                  <span>ESTIMATED TOTAL</span>
                  <span className="font-anton text-h3 tracking-wider text-white" style={{ textShadow: `0 0 10px ${selectedAccent.code}40` }}>
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Commission Request details */}
            {!formSubmitted && (
              <form onSubmit={handleCommissionSubmit} className="space-y-3 mt-6 lg:mt-0 font-sans">
                <div className="space-y-2">
                  <h6 className="font-mono text-nano uppercase tracking-widest text-gray-400 block font-black">Commission Request</h6>
                  <div className="grid grid-cols-1 gap-2">
                    <input 
                      type="text" 
                      placeholder="YOUR FULL NAME"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                      className="bg-white/5 hover:bg-white/10 focus:bg-[#0c0c0c] border border-white/5 hover:border-white/15 focus:border-[#E11D2A] text-white rounded-lg px-3 py-2 text-body font-semibold focus:outline-none placeholder-gray-600 transition-all uppercase"
                    />
                    <input 
                      type="email" 
                      placeholder="YOUR EMAIL TARGET"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                      className="bg-white/5 hover:bg-white/10 focus:bg-[#0c0c0c] border border-white/5 hover:border-white/15 focus:border-[#E11D2A] text-white rounded-lg px-3 py-2 text-body font-semibold focus:outline-none placeholder-gray-600 transition-all uppercase"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-red-650 text-white font-bold uppercase tracking-[0.2em] py-3 px-5 rounded-xl text-center text-body flex items-center justify-center gap-2 transition-all hover:bg-red-700 hover:shadow-[0_0_20px_rgba(225,29,42,0.4)] cursor-pointer"
                  style={{ backgroundColor: selectedAccent.code }}
                  id="submit-bespoke-commission-btn"
                >
                  <Shield size={14} className="animate-spin-slow" />
                  SUBMIT commission RESERVATION
                </button>
                <h6 className="block text-center font-mono text-nano text-gray-600 uppercase tracking-widest mt-1">
                  secure military billet validation guaranteed
                </h6>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
