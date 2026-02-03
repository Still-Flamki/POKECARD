
import React, { useState, useEffect } from 'react';

const STAGES = [
  { 
    id: 151, name: "MEW", psi: 80, intel: 90, label: "PRECURSOR",
    lore: "Mew is said to possess the genetic composition of all Pokémon. It is capable of making itself invisible."
  },
  { 
    id: 150, name: "MEWTWO", psi: 99, intel: 100, label: "SUBJECT",
    lore: "A Pokémon created by genetic manipulation. Its psychic power is said to be the strongest among all Pokémon."
  }
];

const MewtwoView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDoubled, setIsDoubled] = useState(false);

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

    const interval = setInterval(() => {
      setIsDoubled(true);
      setTimeout(() => setIsDoubled(false), 1000);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#0a0015] overflow-hidden p-6 sm:p-12 cursor-none">
      {/* Background Psychic Distortion orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
         {Array.from({ length: 6 }).map((_, i) => (
           <div 
             key={i}
             className="absolute w-40 h-40 bg-purple-500/5 rounded-full blur-[100px] animate-psychic-wander"
             style={{
               left: (Math.random() * 100) + '%',
               top: (Math.random() * 100) + '%',
               animationDuration: (Math.random() * 10 + 10) + 's',
               animationDelay: (i * -2) + 's'
             }}
           />
         ))}
      </div>

      {isDoubled && (
        <>
          <div 
            className="fixed pointer-events-none z-[100] w-8 h-8 rounded-full border border-purple-400 bg-purple-500/20 blur-[2px] transition-all duration-300"
            style={{ left: mousePos.x + 30, top: mousePos.y - 20 }}
          />
          <div 
            className="fixed pointer-events-none z-[100] w-6 h-6 rounded-full border border-purple-300 bg-purple-400/10 blur-[4px] transition-all duration-500"
            style={{ left: mousePos.x - 40, top: mousePos.y + 30 }}
          />
        </>
      )}
      
      <div 
        className="fixed pointer-events-none z-[100] w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_15px_#a855f7]"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
      />

      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_80%)] animate-pulse" />
      
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-[2px] h-[150px] bg-gradient-to-b from-purple-500 to-transparent blur-[1px] animate-float-dna"
            style={{ left: (i * 10) + '%', top: (Math.random() * 50) + '%', animationDelay: (i * 0.5) + 's', opacity: 0.2 }}
          />
        ))}
      </div>

      <div 
        className="relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-transform duration-300 ease-out preserve-3d z-20 group"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#120025] border-2 border-purple-500/40 rounded-[45px] sm:rounded-[65px] shadow-[0_0_100px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col backdrop-blur-3xl">
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] italic">{active.name}</h2>
              <div className="text-purple-400 text-[9px] font-black uppercase tracking-[0.8em] opacity-80">GENETIC ID: {active.id}</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,1)]">
               <i className="fa-solid fa-brain text-2xl text-white"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-gradient-to-br from-purple-900/40 via-black to-black rounded-[40px] sm:rounded-[55px] border border-purple-500/20 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="w-full h-full p-8 flex items-center justify-center">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[110%] max-h-full object-contain drop-shadow-[0_0_60px_rgba(168,85,247,0.8)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in"
                />
             </div>
          </div>

          <div className="px-8 mt-4 flex items-center justify-center gap-8">
             {STAGES.map((stage, idx) => (
               <button 
                  key={stage.id} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center focus:outline-none"
               >
                  <div className={`w-14 h-14 rounded-full border ${stageIndex === idx ? 'border-purple-400 bg-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/10 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                     <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                  </div>
                  <span className={`text-[7px] mt-1 font-black tracking-widest ${stageIndex === idx ? 'text-purple-400' : 'text-white/20'}`}>{stage.label}</span>
               </button>
             ))}
          </div>

          <div className="p-8 space-y-6">
             <div className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-[25px]">
                <p className="text-purple-100/40 text-[10px] sm:text-[11px] font-bold italic text-center">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-purple-400">
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.psi}</div>
                   <span>PSI</span>
                </div>
                <div className="w-px h-8 bg-purple-500/20"></div>
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.intel}</div>
                   <span>INTEL</span>
                </div>
             </div>
          </div>

          <div className="h-16 sm:h-20 bg-purple-600 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.2em]">
             Psystrike
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-dna { 0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.1; } 50% { transform: translateY(-30px) scaleX(1.5); opacity: 0.3; } }
        .animate-float-dna { animation: float-dna 4s ease-in-out infinite; }
        @keyframes psychic-wander {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.05; }
          33% { transform: translate(30vw, -20vh) scale(1.5); opacity: 0.1; }
          66% { transform: translate(-20vw, 30vh) scale(0.8); opacity: 0.08; }
        }
        .animate-psychic-wander { animation: psychic-wander linear infinite; }
      `}</style>
    </div>
  );
};

export default MewtwoView;
