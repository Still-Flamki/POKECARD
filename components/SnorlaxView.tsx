
import React, { useState, useEffect } from 'react';

const SnorlaxView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 60,
        y: (window.innerHeight / 2 - e.clientY) / 60
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#010503] flex items-center justify-center p-12 overflow-hidden">
      <div 
        className="relative z-10 flex flex-col items-center justify-center transition-transform duration-500 ease-out"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 blur-[150px] bg-emerald-500/5 rounded-full animate-pulse" />
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png"
          className="w-[85vh] max-w-full h-auto drop-shadow-[0_0_120px_rgba(16,185,129,0.3)] animate-in zoom-in fade-in duration-1000"
          alt="Snorlax"
        />
        <div className="mt-8 text-center">
          <h1 className="text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none">SNORLAX</h1>
          <p className="text-xl font-black uppercase tracking-[1em] text-white/30 mt-4">Dormant Titan Archive</p>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-12 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-[12px] tracking-widest uppercase text-white/60"
      >
        Close Entry
      </button>
    </div>
  );
};

export default SnorlaxView;
