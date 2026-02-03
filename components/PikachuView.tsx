
import React, { useState, useEffect, useRef } from 'react';

const STAGES = [
  { 
    id: 172, name: "PICHU", voltage: "10kV", state: "LOW CHARGE", 
    lore: "Its electricity-storing pouches are small. If it gets shocked, it will discharge electricity unintentionally.",
    status: "PRE-GEN"
  },
  { 
    id: 25, name: "PIKACHU", voltage: "85kV", state: "STABLE CURRENT", 
    lore: "It has small electric sacs on both its cheeks. If threatened, it looses electric charges from the sacs.",
    status: "UNIT-NOW"
  },
  { 
    id: 26, name: "RAICHU", voltage: "150kV", state: "MAX OVERLOAD", 
    lore: "Its long tail serves as a ground to protect itself from its own high-voltage power.",
    status: "ELITE-EVO"
  }
];

const PikachuView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);
  const [voltage, setVoltage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = STAGES[stageIndex];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 40,
        y: (window.innerHeight / 2 - e.clientY) / 40
      });
      if (Math.random() > 0.99) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80);
      }
    };
    window.addEventListener('mousemove', handleMove);

    const voltInterval = setInterval(() => {
      setVoltage(prev => {
        const target = stageIndex === 0 ? 30 : stageIndex === 1 ? 75 : 95;
        const diff = target - prev;
        return prev + diff * 0.1 + (Math.random() - 0.5) * 2;
      });
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(voltInterval);
    };
  }, [stageIndex]);

  return (
    <div className={`w-full h-full bg-[#0a0a02] transition-colors duration-1000 flex items-center justify-center p-4 sm:p-12 overflow-hidden ${glitch ? 'invert contrast-150' : ''}`}>
      {/* Circuitry Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0 50 L100 50 M50 0 L50 100" stroke="#facc15" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="2" fill="#facc15" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Dynamic Lightning Bolts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-yellow-400 shadow-[0_0_20px_#fef08a] w-[1px] h-40 animate-bolt-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.4
            }}
          />
        ))}
      </div>

      <div 
        className="relative w-full max-w-[440px] h-[85vh] transition-transform duration-300 ease-out preserve-3d z-10"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#0c0c03] border-4 border-yellow-500/20 rounded-[60px] shadow-[0_0_100px_rgba(250,204,21,0.05)] overflow-hidden flex flex-col backdrop-blur-3xl group transition-all duration-700 hover:border-yellow-400">
          
          <div className="p-10 pb-4 flex justify-between items-start z-10 relative">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black tracking-[0.5em] text-yellow-400/60 uppercase">High Voltage Detected</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-orbitron font-black text-white tracking-tighter italic uppercase drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                {active.name}
              </h2>
            </div>
            <div className="w-16 h-16 rounded-[24px] bg-yellow-500 flex items-center justify-center text-black font-black text-3xl shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse-fast">
               <i className="fa-solid fa-bolt-lightning"></i>
            </div>
          </div>

          <div className="flex-1 mx-8 mt-4 bg-gradient-to-br from-yellow-950/20 to-black/80 rounded-[50px] border border-yellow-500/10 relative overflow-hidden flex items-center justify-center group-hover:border-yellow-400/40 transition-all duration-500">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05)_0%,transparent_70%)]" />
             
             {/* Scanning Line */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-yellow-400/10 to-transparent animate-scanner-y opacity-30 z-20" />

             <div className="w-full h-full p-12 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[115%] max-h-full object-contain drop-shadow-[0_0_80px_rgba(250,204,21,0.8)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in zoom-in"
                />
             </div>
             
             <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1 font-mono text-[9px] text-yellow-400/40 z-20">
               <div>FLUX_CAP: {active.voltage}</div>
               <div>SYNC_STABILITY: 98.4%</div>
             </div>
          </div>

          <div className="px-8 mt-6 flex items-center justify-center gap-6">
             {STAGES.map((stage, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center group/evo focus:outline-none"
                >
                   <div className={`w-14 h-14 rounded-2xl border-2 ${stageIndex === idx ? 'border-yellow-400 bg-yellow-400/20 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-white/5 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[8px] mt-2 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-yellow-400' : 'text-white/20'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-10 space-y-8">
             <div className="bg-yellow-500/5 border border-white/5 p-6 rounded-[35px] backdrop-blur-sm shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400/20" />
                <p className="text-yellow-100/40 text-[11px] font-bold italic text-center leading-relaxed">"{active.lore}"</p>
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400/60">
                   <span>ENERGY DENSITY</span>
                   <span className="text-white text-base font-orbitron">{Math.floor(voltage)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                   <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-75 shadow-[0_0_15px_#facc15]"
                    style={{ width: `${voltage}%` }}
                   />
                </div>
             </div>
          </div>

          <button className="h-20 bg-yellow-500 hover:bg-white text-black flex items-center justify-center transition-all duration-500 cursor-pointer font-black uppercase tracking-[1.8em] text-xs shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
             THUNDERBOLT
          </button>
        </div>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes bolt-pulse {
          0%, 100% { opacity: 0; transform: scaleY(0.1); }
          50% { opacity: 0.6; transform: scaleY(1.2); }
        }
        .animate-bolt-pulse { animation: bolt-pulse linear infinite; }
        @keyframes scanner-y {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .animate-scanner-y { animation: scanner-y 4s linear infinite; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-fast { animation: pulse-fast 0.1s linear infinite; }
      `}</style>
    </div>
  );
};

export default PikachuView;
