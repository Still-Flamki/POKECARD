
import React, { useState, useEffect, useRef } from 'react';

const EVOLUTIONS = [
  { id: 643, name: "RESHIRAM", label: "Truth Variant", color: "#fefefe", bg: "#0a0a0a" },
  { id: 644, name: "ZEKROM", label: "Ideals Core", color: "#3b82f6", bg: "#020202" },
  { id: 646, name: "KYUREM-B", label: "Black Overdrive", color: "#1e40af", bg: "#000105" }
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  rotation: number;
  rotSpeed: number;
  depth: number;
  type: 'mote' | 'shard' | 'asteroid' | 'debris';
  shimmerPhase: number;
  shimmerSpeed: number;
  sides?: number;
  history: {x: number, y: number}[];
}

const ZekromView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [evoIndex, setEvoIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
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

    const particles: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    
    // System 1: Background Shimmering Motes (Upward drift)
    const moteCount = isMobile ? 120 : 300;
    for (let i = 0; i < moteCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.8 + 0.2),
        size: Math.random() * 1.5 + 0.2,
        baseOpacity: Math.random() * 0.3 + 0.1,
        opacity: 0,
        rotation: 0,
        rotSpeed: 0,
        depth: Math.random() * 0.03 + 0.01,
        type: 'mote',
        shimmerPhase: Math.random() * Math.PI * 2,
        shimmerSpeed: Math.random() * 0.04 + 0.01,
        history: []
      });
    }

    // System 2: Midground Shards (Tumbling debris)
    const shardCount = isMobile ? 20 : 50;
    for (let i = 0; i < shardCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 5 + 2,
        baseOpacity: Math.random() * 0.4 + 0.2,
        opacity: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        depth: Math.random() * 0.1 + 0.04,
        type: 'shard',
        shimmerPhase: 0,
        shimmerSpeed: 0,
        sides: Math.floor(Math.random() * 3) + 3,
        history: []
      });
    }

    // System 3: Foreground Heavy Asteroids (Larger chunks)
    const asteroidCount = isMobile ? 8 : 15;
    for (let i = 0; i < asteroidCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 20 + 10,
        baseOpacity: 0.1,
        opacity: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        depth: Math.random() * 0.2 + 0.1,
        type: 'asteroid',
        shimmerPhase: 0,
        shimmerSpeed: 0,
        history: []
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mousePos.current;
      
      particles.forEach(p => {
        // Physics logic: Antigravity drift + Mouse influence
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        // Subtly react to mouse: Repulsion or "disturbed gravity" field
        const forceLimit = 250;
        if (dist < forceLimit) {
          const force = (1 - dist / forceLimit) * 0.05;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Apply friction to keep it floating gently
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Apply Velocity
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap Around logic with buffer
        const buffer = 100;
        if (p.x < -buffer) p.x = canvas.width + buffer;
        if (p.x > canvas.width + buffer) p.x = -buffer;
        if (p.y < -buffer) p.y = canvas.height + buffer;
        if (p.y > canvas.height + buffer) p.y = -buffer;

        // Parallax depth calculation
        const px = (mouse.x - canvas.width / 2) * p.depth;
        const py = (mouse.y - canvas.height / 2) * p.depth;
        const rx = p.x + px;
        const ry = p.y + py;

        if (p.type === 'mote') {
          p.shimmerPhase += p.shimmerSpeed;
          p.opacity = p.baseOpacity * (0.2 + 0.8 * (Math.sin(p.shimmerPhase) * 0.5 + 0.5));
          
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = active.color;
          ctx.beginPath();
          ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          p.rotation += p.rotSpeed;
          
          // Shard/Asteroid trails (Ghosting)
          if (p.history.length > 5) p.history.shift();
          p.history.push({x: rx, y: ry});
          
          p.history.forEach((h, idx) => {
             const alpha = (idx / p.history.length) * 0.1 * p.baseOpacity;
             ctx.globalAlpha = alpha;
             ctx.fillStyle = active.color;
             ctx.beginPath();
             ctx.arc(h.x, h.y, p.size * 0.8, 0, Math.PI * 2);
             ctx.fill();
          });

          ctx.globalAlpha = p.baseOpacity;
          ctx.fillStyle = active.color;
          ctx.save();
          ctx.translate(rx, ry);
          ctx.rotate(p.rotation);
          
          if (p.type === 'shard') {
            ctx.beginPath();
            const sides = p.sides || 3;
            for (let i = 0; i < sides; i++) {
              const ang = (i * 2 * Math.PI) / sides;
              const r = p.size * (0.8 + Math.random() * 0.4); // slightly irregular
              const x = r * Math.cos(ang);
              const y = r * Math.sin(ang);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Add an inner core glow
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(0, 0, 0.5, 0, Math.PI * 2);
            ctx.fill();

          } else if (p.type === 'asteroid') {
            ctx.shadowBlur = 20;
            ctx.shadowColor = active.color;
            ctx.beginPath();
            // Blocky irregular asteroid shape
            const s = p.size;
            ctx.moveTo(-s/2, -s/4);
            ctx.lineTo(-s/3, -s/2);
            ctx.lineTo(s/4, -s/2.2);
            ctx.lineTo(s/2, -s/4);
            ctx.lineTo(s/2.2, s/4);
            ctx.lineTo(s/4, s/2);
            ctx.lineTo(-s/3, s/1.8);
            ctx.lineTo(-s/2, s/4);
            ctx.closePath();
            ctx.fill();
            
            // Wireframe detail
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 100,
        y: (window.innerHeight / 2 - e.clientY) / 100
      });
    };
    window.addEventListener('mousemove', handleMove);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', resize);
    };
  }, [evoIndex, active.color]);

  return (
    <div className="fixed inset-0 transition-colors duration-1000 flex items-center justify-center p-6 overflow-hidden" style={{ backgroundColor: active.bg }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none mix-blend-screen z-0" />
      
      {/* Dynamic Data Overlay */}
      <div className="absolute top-10 left-10 z-10 space-y-2 pointer-events-none hidden sm:block">
        <div className="text-[9px] font-orbitron font-black text-white/30 tracking-[0.4em]">NEURAL_SYNC_LINK: <span className="text-emerald-500">ESTABLISHED</span></div>
        <div className="text-[9px] font-orbitron font-black text-white/10 tracking-[0.4em]">GRAV_WELL_COORD: {Math.floor(mousePos.current.x)},{Math.floor(mousePos.current.y)}</div>
      </div>

      <div className="absolute top-10 right-10 z-10 text-[10px] font-orbitron font-black text-white/20 tracking-[0.8em] pointer-events-none">
        GRAVITY_NULL_FIELD: <span className="text-blue-500 animate-pulse">STABILIZED</span>
      </div>

      <div 
        className="relative z-20 flex flex-col items-center justify-center zekrom-node"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 blur-[250px] rounded-full animate-pulse transition-colors duration-1000" style={{ backgroundColor: `${active.color}20` }} />
        <img 
          key={active.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`}
          className="max-h-[55vh] sm:max-h-[75vh] w-auto max-w-[90vw] drop-shadow-[0_0_120px_rgba(59,130,246,0.2)] animate-in zoom-in fade-in duration-1000 z-30 transition-all duration-700 hover:scale-105 active:scale-95"
          alt={active.name}
        />
        <div className="mt-10 text-center relative z-40">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            {active.name}
          </h1>
          <div className="flex flex-col items-center gap-2 mt-6">
            <p className="text-xs sm:text-lg font-black uppercase tracking-[1.5em] text-white/30 italic">{active.label}</p>
            <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Genetic Selector */}
      <div className="fixed bottom-24 sm:bottom-32 flex gap-4 sm:gap-10 z-50 p-4 sm:p-6 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 animate-in slide-in-from-bottom-10 shadow-2xl">
        {EVOLUTIONS.map((evo, i) => (
          <button 
            key={evo.id}
            onClick={() => setEvoIndex(i)}
            className={`w-16 h-16 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[40px] border-2 transition-all duration-700 flex flex-col items-center justify-center p-2 group ${evoIndex === i ? 'border-white bg-white/10 scale-110 shadow-[0_0_50px_rgba(255,255,255,0.2)]' : 'border-white/5 bg-zinc-900/40 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 hover:border-white/20'}`}
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`} className="w-10 h-10 sm:w-20 sm:h-20 object-contain group-hover:scale-110 transition-transform duration-500" />
            <div className="text-[6px] sm:text-[9px] font-black uppercase text-white/40 mt-1">{evo.name}</div>
          </button>
        ))}
      </div>

      <button onClick={onBack} className="fixed bottom-8 sm:bottom-12 px-10 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-[10px] sm:text-[12px] tracking-[2em] uppercase text-white/60 z-50 backdrop-blur-md">
        EXIT DATA
      </button>
    </div>
  );
};

export default ZekromView;
