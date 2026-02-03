
import React, { useState, useEffect, useRef } from 'react';

const STAGES = [
  { 
    id: 'dark-stone', name: "DARK STONE", status: "ORIGIN", pwr: 0, def: 100,
    lore: "A mysterious gem that holds the essence of Zekrom. It waits for a hero with strong ideals to awaken it.",
    icon: "fa-gem",
    voidStatus: "DORMANT",
    spriteId: null
  },
  { 
    id: 644, name: "ZEKROM", status: "SUBJECT", pwr: 98, def: 85,
    lore: "The legendary dragon that represents Ideals. It creates an antigravity field by ionizing the very fabric of space.",
    spriteId: 644,
    voidStatus: "ACTIVE"
  },
  { 
    id: 646, name: "B-KYUREM", status: "ASCENDED", pwr: 100, def: 95,
    lore: "The result of Zekrom and Kyurem fusing. It combines the power of lightning and absolute zero.",
    spriteId: 646,
    voidStatus: "SINGULARITY"
  }
];

class Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  type: 'asteroid' | 'shard' | 'mote' | 'debris';
  color: string;
  opacity: number;
  history: {x: number, y: number}[];
  sides: number;
  offsets: number[];

  constructor(width: number, height: number, type?: 'asteroid' | 'shard' | 'mote' | 'debris') {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.z = Math.random() * 2 + 0.5; // Depth multiplier
    this.type = type || (Math.random() > 0.85 ? 'asteroid' : (Math.random() > 0.6 ? 'shard' : (Math.random() > 0.3 ? 'mote' : 'debris')));
    
    // Antigravity drift (slow upward floating)
    this.vy = -(Math.random() * 0.4 + 0.1) / this.z;
    this.vx = (Math.random() - 0.5) * 0.3;
    
    this.size = this.type === 'asteroid' ? Math.random() * 25 + 10 : 
                 this.type === 'shard' ? Math.random() * 12 + 4 : 
                 this.type === 'mote' ? Math.random() * 3 + 1 :
                 Math.random() * 2 + 0.5;
    
    this.rotation = Math.random() * Math.PI * 2;
    this.vr = (Math.random() - 0.5) * 0.015;
    this.color = this.type === 'mote' ? '#60a5fa' : 
                 this.type === 'shard' ? '#3b82f6' : 
                 this.type === 'asteroid' ? '#18181b' : '#3f3f46';
    this.opacity = Math.random() * 0.4 + 0.2;
    this.history = [];
    this.sides = Math.floor(Math.random() * 3) + 5;
    this.offsets = Array.from({length: this.sides}, () => Math.random() * 0.5 + 0.75);
  }

  update(width: number, height: number, mouseX: number, mouseY: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repulsionRadius = 200;
    const attractionRadius = 500;
    
    // Complex mouse interaction: Repulsion when close, subtle pull when mid-range
    if (dist < repulsionRadius) {
      const force = (repulsionRadius - dist) / repulsionRadius;
      this.vx += (dx / dist) * force * 1.5;
      this.vy += (dy / dist) * force * 1.5;
    } else if (dist < attractionRadius) {
      const force = (attractionRadius - dist) / attractionRadius;
      this.vx -= (dx / dist) * force * 0.05;
      this.vy -= (dy / dist) * force * 0.05;
    }

    // Apply basic velocity & friction
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.vr;
    this.vx *= 0.95;
    this.vy *= 0.95;
    
    // Constant upward drift
    this.vy += -(0.15 / this.z);

    // Trails for shards
    if (this.type === 'shard') {
      this.history.push({x: this.x, y: this.y});
      if (this.history.length > 10) this.history.shift();
    }

    // Screen wrap
    if (this.x < -100) this.x = width + 100;
    if (this.x > width + 100) this.x = -100;
    if (this.y < -100) {
      this.y = height + 100;
      this.x = Math.random() * width;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;
    
    if (this.type === 'asteroid') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      for (let i = 0; i < this.sides; i++) {
        const angle = (i / this.sides) * Math.PI * 2;
        const r = this.size * this.offsets[i];
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Shadowing for depth
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.moveTo(0,0);
      for (let i = 0; i < this.sides/2; i++) {
        const angle = (i / this.sides) * Math.PI * 2;
        ctx.lineTo(Math.cos(angle)*this.size, Math.sin(angle)*this.size);
      }
      ctx.fill();

    } else if (this.type === 'shard') {
      ctx.restore();
      // Draw trails
      if (this.history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.history[0].x, this.history[0].y);
        for(let i=1; i<this.history.length; i++) {
          ctx.lineTo(this.history[i].x, this.history[i].y);
        }
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.2;
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#60a5fa';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size/3, this.size);
      ctx.lineTo(-this.size/3, this.size);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      if (this.type === 'mote') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }
    ctx.restore();
  }
}

const ZekromView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [bolt, setBolt] = useState<{ x: number, visible: boolean }>({ x: 0, visible: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const active = STAGES[stageIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;
    const ctx = canvas.getContext('2d');
    const bgCtx = bgCanvas.getContext('2d');
    if (!ctx || !bgCtx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      
      particlesRef.current = Array.from({ length: 150 }, () => new Particle(canvas.width, canvas.height));
      
      // Pre-draw nebula background
      drawNebula(bgCtx, bgCanvas.width, bgCanvas.height);
    };

    const drawNebula = (c: CanvasRenderingContext2D, w: number, h: number) => {
      c.clearRect(0, 0, w, h);
      for(let i=0; i<3; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 400 + 200;
        const grad = c.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(29, 78, 216, ${0.05 + Math.random() * 0.05})`);
        grad.addColorStop(1, 'transparent');
        c.fillStyle = grad;
        c.fillRect(0, 0, w, h);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connecting lines for electrical effect
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        p1.update(canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y);
        p1.draw(ctx);
        
        // Link logic
        if (p1.type === 'mote' || p1.type === 'shard') {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p2 = particlesRef.current[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const d = Math.sqrt(dx*dx + dy*dy);
            if (d < 100) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      rafRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 50,
        y: (window.innerHeight / 2 - e.clientY) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const boltInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setBolt({ x: Math.random() * 100, visible: true });
        setTimeout(() => setBolt(prev => ({ ...prev, visible: false })), 60);
      }
    }, 4000);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      clearInterval(boltInterval);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#010106] overflow-hidden p-4 sm:p-12">
      <canvas ref={bgCanvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none opacity-80" />
      
      {/* Dynamic Dark Lightning Strikes */}
      {bolt.visible && (
        <div 
          className="absolute z-10 w-[4px] bg-blue-400 shadow-[0_0_40px_#3b82f6] h-full transition-opacity duration-100 mix-blend-screen"
          style={{ 
            left: bolt.x + '%', 
            opacity: 0.8, 
            clipPath: 'polygon(0% 0%, 100% 0%, 40% 20%, 90% 40%, 10% 60%, 80% 80%, 0% 100%)' 
          }}
        />
      )}

      <div 
        className="relative w-full max-w-[440px] h-[85vh] transition-transform duration-300 ease-out preserve-3d z-20 group animate-void-hover"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-black/80 border-2 border-blue-500/20 rounded-[55px] sm:rounded-[75px] shadow-[0_0_150px_rgba(59,130,246,0.1)] overflow-hidden flex flex-col backdrop-blur-3xl transition-all duration-700 hover:border-blue-500/50 hover:shadow-[0_0_200px_rgba(59,130,246,0.2)]">
          <div className="p-10 pb-4 flex justify-between items-start z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                 <span className="text-blue-500/60 text-[10px] font-black uppercase tracking-[0.6em]">Zero-G Sync Established</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-orbitron font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(59,130,246,0.6)] italic uppercase leading-none">{active.name}</h2>
            </div>
            <div className="w-16 h-16 rounded-[28px] bg-gradient-to-tr from-blue-700 to-blue-400 flex items-center justify-center text-black font-orbitron font-black text-3xl shadow-[0_0_50px_rgba(59,130,246,0.8)] animate-float-pulse">
               <i className={`fa-solid ${active.icon || 'fa-atom'}`}></i>
            </div>
          </div>

          <div className="flex-1 mx-8 mt-6 bg-zinc-950/40 rounded-[50px] sm:rounded-[65px] border border-blue-500/10 relative overflow-hidden flex items-center justify-center transition-all duration-700 group-hover:border-blue-500/30">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] animate-pulse" />
             
             {/* Antigravity Glow Rings */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 border border-blue-500/10 rounded-full animate-ripple-slow opacity-20" />
                <div className="w-56 h-56 border border-blue-500/5 rounded-full animate-pulse-slow" />
             </div>

             <div className="w-full h-full p-10 flex items-center justify-center relative">
                {active.spriteId ? (
                  <img 
                    key={active.spriteId}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.spriteId}.png`} 
                    alt={active.name}
                    className="max-w-[125%] max-h-full object-contain drop-shadow-[0_0_80px_rgba(59,130,246,0.9)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in zoom-in fade-in"
                  />
                ) : (
                  <div className="w-44 h-44 bg-blue-500/10 rounded-full blur-3xl animate-pulse flex items-center justify-center">
                    <i className="fa-solid fa-gem text-7xl text-blue-400/30"></i>
                  </div>
                )}
             </div>
             
             <div className="absolute bottom-8 left-8 flex flex-col font-mono text-[9px] text-blue-500/40 z-20 uppercase tracking-widest">
               <div>VOID_MASS: {active.pwr}</div>
               <div>STABILITY: {active.def}%</div>
             </div>
          </div>

          <div className="px-10 mt-6 flex items-center justify-center gap-6">
             {STAGES.map((stage, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center group/evo cursor-pointer focus:outline-none"
                >
                  <div className={`w-14 h-14 rounded-full border-2 ${stageIndex === idx ? 'border-blue-400 bg-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'border-white/10 bg-white/5'} flex items-center justify-center relative overflow-hidden transition-all duration-300 hover:scale-110`}>
                     {stage.icon ? (
                       <i className={`fa-solid ${stage.icon} text-white/40 text-xl`}></i>
                     ) : (
                       <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.spriteId}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                     )}
                  </div>
                  <span className={`text-[8px] mt-2 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-blue-400' : 'text-white/20'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-10 space-y-8">
             <div className="bg-blue-500/5 border border-white/5 p-6 rounded-[35px] backdrop-blur-sm shadow-inner text-center">
                <p className="text-blue-100/40 text-[11px] font-bold italic leading-relaxed">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                <div className="text-center group/stat">
                   <div className="text-3xl text-white font-orbitron group-hover:text-blue-300 transition-colors">{active.pwr}%</div>
                   <div className="opacity-40 text-[8px] mt-2">ION CHARGE</div>
                </div>
                <div className="w-[1px] h-12 bg-blue-500/20"></div>
                <div className="text-center group/stat">
                   <div className="text-3xl text-white font-orbitron group-hover:text-blue-300 transition-colors">{active.def}%</div>
                   <div className="opacity-40 text-[8px] mt-2">IDEAL SYNC</div>
                </div>
             </div>
          </div>

          <button className="h-20 bg-blue-600 hover:bg-white text-black flex items-center justify-center transition-all duration-700 cursor-pointer font-black uppercase tracking-[2em] text-xs shadow-2xl relative overflow-hidden group/btn">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
             FUSION BOLT
          </button>
        </div>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes void-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-void-hover { animation: void-hover 6s ease-in-out infinite; }
        @keyframes float-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
        .animate-float-pulse { animation: float-pulse 3s ease-in-out infinite; }
        @keyframes ripple-slow { 0% { transform: scale(0.8); opacity: 0; } 50% { opacity: 0.3; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-ripple-slow { animation: ripple-slow 5s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.05; } 50% { transform: scale(1.2); opacity: 0.15; } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default ZekromView;
