
import React, { useState, useEffect, useRef } from 'react';

const EVOLUTIONS = [
  { id: 1, name: "BULBASAUR", class: "Seed Specimen" },
  { id: 2, name: "IVYSAUR", class: "Bud Specimen" },
  { id: 3, name: "VENUSAUR", class: "Bloom Specimen" }
];

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  angle: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

const BulbasaurView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [evoIndex, setEvoIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = EVOLUTIONS[evoIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const particles: LeafParticle[] = [];
    const leafColors = ['#10b981', '#059669', '#34d399', '#065f46'];
    const count = window.innerWidth < 768 ? 40 : 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 6 + 4,
        speed: Math.random() * 1.5 + 0.5,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        opacity: Math.random() * 0.6 + 0.2
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Physics update
        p.y += p.speed;
        p.sway += p.swaySpeed;
        p.angle += p.rotationSpeed;
        
        // Fluttering movement
        const renderX = p.x + Math.sin(p.sway) * 20;
        
        // Drawing leaf
        ctx.save();
        ctx.translate(renderX, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        
        // Leaf shape (elliptical)
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Leaf vein
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.lineTo(p.size, 0);
        ctx.stroke();
        
        ctx.restore();

        // Screen wrap
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#010502] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Ambience */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in fade-in duration-1000 p-6">
        <div className="absolute inset-0 blur-[150px] sm:blur-[250px] bg-emerald-600/15 rounded-full animate-pulse" />
        
        <img 
          key={active.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`}
          className="max-h-[45vh] sm:max-h-[60vh] md:max-h-[75vh] w-auto max-w-[85vw] drop-shadow-[0_0_120px_rgba(16,185,129,0.4)] z-30 transition-all duration-1000 hover:scale-105"
          alt={active.name}
        />
        
        <div className="mt-10 text-center relative z-40">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            {active.name}
          </h1>
          <div className="mt-6 flex flex-col items-center gap-4">
             <div className="px-8 py-2 border border-emerald-500/30 bg-emerald-500/10 rounded-full backdrop-blur-md">
                <span className="text-emerald-400 text-[10px] sm:text-[12px] font-black uppercase tracking-[0.8em] sm:tracking-[1.2em]">BIO_SYNC: STABLE</span>
             </div>
             <p className="text-white/20 text-[8px] sm:text-[10px] font-black tracking-[1em] uppercase italic">{active.class}</p>
          </div>
        </div>
      </div>

      {/* Evolution Selector */}
      <div className="fixed bottom-24 sm:bottom-32 flex gap-4 sm:gap-10 z-50 p-4 sm:p-6 bg-emerald-950/20 backdrop-blur-3xl rounded-[35px] sm:rounded-[50px] border border-white/5 animate-in slide-in-from-bottom-10">
        {EVOLUTIONS.map((evo, i) => (
          <button 
            key={evo.id}
            onClick={() => setEvoIndex(i)}
            className={`w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[35px] border-2 transition-all duration-700 flex flex-col items-center justify-center p-1 sm:p-2 group ${evoIndex === i ? 'border-emerald-500 bg-emerald-500/30 scale-110 shadow-[0_0_50px_rgba(16,185,129,0.4)]' : 'border-white/5 bg-zinc-900/40 grayscale opacity-30 hover:opacity-100 hover:grayscale-0'}`}
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-10 h-10 sm:w-16 sm:h-16 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-[6px] sm:text-[8px] font-black uppercase text-white/40 mt-1">{evo.name}</div>
          </button>
        ))}
      </div>

      <button onClick={onBack} className="fixed bottom-8 sm:bottom-12 px-8 sm:px-12 py-3 sm:py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-[10px] sm:text-[12px] tracking-[1.5em] uppercase text-white/60 z-50">
        EXIT ARCHIVE
      </button>
    </div>
  );
};

export default BulbasaurView;
