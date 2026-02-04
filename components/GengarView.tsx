
import React, { useState, useEffect, useRef } from 'react';

interface Whisper {
  id: number;
  text: string;
  x: number;
  y: number;
  rotation: number;
}

const SPOOKY_MESSAGES = [
  "I see you...",
  "Behind you.",
  "Cold, isn't it?",
  "The shadows move.",
  "Don't blink.",
  "He's laughing.",
  "Lost in the void.",
  "Closer...",
  "Watching...",
  "Can you feel it?",
  "Silence...",
  "Just a shadow...",
  "It's already here.",
  "Turn around.",
  "Why are you here?",
  "They're coming.",
  "Don't breathe.",
  "Look down."
];

const GengarView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const nextId = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 60,
        y: (window.innerHeight / 2 - e.clientY) / 60
      });
    };

    // Randomly spawn whispers near the cursor with a spectral drift
    const whisperInterval = setInterval(() => {
      if (Math.random() > 0.65) {
        const id = nextId.current++;
        const newWhisper: Whisper = {
          id,
          text: SPOOKY_MESSAGES[Math.floor(Math.random() * SPOOKY_MESSAGES.length)],
          x: mousePos.current.x + (Math.random() - 0.5) * 160,
          y: mousePos.current.y + (Math.random() - 0.5) * 160,
          rotation: (Math.random() - 0.5) * 20
        };

        setWhispers(prev => [...prev, newWhisper]);

        // Auto-remove after animation completes (3.5s to allow for delayed spectral fade)
        setTimeout(() => {
          setWhispers(prev => prev.filter(w => w.id !== id));
        }, 3500);
      }
    }, 700);

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(whisperInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#050008] flex items-center justify-center p-12 overflow-hidden cursor-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.08)_0%,transparent_70%)]" />
        {/* Subtle moving shadows overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] animate-pulse" />
      </div>

      {/* Floating Spectral Whispers */}
      {whispers.map(whisper => (
        <div
          key={whisper.id}
          className="absolute pointer-events-none z-50 text-[11px] font-black uppercase tracking-[0.4em] text-purple-400/40 blur-[0.3px] animate-whisper"
          style={{ 
            left: whisper.x, 
            top: whisper.y,
            transform: `rotate(${whisper.rotation}deg)`
          }}
        >
          {whisper.text}
        </div>
      ))}

      {/* Custom Spectral Cursor */}
      <div 
        className="fixed w-8 h-8 bg-purple-500/10 rounded-full blur-xl pointer-events-none z-50 mix-blend-screen transition-transform duration-75 ease-out flex items-center justify-center"
        style={{ left: mousePos.current.x, top: mousePos.current.y, transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_10px_purple]" />
      </div>

      <div 
        className="relative z-10 flex flex-col items-center justify-center transition-transform duration-500 ease-out"
        style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
      >
        <div className="absolute inset-0 blur-[200px] bg-purple-900/15 rounded-full animate-pulse" />
        
        {/* Shadow Overlay for depth */}
        <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent mix-blend-overlay" />

        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
          className="w-[85vh] max-h-[75vh] object-contain drop-shadow-[0_0_120px_rgba(147,51,234,0.35)] animate-in zoom-in fade-in duration-1000 z-30"
          alt="Gengar"
        />
        
        <div className="mt-8 text-center relative z-40">
          <h1 className="text-6xl sm:text-9xl font-orbitron font-black tracking-tighter uppercase italic text-white leading-none drop-shadow-[0_0_60px_rgba(168,85,247,0.3)]">
            GENGAR
          </h1>
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xl font-black uppercase tracking-[1.2em] text-white/30 italic">Void Shadow Specimen</p>
            <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse mt-4"></div>
            <div className="flex items-center gap-3 text-[10px] text-purple-400/50 tracking-[0.8em] uppercase font-black">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              SHADOW_LURK_DETECTED
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-12 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-black text-[12px] tracking-[1.2em] uppercase text-white/60 hover:text-white backdrop-blur-md"
      >
        Close Entry
      </button>

      <style>{`
        @keyframes whisper-spectral {
          0% { 
            opacity: 0; 
            transform: translate(0, 10px) scale(0.9); 
            filter: blur(6px); 
          }
          15% { 
            opacity: 0.7; 
            transform: translate(0, 0) scale(1); 
            filter: blur(0px); 
          }
          75% { 
            opacity: 0.7; 
            transform: translate(15px, -25px) scale(1.05); 
            filter: blur(0px); 
          }
          100% { 
            opacity: 0; 
            transform: translate(30px, -60px) scale(1.15); 
            filter: blur(12px); 
          }
        }
        .animate-whisper {
          animation: whisper-spectral 3.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GengarView;
