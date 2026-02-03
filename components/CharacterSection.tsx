
import React, { useState, useEffect } from 'react';

interface Era {
  label: string;
  img: string;
  status: string;
  lore: string;
}

interface Character {
  id: string;
  name: string;
  region: string;
  role: string;
  color: string;
  stats: { emp: number; str: number; exp: number };
  eras: Era[];
}

/**
 * Enhanced Image Proxy logic.
 * We use images.weserv.nl because it handles the referer stripping on the server side.
 * This is the most reliable way to display images from hosts that block direct embedding.
 */
const prox = (url: string) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=1000&fit=contain&n=-1&il`;

const CHARACTERS: Character[] = [
  {
    id: "CH-001", name: "ASH KETCHUM", region: "KANTO", role: "WORLD CHAMPION", color: "blue",
    stats: { emp: 100, str: 94, exp: 99 },
    eras: [
      { label: "WORLD CHAMP", status: "CHAMPION", img: "https://archives.bulbagarden.net/media/upload/e/e1/Ash_JN.png", lore: "The current World Monarch after defeating Leon. He has achieved his dream of becoming a true Pokémon Master." },
      { label: "XY SERIES", status: "ELITE", img: "https://archives.bulbagarden.net/media/upload/3/3b/XY_Ash.png", lore: "A mature strategist who mastered the Bond Phenomenon with his Greninja." },
      { label: "ORIGIN", status: "ROOKIE", img: "https://archives.bulbagarden.net/media/upload/d/d4/Ash_anime.png", lore: "The boy from Pallet Town who started a journey that would change the world." }
    ]
  },
  {
    id: "CH-002", name: "MISTY", region: "KANTO", role: "WATER MASTER", color: "cyan",
    stats: { emp: 85, str: 82, exp: 90 },
    eras: [
      { label: "LEADER", status: "GYM LEAD", img: "https://archives.bulbagarden.net/media/upload/b/bd/Misty_PE.png", lore: "Cerulean City Gym Leader. Her mastery over aquatic combat is unmatched." },
      { label: "ORIGIN", status: "TRAVELER", img: "https://archives.bulbagarden.net/media/upload/0/03/Misty_anime.png", lore: "A tomboyish mermaid who joined Ash after he 'borrowed' and destroyed her bike." }
    ]
  },
  {
    id: "CH-003", name: "BROCK", region: "KANTO", role: "PVM DOCTOR", color: "orange",
    stats: { emp: 99, str: 72, exp: 95 },
    eras: [
      { label: "DOCTOR", status: "MEDIC", img: "https://archives.bulbagarden.net/media/upload/4/4e/Brock_PE.png", lore: "Pursuing his dream to become a Pokémon Doctor, specializing in health and nutrition." },
      { label: "ORIGIN", status: "BREEDER", img: "https://archives.bulbagarden.net/media/upload/7/77/Brock_anime.png", lore: "Former Pewter Gym Leader and the primary caretaker of the group for years." }
    ]
  },
  {
    id: "CH-004", name: "SERENA", region: "KALOS", role: "PERFORMER", color: "pink",
    stats: { emp: 95, str: 75, exp: 88 },
    eras: [
      { label: "IDOL", status: "MASTER", img: "https://archives.bulbagarden.net/media/upload/f/f6/Serena_Journeys.png", lore: "A world-class Performer known for her grace and unique bond with her Pokémon team." }
    ]
  },
  {
    id: "CH-005", name: "DAWN", region: "SINNOH", role: "COORDINATOR", color: "purple",
    stats: { emp: 92, str: 84, exp: 89 },
    eras: [
      { label: "ELITE", status: "MASTER", img: "https://archives.bulbagarden.net/media/upload/d/d9/Dawn_anime.png", lore: "A talented coordinator from Twinleaf Town who lives by the mantra: 'No need to worry!'" }
    ]
  },
  {
    id: "CH-006", name: "IRIS", region: "UNOVA", role: "CHAMPION", color: "purple",
    stats: { emp: 82, str: 98, exp: 92 },
    eras: [
      { label: "UNOVA", status: "CHAMPION", img: "https://archives.bulbagarden.net/media/upload/3/30/Iris_anime.png", lore: "The current Unova Champion. A Dragon-type specialist with wild instincts and raw power." }
    ]
  },
  {
    id: "CH-007", name: "GOH", region: "KANTO", role: "RESEARCHER", color: "red",
    stats: { emp: 75, str: 90, exp: 85 },
    eras: [
      { label: "PROJECT", status: "OPERATIVE", img: "https://archives.bulbagarden.net/media/upload/a/a2/Goh_anime.png", lore: "A member of Project Mew. He aims to catch every Pokémon to reach the ultimate secret: Mew." }
    ]
  },
  {
    id: "CH-008", name: "LILLIE", region: "ALOLA", role: "RESEARCHER", color: "white",
    stats: { emp: 98, str: 62, exp: 75 },
    eras: [
      { label: "ALOLA", status: "ALUMNI", img: "https://archives.bulbagarden.net/media/upload/d/db/Lillie_anime.png", lore: "A courageous girl who overcame her fears and now explores the mysteries of Ultra Space." }
    ]
  }
];

const CharacterSection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [eraIndex, setEraIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [preloaded, setPreloaded] = useState(false);

  // PRELOAD ALL IMAGES ON MOUNT
  useEffect(() => {
    const preloadImages = () => {
      let loadedCount = 0;
      const allImgs: string[] = [];
      CHARACTERS.forEach(c => c.eras.forEach(e => allImgs.push(prox(e.img))));
      
      allImgs.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === allImgs.length) setPreloaded(true);
        };
      });
    };
    preloadImages();
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTilt({
        x: (window.innerWidth / 2 - e.clientX) / 45,
        y: (window.innerHeight / 2 - e.clientY) / 45
      });
    };
    if (selectedChar) window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [selectedChar]);

  if (selectedChar) {
    const activeEra = selectedChar.eras[eraIndex];
    return (
      <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#010105] overflow-hidden p-6 sm:p-12">
        <div className={`absolute inset-0 opacity-20 bg-${selectedChar.color}-500/10 pointer-events-none transition-colors duration-1000`} />
        
        <div 
          className="relative w-full max-w-[440px] h-[85vh] transition-transform duration-300 ease-out preserve-3d z-20"
          style={{ transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg)` }}
        >
          <div className={`absolute inset-0 bg-[#08080c] border-2 border-${selectedChar.color}-500/30 rounded-[60px] shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden flex flex-col backdrop-blur-3xl`}>
            
            <div className="p-12 pb-6 flex justify-between items-start z-10">
              <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl font-orbitron font-black text-white tracking-tighter italic uppercase leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">{selectedChar.name}</h2>
                <div className="flex items-center gap-3 mt-4">
                   <div className={`w-3 h-3 bg-${selectedChar.color}-500 rounded-full animate-ping`}></div>
                   <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.6em]">{activeEra.status}</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-[24px] bg-zinc-900 border border-${selectedChar.color}-500/50 flex items-center justify-center text-white shrink-0 shadow-2xl`}>
                 <i className="fa-solid fa-dna text-3xl animate-pulse"></i>
              </div>
            </div>

            <div className={`flex-1 mx-8 mt-4 bg-zinc-950/80 rounded-[50px] border border-white/5 relative overflow-hidden flex items-center justify-center group/img shadow-inner`}>
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
               <img 
                 key={activeEra.img}
                 src={prox(activeEra.img)} 
                 referrerPolicy="no-referrer"
                 className={`h-[90%] w-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)] z-10 transition-all duration-1000 p-8 group-hover/img:scale-110 opacity-100`} 
                 alt={selectedChar.name}
               />
               
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-24 w-full animate-scan-line z-20" />

               <div className={`absolute top-8 left-8 bg-black/80 px-6 py-2 rounded-full border border-${selectedChar.color}-500/30 text-[10px] font-black uppercase tracking-widest text-white/80 z-20 backdrop-blur-md`}>
                 {activeEra.label}
               </div>
            </div>

            <div className="px-8 mt-6 flex items-center justify-center gap-4">
               {selectedChar.eras.map((era, idx) => (
                 <button 
                   key={idx} 
                   onClick={() => setEraIndex(idx)}
                   className={`px-8 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${eraIndex === idx ? `bg-${selectedChar.color}-500/20 border-${selectedChar.color}-500 text-${selectedChar.color}-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]` : 'border-white/5 bg-white/5 text-white/20 hover:text-white/60 hover:border-white/10'}`}
                 >
                   {era.label}
                 </button>
               ))}
            </div>

            <div className="p-10 space-y-8">
               <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[35px] backdrop-blur-sm min-h-[100px] flex items-center justify-center shadow-inner">
                  <p className="text-white/70 text-[11px] sm:text-[12px] font-bold italic text-center leading-relaxed">
                    "{activeEra.lore}"
                  </p>
               </div>
               <div className="flex justify-around items-center text-[11px] font-black uppercase tracking-widest text-white/30">
                  <div className="text-center group/stat">
                     <div className="text-3xl text-white font-orbitron group-hover/stat:text-blue-400 transition-colors">{selectedChar.stats.emp}%</div>
                     <div className="text-[9px] opacity-40 mt-2">EMPATHY</div>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10"></div>
                  <div className="text-center group/stat">
                     <div className="text-3xl text-white font-orbitron group-hover/stat:text-blue-400 transition-colors">{selectedChar.stats.str}%</div>
                     <div className="text-[9px] opacity-40 mt-2">TACTICS</div>
                  </div>
                  <div className="w-[1px] h-12 bg-white/10"></div>
                  <div className="text-center group/stat">
                     <div className="text-3xl text-white font-orbitron group-hover/stat:text-blue-400 transition-colors">{selectedChar.stats.exp}%</div>
                     <div className="text-[9px] opacity-40 mt-2">SYNC</div>
                  </div>
               </div>
            </div>

            <button 
              onClick={() => { setSelectedChar(null); setEraIndex(0); }}
              className={`h-20 bg-${selectedChar.color}-600 hover:bg-white text-black flex items-center justify-center transition-all duration-700 font-black uppercase tracking-[1.6em] text-xs shadow-2xl`}
            >
               RETURN TO ROOT
            </button>
          </div>
        </div>

        <style>{`
          @keyframes scan-line {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(600%); opacity: 0; }
          }
          .animate-scan-line { animation: scan-line 4s linear infinite; }
          .preserve-3d { transform-style: preserve-3d; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex flex-col items-center p-8 sm:p-20 overflow-y-auto no-scrollbar bg-[#030306]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none" />
      
      {!preloaded && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6">
           <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
           <div className="text-[12px] font-black uppercase tracking-[1em] text-blue-400 animate-pulse">Initializing Neural Cache...</div>
        </div>
      )}

      <div className="max-w-7xl w-full relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-10 mb-24 border-b border-white/10 pb-20 animate-in fade-in duration-1000">
           <div className="text-left space-y-4">
              <h2 className="text-6xl sm:text-9xl font-orbitron font-black tracking-tighter italic uppercase drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] leading-none">HUMAN <span className="text-blue-500">DOSSIER</span></h2>
              <p className="text-[12px] font-black uppercase tracking-[1.2em] text-white/20">Classified Biometric Subject Archive // Ver 4.0.8</p>
           </div>
           <button 
             onClick={onBack}
             className="px-12 py-6 rounded-full border border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/20 transition-all font-black text-[12px] tracking-widest uppercase text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
           >
             Return Home
           </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 sm:gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
           {CHARACTERS.map((char, idx) => (
             <button 
               key={char.id}
               onClick={() => setSelectedChar(char)}
               style={{ animationDelay: `${idx * 0.1}s` }}
               className={`group relative aspect-[3.5/5] bg-zinc-900/30 border-2 border-white/5 rounded-[65px] flex flex-col items-center justify-center p-10 transition-all duration-700 hover:border-${char.color}-500/60 hover:bg-${char.color}-500/[0.15] hover:shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden hover:-translate-y-4`}
             >
                <div className="absolute top-8 right-10 text-[10px] font-mono text-white/10 group-hover:text-white/40 transition-colors uppercase tracking-widest">{char.id}</div>
                
                <div className="w-full h-3/4 flex items-center justify-center relative mb-8">
                  <div className={`absolute inset-0 bg-${char.color}-500/20 rounded-full blur-[70px] opacity-0 group-hover:opacity-50 transition-opacity duration-1000`} />
                  <img 
                    src={prox(char.eras[0].img)} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain transition-all duration-1000 group-hover:scale-115 group-hover:-rotate-3 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] p-4 z-10" 
                    alt={char.name}
                  />
                </div>

                <div className="text-center space-y-3 relative z-10">
                  <h3 className="text-3xl font-orbitron font-black tracking-tighter italic uppercase group-hover:text-white transition-colors text-white/80">{char.name}</h3>
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-${char.color}-500 animate-pulse`} />
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-blue-400 transition-colors">{char.role}</span>
                  </div>
                </div>

                <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.8em] border-b border-white/20 pb-2">Access Profile</span>
                </div>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSection;
