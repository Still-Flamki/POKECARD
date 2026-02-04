
import React, { useState, useEffect, useRef } from 'react';

const EVOLUTIONS = [
  { id: 172, name: "PICHU", voltage: "10v", color: "#fef08a", intensity: 0.3 },
  { id: 25, name: "PIKACHU", voltage: "10,000v", color: "#eab308", intensity: 1 },
  { id: 26, name: "RAICHU", voltage: "100,000v", color: "#ca8a04", intensity: 2.5 }
];

interface Bolt {
  segments: { x: number; y: number }[];
  opacity: number;
  life: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const PikachuView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [evoIndex, setEvoIndex] = useState(1);
  const [flashes, setFlashes] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = EVOLUTIONS[evoIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let bolts: Bolt[] = [];
    let sparks: Spark[] = [];
    
    const createBolt = () => {
      const startX = canvas.width / 2 + (Math.random() - 0.5) * 400;
      const startY = canvas.height / 2 + (Math.random() - 0.5) * 400;
      let segments = [{ x: startX, y: startY }];
      let currX = startX;
      let currY = startY;

      for (let i = 0; i < 8; i++) {
        currX += (Math.random() - 0.5) * 120;
        currY += (Math.random() - 0.5) * 120;
        segments.push({ x: currX, y: currY });
      }

      return { segments, opacity: 1, life: 1 };
    };

    const createSpark = () => {
      // Concentrate sparks around the central image area
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 250;
      
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: Math.random() * 2 + 1
      };
    };

    let lastFlash = 0;
    let animationId: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Flash Logic
      if (time - lastFlash > (2000 / active.intensity) && Math.random() > 0.95) {
        setFlashes(prev => [...prev, Math.random()]);
        setTimeout(() => setFlashes(prev => prev.slice(1)), 80);
        lastFlash = time;
        // Spawn bolts on flash
        for(let i=0; i < Math.floor(active.intensity * 3); i++) {
          bolts.push(createBolt());
        }
      }

      // Main Lightning Bolts
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = active.color;

      bolts = bolts.filter(b => b.life > 0);
      bolts.forEach(b => {
        b.life -= 0.08;
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.life})`;
        ctx.beginPath();
        ctx.moveTo(b.segments[0].x, b.segments[0].y);
        for (let i = 1; i < b.segments.length; i++) {
          ctx.lineTo(b.segments[i].x, b.segments[i].y);
        }
        ctx.stroke();
      });

      // Secondary Static Sparks
      if (Math.random() < 0.3 * active.intensity) {
        sparks.push(createSpark());
      }

      sparks = sparks.filter(s => s.life > 0);
      sparks.forEach(s => {
        s.life -= 0.04;
        s.x += s.vx;
        s.y += s.vy;
        // Add a slight jitter
        s.x += (Math.random() - 0.5) * 2;
        s.y += (Math.random() - 0.5) * 2;

        ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = active.color;
        
        ctx.beginPath();
        ctx.rect(s.x, s.y, s.size, s.size);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [evoIndex, active.intensity, active.color]);

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${flashes.length > 0 ? 'bg-zinc-800' : 'bg-black'}`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none mix-blend-screen z-10" />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_80%)]" />
        <div className="w-full h-full border-[0.5px] border-yellow-500/10 grid grid-cols-12 grid-rows-12 opacity-20">
          {[...Array(144)].map((_, i) => <div key={i} className="border-[0.5px] border-yellow-500/5" />)}
        </div>
      </div>

      <div className="relative z-20 flex flex-col items-center animate-in zoom-in fade-in duration-1000 p-6">
        <div className="absolute inset-0 blur-[150px] sm:blur-[300px] rounded-full animate-pulse transition-colors duration-500" style={{ backgroundColor: `${active.color}15` }} />
        
        <img 
          key={active.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`}
          className={`max-h-[50vh] sm:max-h-[70vh] w-auto max-w-[90vw] drop-shadow-[0_0_100px_rgba(234,179,8,0.4)] z-30 transition-all duration-500 ${flashes.length > 0 ? 'brightness-150 scale-105 contrast-125' : 'brightness-100'}`}
          alt={active.name}
        />

        <div className="mt-8 text-center relative">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            {active.name}
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4">
             <div className="px-10 py-3 border border-yellow-500/30 bg-yellow-500/10 rounded-full backdrop-blur-md">
                <span className="text-yellow-400 text-[12px] font-black uppercase tracking-[1em]">OUTPUT: {active.voltage}</span>
             </div>
             <p className="text-white/20 text-[10px] font-black tracking-[1.2em] uppercase italic">Voltage sovereign registry</p>
          </div>
        </div>
      </div>

      {/* Genetic Selector */}
      <div className="fixed bottom-24 sm:bottom-32 flex gap-4 sm:gap-10 z-50 p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] border border-white/5 animate-in slide-in-from-bottom-10">
        {EVOLUTIONS.map((evo, i) => (
          <button 
            key={evo.id}
            onClick={() => setEvoIndex(i)}
            className={`w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[40px] border-2 transition-all duration-700 flex flex-col items-center justify-center group ${evoIndex === i ? 'border-yellow-500 bg-yellow-500/20 scale-110 shadow-[0_0_50px_rgba(234,179,8,0.4)]' : 'border-white/5 grayscale opacity-30 hover:opacity-100 hover:grayscale-0'}`}
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-10 h-10 sm:w-20 sm:h-20 object-contain group-hover:scale-110 transition-transform" />
            <div className="text-[6px] sm:text-[9px] font-black uppercase text-white/40 mt-1">{evo.name}</div>
          </button>
        ))}
      </div>

      <button onClick={onBack} className="fixed bottom-8 sm:bottom-12 px-10 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-[12px] tracking-[2em] uppercase text-white/60 z-50">
        EXIT
      </button>
    </div>
  );
};

export default PikachuView;
