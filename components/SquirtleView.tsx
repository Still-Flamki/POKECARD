
import React, { useState, useEffect, useRef } from 'react';

const EVOLUTIONS = [
  { id: 7, name: "SQUIRTLE", class: "Base" },
  { id: 8, name: "WARTORTLE", class: "Elite" },
  { id: 9, name: "BLASTOISE", class: "Titan" }
];

const SquirtleView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [evoIndex, setEvoIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = EVOLUTIONS[evoIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const bubbles: any[] = [];
    for(let i = 0; i < 80; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        r: Math.random() * 12 + 2,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(b.y / 40) * 0.8;
        if (b.y < -30) b.y = canvas.height + 30;
        ctx.globalAlpha = b.opacity;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [evoIndex]);

  return (
    <div className="fixed inset-0 bg-[#000612] flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

      <div className="relative z-20 flex flex-col items-center animate-in zoom-in fade-in duration-1000">
        <div className="absolute inset-0 blur-[250px] bg-cyan-600/10 rounded-full animate-pulse" />
        <img 
          key={active.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`}
          className="w-[80vh] max-w-full h-auto drop-shadow-[0_0_150px_rgba(6,182,212,0.4)] z-30 transition-all duration-1000"
          alt={active.name}
        />
        <div className="mt-12 text-center relative z-40">
          <h1 className="text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            {active.name}
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4">
             <div className="text-cyan-400 text-[12px] font-black uppercase tracking-[1.5em]">HYDRO_FLOW: OPTIMAL</div>
             <div className="w-32 h-[1px] bg-cyan-500/20"></div>
             <p className="text-white/20 text-[10px] font-black tracking-[1em] uppercase">{active.class} Hydro Core</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-32 flex gap-10 z-50">
        {EVOLUTIONS.map((evo, i) => (
          <button 
            key={evo.id}
            onClick={() => setEvoIndex(i)}
            className={`w-28 h-28 rounded-[40px] border-2 transition-all duration-700 flex flex-col items-center justify-center p-2 group ${evoIndex === i ? 'border-cyan-500 bg-cyan-500/20 scale-110 shadow-[0_0_80px_rgba(6,182,212,0.5)]' : 'border-white/5 bg-zinc-900/40 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-white/20'}`}
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

export default SquirtleView;
