
import React, { useRef, useEffect, useState } from 'react';
import { Realm } from '../types';

interface PokemonSectionProps {
  onSelectPokemon: (realm: Realm) => void;
  onBack: () => void;
}

const POKEMON_DATA = [
  { realm: Realm.ZEKROM, id: 644, name: "ZEKROM", theme: "#3b82f6", label: "Antigravity Core", icon: "fa-atom", type: "ELECTR/DRAGON" },
  { realm: Realm.PIKACHU, id: 25, name: "PIKACHU", theme: "#eab308", label: "High Voltage", icon: "fa-bolt", type: "ELECTRIC" },
  { realm: Realm.CHARIZARD, id: 6, name: "CHARIZARD", theme: "#f97316", label: "Thermal Alpha", icon: "fa-fire", type: "FIRE/FLYING" },
  { realm: Realm.MEWTWO, id: 150, name: "MEWTWO", theme: "#a855f7", label: "Psychic Void", icon: "fa-brain", type: "PSYCHIC" },
  { realm: Realm.SQUIRTLE, id: 7, name: "SQUIRTLE", theme: "#06b6d4", label: "Hydro Stream", icon: "fa-droplet", type: "WATER" },
  { realm: Realm.BULBASAUR, id: 1, name: "BULBASAUR", theme: "#10b981", label: "Bio Synthesis", icon: "fa-leaf", type: "GRASS/POISON" },
  { realm: Realm.GENGAR, id: 94, name: "GENGAR", theme: "#6d28d9", label: "Shadow Bound", icon: "fa-ghost", type: "GHOST/POISON" },
  { realm: Realm.SNORLAX, id: 143, name: "SNORLAX", theme: "#059669", label: "Dormant Titan", icon: "fa-bed", type: "NORMAL" },
];

const PokemonSection: React.FC<PokemonSectionProps> = ({ onSelectPokemon }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const progress = el.scrollLeft / (el.scrollWidth - el.clientWidth);
      setScrollProgress(progress);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-full relative bg-[#020205] flex flex-col justify-center overflow-hidden perspective-container">
      {/* Background Ambience & Scanning Lines */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="w-full h-[1px] bg-white/20 absolute top-0 left-0 animate-scan-y"></div>
        <div className="w-[1px] h-full bg-white/20 absolute top-0 left-1/4 animate-scan-x"></div>
      </div>
      
      {/* Cinematic Header */}
      <div className="absolute top-10 sm:top-24 left-0 w-full text-center z-20 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="inline-block px-6 py-1.5 border border-white/10 bg-white/5 rounded-full mb-4 backdrop-blur-md">
          <span className="text-[10px] font-black tracking-[1.2em] text-white/50 uppercase">REALM_NAVIGATOR_v4.2</span>
        </div>
        <h1 className="text-5xl sm:text-8xl md:text-9xl font-orbitron font-black tracking-tighter italic text-white leading-none px-4 drop-shadow-[0_10px_40px_rgba(0,0,0,1)]">
          ELEMENTAL <span className="text-white/20">ARCHIVE</span>
        </h1>
      </div>

      {/* Horizontal Strip Slider with 3D Transforms */}
      <div 
        ref={scrollRef}
        className="flex gap-12 sm:gap-20 px-[15vw] overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-20 sm:py-48 z-10"
      >
        {POKEMON_DATA.map((pkmn, idx) => (
          <button
            key={pkmn.realm}
            onClick={() => onSelectPokemon(pkmn.realm)}
            className="group relative flex-shrink-0 w-[85vw] max-w-[480px] h-[65vh] sm:h-[700px] bg-zinc-950/40 rounded-[50px] sm:rounded-[80px] border border-white/10 hover:border-white/40 transition-all duration-1000 snap-center overflow-hidden flex flex-col p-10 sm:p-14 group transition-all"
            style={{ 
              transform: `rotateY(${idx % 2 === 0 ? '-5deg' : '5deg'}) scale(0.95)`,
            }}
          >
            {/* Background Data Matrix Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-20 transition-opacity duration-1000 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {/* Glowing Focal Point */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-1000 group-hover:scale-125 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 40%, ${pkmn.theme}, transparent 70%)` }}
            />
            
            <div className="relative z-20 flex justify-between items-start w-full">
              <div className="space-y-1 text-left">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-white/80 transition-colors">SPECIMEN_ID_#{String(pkmn.id).padStart(3, '0')}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{pkmn.label}</div>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-all group-hover:border-white/40 group-hover:rotate-[360deg] duration-1000">
                <i className={`fa-solid ${pkmn.icon} text-xl sm:text-3xl`}></i>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative py-10 overflow-hidden">
              <div className="absolute w-56 h-56 sm:w-80 sm:h-80 border-2 border-white/5 rounded-full animate-spin-slow opacity-20 group-hover:opacity-100 transition-all" style={{ borderColor: `${pkmn.theme}44` }} />
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 border border-white/5 rounded-full animate-reverse-spin opacity-10" />
              
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pkmn.id}.png`}
                className="h-[85%] sm:h-full w-auto object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.05)] group-hover:drop-shadow-[0_0_150px_rgba(255,255,255,0.3)] group-hover:scale-115 group-hover:-translate-y-8 transition-all duration-1000 z-10"
                alt={pkmn.name}
              />
              
              {/* Type Readout */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[1em] text-white/10 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-[-20px]">
                {pkmn.type}
              </div>
            </div>

            <div className="mt-auto relative z-20 text-center space-y-4">
               <div className="w-full h-[1px] bg-white/10 group-hover:bg-white/40 transition-colors mb-6 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:scale-150 transition-all"></div>
               </div>
               <h3 className="text-5xl sm:text-7xl font-orbitron font-black tracking-tighter italic text-white uppercase group-hover:scale-110 transition-transform duration-700 glitch-text">{pkmn.name}</h3>
               <div className="flex items-center justify-center gap-6 text-white/40 font-black text-[11px] sm:text-[13px] tracking-[0.5em] sm:tracking-[0.8em] uppercase opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                  <span className="group-hover:text-white">SYNCHRONIZE_REALM</span>
                  <i className="fa-solid fa-arrow-right animate-bounce-x"></i>
               </div>
            </div>
          </button>
        ))}
      </div>

      {/* Persistent Technical Background Text */}
      <div className="fixed bottom-0 left-0 p-10 z-0 pointer-events-none opacity-5">
        <pre className="text-[10px] font-mono leading-tight">
          {`ARCHIVE_INDEX_SEQ: [${Array.from({length: 10}, () => Math.floor(Math.random()*99999).toString(16)).join(' : ')}]
          REALM_STATUS: SYNCHRONIZED
          AUTH: SOVEREIGN_CLEARANCE_OMEGA
          LATENCY: 4.2ms`}
        </pre>
      </div>

      {/* Progress Bar HUD */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-white/5 rounded-full overflow-hidden z-30">
        <div 
          className="h-full bg-white/40 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      <style>{`
        @keyframes scan-y {
          0% { top: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scan-x {
          0% { left: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .animate-scan-y { animation: scan-y 5s linear infinite; }
        .animate-scan-x { animation: scan-x 8s linear infinite; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 10s linear infinite; }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PokemonSection;
