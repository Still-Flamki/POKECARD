
import React, { useState, useEffect } from 'react';

const STAGES = [
  { 
    id: 81, name: "MAGNAM", flux: "2.4T", voltage: "10kV", 
    lore: "It is born with the ability to defy gravity. It floats in the air by emitting electromagnetic waves.",
    status: "UNIT-01"
  },
  { 
    id: 82, name: "MAGNETO", flux: "8.2T", voltage: "50kV", 
    lore: "A link of three Magnemite, it emits powerful radio waves that can cause high-voltage headaches.",
    status: "LINKED"
  },
  { 
    id: 462, name: "MAGNEZONE", flux: "24.0T", voltage: "250kV", 
    lore: "It evolved from exposure to a special magnetic field. It sometimes emits radar to monitor its territory.",
    status: "ARRAY"
  }
];

const MagnetonView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const active = STAGES[stageIndex];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 45,
        y: (window.innerHeight / 2 - e.clientY) / 45
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#0b0b0d] overflow-hidden p-6 sm:p-12">
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="magneticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 15 }).map((_, i) => (
              <ellipse 
                key={i} 
                cx="50" cy="50" rx={10 + i * 10} ry={20 + i * 18} 
                fill="none" stroke="url(#magneticGrad)" strokeWidth="0.15"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.15}s`, transformOrigin: 'center' }}
              />
            ))}
         </svg>
      </div>

      {/* Magnetic Filing Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const x = (i * 7) % 100;
          const y = (i * 13) % 100;
          const dx = (mousePos.x / window.innerWidth) * 100 - x;
          const dy = (mousePos.y / window.innerHeight) * 100 - y;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <div 
              key={i}
              className="absolute w-[1px] h-3 bg-zinc-400 opacity-20"
              style={{
                left: x + '%',
                top: y + '%',
                transform: `rotate(${angle}deg)`
              }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-px h-4 bg-blue-300 animate-spark-static"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 0.2 + 0.1) + 's',
              animationDelay: (Math.random() * 5) + 's'
            }}
          />
        ))}
      </div>

      <div 
        className="relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-transform duration-300 ease-out preserve-3d z-20 group"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#1a1a1c] border-2 border-zinc-600 rounded-[45px] sm:rounded-[65px] shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col backdrop-blur-3xl">
          
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter italic uppercase">{active.name}</h2>
              <div className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.8em]">STATUS: {active.status}</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-600 shadow-inner group-hover:border-blue-500 transition-colors">
               <i className="fa-solid fa-magnet text-2xl text-red-500 animate-bounce"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-black rounded-[40px] sm:rounded-[55px] border border-zinc-700 relative overflow-hidden flex items-center justify-center group-hover:bg-zinc-900 transition-all duration-500">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
             <div className="w-full h-full p-8 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[110%] max-h-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in zoom-in"
                />
             </div>
          </div>

          <div className="px-8 mt-6 flex items-center justify-center gap-6">
             {STAGES.map((stage, idx) => (
                <button 
                  key={stage.id} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center group/evo focus:outline-none"
                >
                   <div className={`w-14 h-14 rounded-full border-2 ${stageIndex === idx ? 'border-blue-400 bg-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'border-white/10 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[7px] mt-2 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-blue-400' : 'text-zinc-600'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-8 space-y-4 flex-shrink-0">
             <div className="bg-zinc-900 border border-zinc-700 p-4 rounded-[25px]">
                <p className="text-zinc-400 text-[10px] sm:text-[11px] font-bold italic text-center">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.flux}</div>
                   <span>FLUX</span>
                </div>
                <div className="w-px h-8 bg-zinc-700"></div>
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.voltage}</div>
                   <span>POWER</span>
                </div>
             </div>
          </div>

          <div className="h-14 sm:h-18 bg-zinc-800 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.4em] text-xs">
             DISCHARGE
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spark-static {
          0%, 100% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 1; transform: scaleY(1.5); }
        }
        .animate-spark-static { animation: spark-static linear infinite; }
      `}</style>
    </div>
  );
};

export default MagnetonView;
