
import React, { useState, useEffect } from 'react';

const STAGES = [
  { 
    id: 360, name: "WYNAUT", ctr: 40, hp: 95, 
    lore: "It tends to move in a pack with others. They cluster together to squeeze each other and toughen their spirits."
  },
  { 
    id: 202, name: "WOBBUFFET", ctr: 100, hp: 190, 
    lore: "It hates light and shock. If attacked, it inflates its body to pump up its counterstrike."
  }
];

const WobbuffetView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [bounced, setBounced] = useState(false);

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

  const handleClick = () => {
    setBounced(true);
    setTimeout(() => setBounced(false), 500);
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#000510] overflow-hidden p-6 sm:p-12" onClick={handleClick}>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(147,197,253,0.3)_0%,transparent_70%)] animate-pulse" />
      
      {/* Kinetic Feedback Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         {Array.from({ length: 4 }).map((_, i) => (
           <div 
             key={i} 
             className={`absolute rounded-full border-2 border-blue-400/20 animate-kinetic-ripple ${bounced ? 'animate-none' : ''}`} 
             style={{ 
               width: `${200 + i * 300}px`, 
               height: `${200 + i * 300}px`,
               animationDelay: `${i * 0.5}s`
             }} 
           />
         ))}
      </div>

      <div 
        className={`relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-all duration-300 ease-out preserve-3d z-20 group ${bounced ? 'scale-110' : ''}`}
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#000c1f] border-2 border-blue-400/40 rounded-[45px] sm:rounded-[65px] shadow-[0_0_80px_rgba(147,197,253,0.15)] overflow-hidden flex flex-col backdrop-blur-3xl">
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(147,197,253,0.6)] italic">{active.name}</h2>
              <div className="text-blue-300 text-[9px] font-black uppercase tracking-[0.8em] opacity-80">ID: {active.id}</div>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(147,197,253,0.8)]">
               <i className="fa-solid fa-shield-halved text-2xl text-white"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-gradient-to-br from-blue-900/40 via-black to-black rounded-[40px] sm:rounded-[55px] border border-blue-400/20 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
             <div className={`w-full h-full p-8 flex items-center justify-center transition-transform duration-500 ${bounced ? 'scale-125' : ''}`}>
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[110%] max-h-full object-contain drop-shadow-[0_0_50px_rgba(147,197,253,0.7)] z-20 animate-in fade-in zoom-in"
                />
             </div>
          </div>

          <div className="px-8 mt-4 flex items-center justify-center gap-6">
             {STAGES.map((stage, idx) => (
               <button 
                  key={stage.id} 
                  onClick={(e) => { e.stopPropagation(); setStageIndex(idx); }}
                  className="flex flex-col items-center focus:outline-none"
               >
                  <div className={`w-14 h-14 rounded-full border ${stageIndex === idx ? 'border-blue-400 bg-blue-400/20 shadow-[0_0_15px_rgba(147,197,253,0.5)]' : 'border-white/10 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                     <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                  </div>
                  <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-blue-300' : 'text-white/20'}`}>{stage.name}</span>
               </button>
             ))}
          </div>

          <div className="p-8 space-y-6">
             <div className="bg-blue-400/5 border border-blue-400/20 p-4 rounded-[25px]">
                <p className="text-blue-100/40 text-[10px] sm:text-[11px] font-bold italic text-center">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-blue-300">
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.ctr}</div>
                   <span>COUNTER</span>
                </div>
                <div className="w-px h-8 bg-blue-400/20"></div>
                <div className="text-center">
                   <div className="text-2xl text-white font-orbitron">{active.hp}</div>
                   <span>HP</span>
                </div>
             </div>
          </div>

          <div className="h-16 sm:h-20 bg-blue-500 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.4em] overflow-hidden">
             Mirror Coat
          </div>
        </div>
      </div>
      <style>{`
        @keyframes kinetic-ripple {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-kinetic-ripple { animation: kinetic-ripple 3s ease-out infinite; }
      `}</style>
    </div>
  );
};

export default WobbuffetView;
