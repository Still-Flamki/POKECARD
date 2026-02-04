
import React, { useState, useEffect } from 'react';

const EVOLUTIONS = [
  { id: 151, name: "MEW", class: "Origin", psi: "80%", color: "#f472b6" },
  { id: 150, name: "MEWTWO", class: "Genetic", psi: "100%", color: "#a855f7" }
];

const MewtwoView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [evoIndex, setEvoIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const active = EVOLUTIONS[evoIndex];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 80,
        y: (window.innerHeight / 2 - e.clientY) / 80
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#06000c] flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000">
      
      {/* Psychic Aura Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full blur-[120px] animate-pulse opacity-20"
            style={{ 
              backgroundColor: active.color,
              width: `${Math.random() * 500 + 200}px`,
              height: `${Math.random() * 500 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }} 
          />
        ))}
      </div>

      <div 
        className="relative z-20 flex flex-col items-center transition-transform duration-500 ease-out"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 blur-[250px] bg-purple-500/10 rounded-full animate-pulse" />
        <img 
          key={active.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`}
          className="w-[80vh] max-w-full h-auto drop-shadow-[0_0_150px_rgba(168,85,247,0.4)] z-30 animate-in fade-in zoom-in duration-1000"
          alt={active.name}
        />
        <div className="mt-12 text-center relative z-40">
          <h1 className="text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            {active.name}
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4">
             <div className="text-purple-400 text-[12px] font-black uppercase tracking-[1.5em]">PSI_SIGNATURE: {active.psi}</div>
             <div className="w-32 h-[1px] bg-purple-500/20"></div>
             <p className="text-white/20 text-[10px] font-black tracking-[1em] uppercase">{active.class} Subject Zero</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-32 flex gap-10 z-50">
        {EVOLUTIONS.map((evo, i) => (
          <button 
            key={evo.id}
            onClick={() => setEvoIndex(i)}
            className={`w-28 h-28 rounded-[40px] border-2 transition-all duration-700 flex flex-col items-center justify-center p-2 group ${evoIndex === i ? 'border-purple-500 bg-purple-500/20 scale-110 shadow-[0_0_60px_rgba(168,85,247,0.5)]' : 'border-white/5 bg-zinc-900/40 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-white/20'}`}
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-20 h-20 object-contain group-hover:scale-125 transition-transform duration-700" />
            <div className="text-[8px] font-black uppercase text-white/40 pb-2">{evo.name}</div>
          </button>
        ))}
      </div>

      <button onClick={onBack} className="fixed bottom-12 px-12 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-[12px] tracking-[1.5em] uppercase text-white/60 z-50">
        Exit Archive
      </button>
    </div>
  );
};

export default MewtwoView;
