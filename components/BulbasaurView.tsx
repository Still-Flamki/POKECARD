
import React, { useState, useEffect } from 'react';

const STAGES = [
  { 
    id: 1, name: "BULBASAUR", growth: 65, poison: 45, 
    lore: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon."
  },
  { 
    id: 2, name: "IVYSAUR", growth: 80, poison: 60, 
    lore: "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs."
  },
  { 
    id: 3, name: "VENUSAUR", growth: 100, poison: 85, 
    lore: "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight."
  }
];

const BulbasaurView: React.FC = () => {
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
    <div className="w-full h-full flex items-center justify-center relative bg-[#010a05] overflow-hidden p-6 sm:p-12">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent pointer-events-none" />
      
      {/* Solar Spores / Pollen */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-emerald-400/30 blur-[2px] animate-spore-float"
            style={{
              width: (Math.random() * 6 + 2) + 'px',
              height: (Math.random() * 6 + 2) + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 10 + 5) + 's',
              animationDelay: (Math.random() * 10) + 's',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full blur-[1px] animate-leaf-fall ${i % 2 === 0 ? 'bg-emerald-500/40' : 'bg-green-600/30'}`}
            style={{
              width: (Math.random() * 10 + 6) + 'px',
              height: (Math.random() * 15 + 8) + 'px',
              left: Math.random() * 100 + '%',
              top: '-10%',
              animationDuration: Math.random() * 10 + 5 + 's',
              animationDelay: Math.random() * 20 + 's',
              opacity: Math.random() * 0.6 + 0.3
            }}
          />
        ))}
      </div>

      <div 
        className="relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-transform duration-300 ease-out preserve-3d z-20 group"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#051a0e] border-2 border-emerald-500/40 rounded-[45px] sm:rounded-[65px] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col backdrop-blur-3xl">
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,247,0.6)] italic">{active.name}</h2>
              <div className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.8em] opacity-80">ID: {String(active.id).padStart(3, '0')}</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.8)]">
               <i className="fa-solid fa-leaf text-2xl text-white"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-gradient-to-br from-emerald-900/40 via-black to-black rounded-[40px] sm:rounded-[55px] border border-emerald-500/20 relative overflow-hidden flex items-center justify-center">
             <div className="w-full h-full p-8 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[110%] max-h-full object-contain drop-shadow-[0_0_50px_rgba(16,185,129,0.7)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in"
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
                   <div className={`w-12 h-12 rounded-full border ${stageIndex === idx ? 'border-emerald-400 bg-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-white/10 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-emerald-400' : 'text-white/20'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-6 space-y-4">
             <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-[20px]">
                <p className="text-emerald-100/40 text-[9px] sm:text-[10px] font-bold italic text-center">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <div className="text-center">
                   <div className="text-xl text-white font-orbitron">{active.growth}</div>
                   <span className="text-[8px] opacity-60">GROWTH</span>
                </div>
                <div className="w-px h-6 bg-emerald-500/20"></div>
                <div className="text-center">
                   <div className="text-xl text-white font-orbitron">{active.poison}</div>
                   <span className="text-[8px] opacity-60">POISON</span>
                </div>
             </div>
          </div>

          <div className="h-14 sm:h-16 bg-emerald-600 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.2em] text-xs">
             Solar Beam
          </div>
        </div>
      </div>

      <style>{`
        @keyframes leaf-fall { 
          0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; } 
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; } 
        }
        .animate-leaf-fall { animation: leaf-fall linear infinite; }
        @keyframes spore-float {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          50% { transform: translate(40px, -40px); opacity: 0.4; }
        }
        .animate-spore-float { animation: spore-float linear infinite; }
      `}</style>
    </div>
  );
};

export default BulbasaurView;
