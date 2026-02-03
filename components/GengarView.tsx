
import React, { useState, useEffect, useRef } from 'react';

const STAGES = [
  { id: 92, name: "GASTLY", pwr: 60, status: "VAPOR" },
  { id: 93, name: "HAUNTER", pwr: 75, status: "ETHEREAL" },
  { id: 94, name: "GENGAR", pwr: 92, status: "SHADOW" }
];

interface WhisperInstance {
  id: number;
  x: number;
  y: number;
  text: string;
}

const GengarView: React.FC = () => {
  const [stageIndex, setStageIndex] = useState(2);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rippling, setRippling] = useState(false);
  const [whispers, setWhispers] = useState<WhisperInstance[]>([]);
  const whisperIdRef = useRef(0);
  
  const active = STAGES[stageIndex];
  const whisperPhrases = [
    "Hehehe...", 
    "Did you hear that?", 
    "Look behind you...", 
    "In the shadows...", 
    "Soon...", 
    "Boo!", 
    "I'm here...", 
    "Cold, isn't it?", 
    "Don't turn around...", 
    "Lost?"
  ];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 40,
        y: (window.innerHeight / 2 - e.clientY) / 40
      });

      // Randomized whisper trigger
      if (Math.random() > 0.985) {
        const id = whisperIdRef.current++;
        const newWhisper: WhisperInstance = { 
          id,
          x: e.clientX + (Math.random() - 0.5) * 120, 
          y: e.clientY + (Math.random() - 0.5) * 120, 
          text: whisperPhrases[Math.floor(Math.random() * whisperPhrases.length)] 
        };
        
        setWhispers(prev => [...prev, newWhisper]);
        
        // Remove whisper after animation finishes
        setTimeout(() => {
          setWhispers(prev => prev.filter(w => w.id !== id));
        }, 3000);
      }
    };

    const handleClick = () => {
      setRippling(true);
      setTimeout(() => setRippling(false), 800);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className={`w-full h-full flex items-center justify-center relative bg-[#08010d] overflow-hidden p-6 sm:p-12 cursor-none transition-all duration-500 ${rippling ? 'brightness-150' : ''}`}>
      
      {/* Background Shadow Fog */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
         {Array.from({ length: 5 }).map((_, i) => (
           <div 
             key={i} 
             className="absolute w-[60vw] h-[60vh] bg-purple-900/10 rounded-full blur-[120px] animate-shadow-drift"
             style={{
               left: (i * 20 - 20) + '%',
               top: (Math.random() * 50) + '%',
               animationDuration: (Math.random() * 15 + 10) + 's',
               animationDelay: (i * -3) + 's'
             }}
           />
         ))}
      </div>

      <div className={`absolute inset-0 pointer-events-none z-50 ${rippling ? 'heat-distortion' : ''}`} />

      {/* Custom Psychic/Ghost Cursor */}
      <div 
        className="fixed pointer-events-none z-[100] w-6 h-6 rounded-full border border-purple-500 bg-purple-600/20 blur-[2px] mix-blend-screen transition-transform duration-75"
        style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%) scale(1.5)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
        </div>
      </div>

      {/* Spooky Whispers Container */}
      {whispers.map((w) => (
        <div 
          key={w.id}
          className="fixed pointer-events-none z-[99] text-purple-300/60 font-rajdhani font-bold italic text-sm animate-ghost-whisper"
          style={{ left: w.x, top: w.y }}
        >
          {w.text}
        </div>
      ))}

      {/* Background Peeking Eyes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 12 }).map((_, i) => {
          const eyeX = (i * 15 + 10) % 100;
          const eyeY = (i * 23 + 15) % 100;
          const dx = (mousePos.x / window.innerWidth) * 100 - eyeX;
          const dy = (mousePos.y / window.innerHeight) * 100 - eyeY;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <div 
              key={i}
              className="absolute flex gap-4 opacity-0 animate-eye-blink"
              style={{
                left: eyeX + '%',
                top: eyeY + '%',
                animationDelay: (i * 1.4) + 's',
                transform: `rotate(${angle * 0.1}deg)`
              }}
            >
              <div className="w-1 h-1 bg-red-600 rounded-full shadow-[0_0_8px_#ff0000]" />
              <div className="w-1 h-1 bg-red-600 rounded-full shadow-[0_0_8px_#ff0000]" />
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1)_0%,transparent_70%)] animate-pulse" />
      
      <div 
        className="relative w-full max-w-[420px] h-[82vh] min-h-[600px] transition-transform duration-300 ease-out preserve-3d z-20 group"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 bg-[#0c0018] border-2 border-purple-600/40 rounded-[45px] sm:rounded-[65px] shadow-[0_0_80px_rgba(147,51,234,0.2)] overflow-hidden flex flex-col backdrop-blur-3xl transition-all duration-500 group-hover:border-purple-400">
          
          <div className="p-8 pb-4 flex justify-between items-start z-10">
            <div>
              <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-purple-200 tracking-tighter drop-shadow-[0_0_20px_rgba(147,51,234,0.8)] italic">GENGAR</h2>
              <div className="text-purple-400 text-[9px] font-black uppercase tracking-[0.8em]">VOID ENTITY</div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-900 flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-purple-500/50 animate-shiver">
               <i className="fa-solid fa-ghost text-2xl text-purple-200"></i>
            </div>
          </div>

          <div className="flex-1 mx-6 bg-gradient-to-br from-purple-950/40 via-black to-black rounded-[40px] sm:rounded-[55px] border border-purple-500/20 relative overflow-hidden flex items-center justify-center group-hover:bg-black/80 transition-all">
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
             
             <div className="absolute w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] animate-pulse" />

             <div className="w-full h-full p-8 flex items-center justify-center relative">
                <img 
                  key={active.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} 
                  alt={active.name}
                  className="max-w-[110%] max-h-full object-contain drop-shadow-[0_0_60px_rgba(147,51,234,1)] group-hover:scale-110 group-active:scale-95 transition-all duration-1000 z-20 animate-in fade-in mix-blend-screen group-hover:animate-glitch"
                />
             </div>
          </div>

          <div className="px-8 mt-4 flex items-center justify-center gap-6">
             {STAGES.map((stage, idx) => (
                <button 
                  key={stage.id} 
                  onClick={(e) => { e.stopPropagation(); setStageIndex(idx); }}
                  className="flex flex-col items-center group/evo focus:outline-none"
                >
                   <div className={`w-14 h-14 rounded-xl border ${stageIndex === idx ? 'border-purple-400 bg-purple-400/20 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/5 bg-white/5'} flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110`}>
                      <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`} className="w-full h-full scale-125 object-contain" alt={stage.name} />
                   </div>
                   <span className={`text-[8px] mt-1 font-black uppercase tracking-widest ${stageIndex === idx ? 'text-purple-400' : 'text-white/20'}`}>{stage.name}</span>
                </button>
             ))}
          </div>

          <div className="p-6 space-y-4">
             <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-[20px]">
                <p className="text-purple-100/40 text-[9px] sm:text-[10px] font-bold italic text-center">"It hides in shadows. If a cold chill strikes your back, a Gengar is lurking nearby."</p>
             </div>
             <div className="flex justify-around items-center text-[10px] font-black uppercase tracking-widest text-purple-400">
                <div className="text-center">
                   <div className="text-xl text-white font-orbitron">{active.pwr}</div>
                   <span className="opacity-40">PWR</span>
                </div>
                <div className="w-px h-6 bg-purple-500/20"></div>
                <div className="text-center">
                   <div className="text-xl text-purple-200 font-orbitron">{active.status}</div>
                   <span className="opacity-40">STATE</span>
                </div>
             </div>
          </div>

          <div className="h-14 sm:h-16 bg-purple-700 hover:bg-white text-black flex items-center justify-center transition-all cursor-pointer font-black uppercase tracking-[1.2em] text-xs">
             Shadow Ball
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shadow-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10vw, 5vh) scale(1.1); }
        }
        .animate-shadow-drift { animation: shadow-drift linear infinite; }
        
        @keyframes eye-blink {
          0%, 100% { opacity: 0; transform: scaleY(0.1); }
          5%, 15% { opacity: 0.8; transform: scaleY(1); }
          10% { opacity: 0.4; transform: scaleY(0.1); }
          20% { opacity: 0; }
        }
        
        @keyframes glitch {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          10% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          20% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
          30% { transform: translate(-2px, -2px); filter: hue-rotate(270deg); }
          40% { transform: translate(2px, 2px); filter: hue-rotate(360deg); }
          50% { transform: translate(0); filter: hue-rotate(0deg); }
        }

        @keyframes shiver {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }

        @keyframes ghost-whisper {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); blur(10px); }
          20% { opacity: 1; transform: translateY(0) scale(1); blur(0px); }
          80% { opacity: 1; transform: translateY(-20px) scale(1.05); }
          100% { opacity: 0; transform: translateY(-40px) scale(1.1); blur(10px); }
        }

        .animate-ghost-whisper { animation: ghost-whisper 3s ease-out forwards; }
        .animate-eye-blink { animation: eye-blink 8s infinite; }
        .group-hover\:animate-glitch:hover { animation: glitch 0.3s linear infinite; }
        .animate-shiver { animation: shiver 0.2s linear infinite; }
      `}</style>
    </div>
  );
};

export default GengarView;
