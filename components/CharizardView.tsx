
import React, { useState, useEffect, useRef } from 'react';

const STAGES = [
  { 
    id: 4, name: "CHARMANDER", temp: "600°C", pwr: 45, spd: 50,
    lore: "The flame on its tail shows its life force. If it is healthy, the flame burns brightly.",
    status: "EMBRYO"
  },
  { 
    id: 5, name: "CHARMELEON", temp: "1,200°C", pwr: 65, spd: 70,
    lore: "It has a barbaric nature. In battle, it whips its fiery tail and claws with sharp claws.",
    status: "FURNACE"
  },
  { 
    id: 6, name: "CHARIZARD", temp: "12,000°C", pwr: 94, spd: 100,
    lore: "It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.",
    status: "CORE MELT"
  }
];

class Ember {
  x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = h + Math.random() * 200;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = -(Math.random() * 4 + 2);
    this.size = Math.random() * 8 + 2;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.color = ['#f97316', '#fb923c', '#ea580c', '#f43f5e'][Math.floor(Math.random() * 4)];
  }
  update(w: number, h: number, mx: number, my: number) {
    this.x += this.vx;
    this.y += this.vy;
    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 150) {
      this.vx += (dx/dist) * 0.5;
      this.vy += (dy/dist) * 0.5;
    }
    if (this.y < -50) {
      this.y = h + 50;
      this.x = Math.random() * w;
    }
  }
}

const CharizardView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(2);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const embersRef = useRef<Ember[]>([]);

  const active = STAGES[stageIndex];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 50,
        y: (window.innerHeight / 2 - e.clientY) / 50
      });
    };
    window.addEventListener('mousemove', handleMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      embersRef.current = Array.from({ length: 100 }, () => new Ember(canvas.width, canvas.height));
    };
    window.addEventListener('resize', resize);
    resize();

    let raf: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embersRef.current.forEach(e => {
        e.update(canvas.width, canvas.height, mouseRef.current.x, mouseRef.current.y);
        ctx.save();
        ctx.globalAlpha = e.opacity;
        ctx.fillStyle = e.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#0d0402] flex items-center justify-center p-6 sm:p-12 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen" />
      
      {/* Magma HUD Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.1)_0%,transparent_70%)] animate-pulse" />
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-orange-600/10 to-transparent pointer-events-none" />

      <div 
        className="relative w-full max-w-[440px] h-[85vh] transition-transform duration-300 ease-out preserve-3d z-10"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#120603] border-2 border-orange-500/30 rounded-[60px] shadow-[0_0_150px_rgba(234,88,12,0.2)] overflow-hidden flex flex-col backdrop-blur-3xl group transition-all duration-700 hover:border-orange-500">
          
          <div className="p-12 pb-6 flex justify-between items-start z-10 relative">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                 <span className="text-[10px] font-black tracking-[0.8em] text-orange-500/60 uppercase">Thermal Integrity: Nominal</span>
              </div>
              <h2 className="text-4xl sm:text-7xl font-orbitron font-black text-white tracking-tighter italic uppercase drop-shadow-[0_0_20px_rgba(234,88,12,0.6)]">
                {active.name}
              </h2>
            </div>
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white text-3xl shadow-[0_0_40px_rgba(234,88,12,1)] animate-thermal-shimmer">
               <i className="fa-solid fa-fire"></i>
            </div>
          </div>

          <div className="flex-1 mx-8 mt-4 bg-black/60 rounded-[50px] border border-orange-500/10 relative overflow-hidden flex items-center justify-center group-hover:border-orange-500/40 transition-all duration-500">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.05)_0%,transparent_70%)]" />
             
             {/* Heat Waves Layer */}
             <div className="absolute inset-0 pointer-events-none heat-distortion opacity-60 mix-blend-overlay" />

             <div className="w-full h-full p-12 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[125%] max-h-full object-contain drop-shadow-[0_0_100px_rgba(234,88,12,1)] group-hover:scale-110 transition-transform duration-1000 z-20 animate-in fade-in zoom-in"
                />
             </div>
             
             <div className="absolute top-10 right-10 flex flex-col items-end gap-1 font-mono text-[10px] text-orange-400/40 z-20">
               <div>TEMP_LIMIT: {active.temp}</div>
               <div>MODE: {active.status}</div>
             </div>
          </div>

          <div className="px-8 mt-8 flex items-center justify-center gap-6">
             {STAGES.map((stage, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setStageIndex(idx)}
                  className="flex flex-col items-center group/evo focus:outline-none"
                >
                   <div className={`w-14 h-14 rounded-full border-2 ${stageIndex === idx ? 'border-orange-500 bg-orange-500/20 shadow-[0_0_20px_rgba(234,88,12,0.5)]' : 'border-white/5 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[8px] mt-2 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-orange-400' : 'text-white/20'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-10 space-y-8">
             <div className="bg-orange-500/5 border border-white/5 p-6 rounded-[35px] backdrop-blur-sm shadow-inner text-center">
                <p className="text-orange-100/40 text-[11px] font-bold italic leading-relaxed">"{active.lore}"</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
                <div className="text-center group/stat">
                   <div className="text-3xl text-white font-orbitron group-hover:text-orange-400 transition-colors">{active.pwr}%</div>
                   <div className="opacity-40 text-[8px] mt-2 tracking-widest">THERMAL POWER</div>
                </div>
                <div className="w-[1px] h-12 bg-white/10"></div>
                <div className="text-center group/stat">
                   <div className="text-3xl text-white font-orbitron group-hover:text-orange-400 transition-colors">{active.spd}%</div>
                   <div className="opacity-40 text-[8px] mt-2 tracking-widest">VELOCITY SYNC</div>
                </div>
             </div>
          </div>

          <button className="h-20 bg-gradient-to-r from-red-600 to-orange-600 hover:from-white hover:to-white text-white hover:text-black flex items-center justify-center transition-all duration-700 cursor-pointer font-black uppercase tracking-[1.8em] text-xs shadow-2xl relative overflow-hidden group/btn">
             <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
             FLARE BLITZ
          </button>
        </div>
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes thermal-shimmer {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.3); }
        }
        .animate-thermal-shimmer { animation: thermal-shimmer 2s ease-in-out infinite; }
        .heat-distortion {
          background-image: url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Static_Noise_Texture.png');
          filter: contrast(150%) brightness(150%) blur(2px);
          mix-blend-mode: overlay;
          animation: noise 0.2s infinite;
        }
        @keyframes noise {
          0%, 100% { transform: translate(0,0); }
          10% { transform: translate(-5%,-5%); }
          20% { transform: translate(-10%,5%); }
        }
      `}</style>
    </div>
  );
};

export default CharizardView;
