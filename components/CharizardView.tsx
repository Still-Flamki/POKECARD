
import React, { useState, useEffect, useRef } from 'react';

const EVOLUTIONS = [
  { id: 4, name: "CHARMANDER", temp: "1200°C", color: "#f97316", intensity: 1, label: "EMBER_SPECIMEN" },
  { id: 5, name: "CHARMELEON", temp: "2400°C", color: "#ea580c", intensity: 2.2, label: "HEAT_OPERATIVE" },
  { id: 6, name: "CHARIZARD", temp: "4800°C", color: "#dc2626", intensity: 4.5, label: "THERMAL_TITAN" }
];

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  life: number;
}

const CharizardView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [evoIndex, setEvoIndex] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = EVOLUTIONS[evoIndex];
  const mousePos = useRef({ x: 0, y: 0 });

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

    let embers: Ember[] = [];
    const count = 200 * active.intensity;

    const createEmber = (isInitial = false): Ember => ({
      x: Math.random() * canvas.width,
      y: isInitial ? Math.random() * canvas.height : canvas.height + 20,
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 3 + 1) * (active.intensity / 2),
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.05 + 0.02,
      opacity: Math.random() * 0.8 + 0.2,
      color: active.color,
      life: 1
    });

    for (let i = 0; i < count; i++) {
      embers.push(createEmber(true));
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      embers.forEach((p, i) => {
        // Physics update
        p.y += p.vy;
        p.x += p.vx + Math.sin(Date.now() / 500 + i) * 0.5;
        p.life -= 0.005;

        // Mouse displacement
        const dx = mousePos.current.x - p.x;
        const dy = mousePos.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx -= (dx / dist) * 0.5;
          p.vy -= (dy / dist) * 0.5;
        }

        // Draw ember
        ctx.globalAlpha = p.opacity * p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10 * active.intensity;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Respawn
        if (p.life <= 0 || p.y < -50) {
          embers[i] = createEmber();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [evoIndex, active.intensity, active.color]);

  return (
    <div className="fixed inset-0 bg-[#080201] flex flex-col items-center justify-center overflow-hidden">
      {/* Intense Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 opacity-20 blur-[100px]"
        style={{ background: `radial-gradient(circle at center, ${active.color}, transparent 80%)` }}
      />
      
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none z-10" />
      
      {/* HUD Heat Shimmer Overlay */}
      <div className="absolute inset-0 heat-distortion pointer-events-none opacity-40 bg-orange-600/5 z-20" />

      {/* Tech Data Readout */}
      <div className="absolute top-12 left-12 z-50 text-orange-500/40 text-[10px] font-black uppercase tracking-[0.5em] space-y-2 pointer-events-none">
        <div>CORE_TEMPERATURE_CRITICAL: {active.temp}</div>
        <div>STABILITY: FLUX_VAR_ALBEDO</div>
        <div className="w-48 h-1 bg-orange-500/10 rounded-full overflow-hidden">
           <div className="h-full bg-orange-500/50 animate-thermal-bar" style={{ width: `${active.intensity * 20}%` }}></div>
        </div>
      </div>

      <div className="relative z-30 flex flex-col items-center animate-in zoom-in fade-in duration-1000 p-6">
        <div className="absolute inset-0 blur-[200px] sm:blur-[400px] rounded-full animate-pulse transition-colors duration-1000" style={{ backgroundColor: `${active.color}30` }} />
        
        <img 
          key={active.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`}
          className="max-h-[50vh] sm:max-h-[70vh] w-auto max-w-[95vw] drop-shadow-[0_0_150px_rgba(249,115,22,0.8)] z-40 transition-all duration-700 hover:scale-110 active:scale-95 contrast-125 brightness-110"
          alt={active.name}
        />

        <div className="mt-10 sm:mt-16 text-center relative z-50">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_80px_rgba(255,255,255,0.4)] glitch-text">
            {active.name}
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4">
             <div className="px-14 py-3 border border-orange-500/40 bg-orange-600/20 rounded-full backdrop-blur-xl group hover:scale-105 transition-transform cursor-default shadow-2xl">
               <span className="text-orange-400 text-[12px] sm:text-[16px] font-black tracking-[1.2em]">MAX_THERMAL: {active.temp}</span>
             </div>
             <p className="text-white/30 text-[10px] sm:text-[12px] font-black tracking-[1.5em] uppercase italic drop-shadow-md">{active.label}</p>
          </div>
        </div>
      </div>

      {/* High-Tech Evolution Selector */}
      <div className="fixed bottom-24 sm:bottom-32 flex gap-4 sm:gap-16 z-50 p-6 sm:p-8 bg-zinc-950/80 backdrop-blur-3xl rounded-[60px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        {EVOLUTIONS.map((evo, i) => (
          <button 
            key={evo.id}
            onClick={() => setEvoIndex(i)}
            className={`w-20 h-20 sm:w-32 sm:h-32 rounded-3xl sm:rounded-[50px] border-2 transition-all duration-1000 flex flex-col items-center justify-center overflow-hidden group relative ${evoIndex === i ? 'border-orange-500 bg-orange-600/30 scale-115 shadow-[0_0_60px_rgba(249,115,22,0.6)]' : 'border-white/5 bg-zinc-900/40 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 hover:border-orange-500/30'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-12 h-12 sm:w-24 sm:h-24 object-contain group-hover:scale-125 transition-transform duration-700 z-10" />
            <div className="text-[7px] sm:text-[10px] font-black uppercase text-white/50 mb-1 z-10">{evo.name}</div>
          </button>
        ))}
      </div>

      <button onClick={onBack} className="fixed bottom-8 sm:bottom-12 px-12 py-5 rounded-full border border-white/10 bg-white/5 hover:bg-orange-600 hover:text-black hover:border-orange-500 transition-all duration-500 font-black text-[12px] tracking-[2.5em] uppercase text-white/40 z-50 backdrop-blur-md">
        EXIT_ARCHIVE
      </button>

      <style>{`
        @keyframes thermal-bar {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-thermal-bar { animation: thermal-bar 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CharizardView;
