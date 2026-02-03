
import React, { useState, useEffect } from 'react';

const STAGES = [
  { 
    id: 7, name: "SQUIRTLE", hydro: 70, shell: 85, 
    lore: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth."
  },
  { 
    id: 8, name: "WARTORTLE", hydro: 85, shell: 100, 
    lore: "It is recognized as a symbol of longevity. If its shell has algae on it, that Wartortle is very old."
  },
  { 
    id: 9, name: "BLASTOISE", hydro: 110, shell: 120, 
    lore: "It crushes its foe under its heavy body to cause fainting. In a pinch, it will withdraw inside its shell."
  }
];

const SquirtleView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const active = STAGES[stageIndex];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 45,
        y: (window.innerHeight / 2 - e.clientY) / 45
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#000a12] overflow-hidden p-6 sm:p-12">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-black pointer-events-none" />
      
      {/* Underwater Caustics Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-transparent animate-caustics-drift" />
         <div className="absolute inset-0 bg-gradient-to-tr from-cyan-300/10 via-transparent to-transparent animate-caustics-drift-alt" />
      </div>

      <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none z-10 animate-wave" />

      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full border border-white/40 bg-white/5 backdrop-blur-[2px] animate-rise-bubble"
            style={{
              width: Math.random() * 30 + 5 + 'px', height: Math.random() * 30 + 5 + 'px',
              left: Math.random() * 100 + '%', bottom: '-10%',
              animationDuration: Math.random() * 6 + 4 + 's', animationDelay: Math.random() * 12 + 's'
            }}
          />
        ))}
      </div>

      <div 
        className="relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-transform duration-300 ease-out preserve-3d z-20 group"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#001524] border-2 border-cyan-500/40 rounded-[45px] sm:rounded-[65px] shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col backdrop-blur-3xl">
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.6)] italic">{active.name}</h2>
              <div className="text-cyan-400 text-[9px] font-black uppercase tracking-[0.8em] opacity-80">ID: {String(active.id).padStart(3, '0')}</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.8)]">
               <i className="fa-solid fa-droplet text-2xl text-white"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-gradient-to-br from-cyan-900/40 via-black to-black rounded-[40px] sm:rounded-[55px] border border-cyan-500/20 relative overflow-hidden flex items-center justify-center">
             <div className="w-full h-full p-8 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[110%] max-h-full object-contain drop-shadow-[0_0_50px_rgba(6,182,212,0.7)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in"
                />
             </div>
          </div>

          <div className="px-8 mt-4 flex items-center justify-center gap-4">
             {STAGES.map((stage, idx) => (
                <button 
                  key={stage.id} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center group/evo focus:outline-none"
                >
                   <div className={`w-12 h-12 rounded-full border ${stageIndex === idx ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/10 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-cyan-400' : 'text-white/20'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-6 space-y-4">
             <div className="bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-[20px]">
                <p className="text-cyan-100/40 text-[9px] sm:text-[10px] font-bold italic text-center">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-cyan-400">
                <div className="text-center">
                   <div className="text-xl text-white font-orbitron">{active.hydro}</div>
                   <span className="text-[8px] opacity-60">HYDRO</span>
                </div>
                <div className="w-px h-6 bg-cyan-500/20"></div>
                <div className="text-center">
                   <div className="text-xl text-white font-orbitron">{active.shell}</div>
                   <span className="text-[8px] opacity-60">SHELL</span>
                </div>
             </div>
          </div>

          <div className="h-14 sm:h-16 bg-cyan-600 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.2em] text-xs">
             Hydro Pump
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rise-bubble { 
          0% { transform: translateY(0) scale(1); opacity: 0; } 
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-120vh) scale(1.5); opacity: 0; } 
        }
        .animate-rise-bubble { animation: rise-bubble linear infinite; }
        @keyframes wave {
          0% { transform: translateY(0) translateX(0) skewY(0deg); }
          50% { transform: translateY(-10px) translateX(10px) skewY(2deg); }
          100% { transform: translateY(0) translateX(0) skewY(0deg); }
        }
        .animate-wave { animation: wave 5s ease-in-out infinite; }
        @keyframes caustics-drift {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0.1; }
          50% { transform: translate(50px, 30px) scale(1.2) rotate(5deg); opacity: 0.3; }
        }
        .animate-caustics-drift { animation: caustics-drift 8s ease-in-out infinite; }
        @keyframes caustics-drift-alt {
          0%, 100% { transform: translate(0, 0) scale(1.2) rotate(0deg); opacity: 0.1; }
          50% { transform: translate(-30px, 60px) scale(1) rotate(-8deg); opacity: 0.2; }
        }
        .animate-caustics-drift-alt { animation: caustics-drift-alt 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SquirtleView;
