
import React, { useState, useEffect } from 'react';

const STAGES = [
  { 
    id: 446, name: "MUNCHLAX", satiety: "HIGH", state: "RESTLESS", 
    lore: "It hides food under its long body hair. However, it forgets it has hidden the food.",
    status: "BABY"
  },
  { 
    id: 143, name: "SNORLAX", satiety: "MAX", state: "DREAMING", 
    lore: "Its stomach can digest any kind of food, even if it happens to be moldy or rotten.",
    status: "PEAK"
  }
];

const SnorlaxView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(1);
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
    <div className="w-full h-full flex items-center justify-center relative bg-[#010805] overflow-hidden p-6 sm:p-12">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 to-transparent pointer-events-none" />
      
      {/* Sleepy Dream Motes / Mist */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_80%)] animate-pulse" />
         {Array.from({ length: 10 }).map((_, i) => (
           <div 
             key={i} 
             className="absolute w-[40vw] h-[40vh] bg-emerald-900/10 rounded-full blur-[80px] animate-mist-drift"
             style={{
               left: (Math.random() * 100 - 20) + '%',
               top: (Math.random() * 100 - 20) + '%',
               animationDuration: (Math.random() * 20 + 15) + 's',
               animationDelay: (i * -4) + 's'
             }}
           />
         ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute font-orbitron font-black text-emerald-400/30 animate-sleep-z select-none"
            style={{
              left: (40 + Math.random() * 20) + '%',
              bottom: '20%',
              fontSize: (Math.random() * 25 + 10) + 'px',
              animationDuration: (Math.random() * 5 + 3) + 's',
              animationDelay: (Math.random() * 8) + 's'
            }}
          >
            Z
          </div>
        ))}
      </div>

      <div 
        className="relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-transform duration-300 ease-out preserve-3d z-20 group"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#051510] border-2 border-emerald-500/30 rounded-[45px] sm:rounded-[65px] shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col backdrop-blur-3xl">
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(52,211,153,0.5)] italic uppercase">{active.name}</h2>
              <div className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.8em]">GENETIC STATE: {active.state}</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.8)] border-2 border-emerald-400/30">
               <i className="fa-solid fa-bed text-2xl text-white"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-gradient-to-br from-emerald-900/40 via-black to-black rounded-[40px] sm:rounded-[55px] border border-emerald-500/20 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.05)_0%,transparent_70%)]" />
             <div className="w-full h-full p-8 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[120%] max-h-full object-contain drop-shadow-[0_0_60px_rgba(52,211,153,0.6)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in zoom-in"
                />
             </div>
          </div>

          <div className="px-8 mt-4 flex items-center justify-center gap-8">
             {STAGES.map((stage, idx) => (
                <button 
                  key={stage.id} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center group/evo focus:outline-none"
                >
                   <div className={`w-14 h-14 rounded-full border-2 ${stageIndex === idx ? 'border-emerald-400 bg-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-white/10 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-emerald-400' : 'text-white/20'}`}>{stage.status}</span>
                </button>
             ))}
          </div>

          <div className="p-8 space-y-6 flex-shrink-0">
             <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-[25px]">
                <p className="text-emerald-200/40 text-[10px] sm:text-[11px] font-bold italic text-center">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.satiety}</div>
                   <span>SATIETY</span>
                </div>
                <div className="w-px h-8 bg-emerald-500/20"></div>
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">100%</div>
                   <span>RECOVERY</span>
                </div>
             </div>
          </div>

          <div className="h-16 sm:h-20 bg-emerald-600 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.4em] text-xs">
             GIGA IMPACT
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sleep-z {
          0% { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-300px) translateX(40px) scale(2); opacity: 0; }
        }
        .animate-sleep-z { animation: sleep-z linear infinite; }
        @keyframes mist-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15vw, 10vh); }
        }
        .animate-mist-drift { animation: mist-drift linear infinite; }
      `}</style>
    </div>
  );
};

export default SnorlaxView;
