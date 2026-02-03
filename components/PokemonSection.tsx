
import React, { useState, useEffect } from 'react';
import { Realm } from '../types';

interface PokemonSectionProps {
  onSelectPokemon: (realm: Realm) => void;
  onBack: () => void;
}

const POKEMON_MAP: Record<string, { id: number; name: string; color: string; icon: string; classification: string }> = {
  [Realm.ZEKROM]: { id: 644, name: "ZEKROM", color: "blue", icon: "fa-meteor", classification: "ANTIGRAVITY CORE" },
  [Realm.PIKACHU]: { id: 25, name: "PIKACHU", color: "yellow", icon: "fa-bolt-lightning", classification: "ELECTRICAL OVERDRIVE" },
  [Realm.CHARIZARD]: { id: 6, name: "CHARIZARD", color: "orange", icon: "fa-fire-flame-curved", classification: "THERMAL FUSION" },
  [Realm.MEWTWO]: { id: 150, name: "MEWTWO", color: "purple", icon: "fa-brain", classification: "PSYCHIC SINGULARITY" },
  [Realm.SQUIRTLE]: { id: 7, name: "SQUIRTLE", color: "cyan", icon: "fa-droplet", classification: "HYDRO DYNAMICS" },
  [Realm.BULBASAUR]: { id: 1, name: "BULBASAUR", color: "emerald", icon: "fa-leaf", classification: "BIO-SYNTHESIS" },
  [Realm.WOBBUFFET]: { id: 202, name: "WOBBUFFET", color: "blue", icon: "fa-shield-halved", classification: "KINETIC REFLECTOR" },
  [Realm.GENGAR]: { id: 94, name: "GENGAR", color: "purple", icon: "fa-ghost", classification: "VOID SHADOW" },
  [Realm.MAGNETON]: { id: 82, name: "MAGNETON", color: "zinc", icon: "fa-magnet", classification: "POLAR ARRAY" },
  [Realm.SNORLAX]: { id: 143, name: "SNORLAX", color: "emerald", icon: "fa-bed", classification: "DORMANT TITAN" },
};

const PokemonSection: React.FC<PokemonSectionProps> = ({ onSelectPokemon }) => {
  const [scanning, setScanning] = useState(true);
  const pokemonList = Object.values(Realm).map(realm => ({
    realm,
    ...POKEMON_MAP[realm]
  }));

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  function getColorStyles(color: string) {
    const mapping: Record<string, string> = {
      blue: 'border-blue-500/30 text-blue-400 hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      yellow: 'border-yellow-500/30 text-yellow-400 hover:border-yellow-400 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]',
      orange: 'border-orange-500/30 text-orange-500 hover:border-orange-400 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
      purple: 'border-purple-500/30 text-purple-400 hover:border-purple-400 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      cyan: 'border-cyan-500/30 text-cyan-400 hover:border-cyan-400 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      emerald: 'border-emerald-500/30 text-emerald-400 hover:border-emerald-400 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      zinc: 'border-zinc-500/30 text-zinc-400 hover:border-zinc-400 group-hover:shadow-[0_0_30px_rgba(113,113,122,0.3)]',
    };
    return mapping[color] || 'border-white/20 text-white';
  }

  return (
    <div className="w-full h-full relative flex flex-col items-center p-6 sm:p-20 overflow-y-auto no-scrollbar bg-[#020204]">
      {/* HUD Background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[2] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-[0.03] z-[1]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] opacity-30 animate-pulse" />
      </div>

      <div className="max-w-[1400px] w-full relative z-10 flex flex-col h-full">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 pb-12 border-b border-emerald-500/10 relative">
          <div className="text-left space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.8em] text-emerald-500/60">System Online // Unit Registry v9.0</span>
             </div>
             <h2 className="text-6xl sm:text-9xl font-orbitron font-black tracking-tighter italic uppercase text-white leading-none">
               UNIT <span className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">DATABASE</span>
             </h2>
             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 max-w-xl">
               Unauthorized entry into neural sync streams is prohibited. All behavioral metrics are recorded in real-time.
             </p>
          </div>
          
          <div className="hidden md:flex flex-col items-end gap-2 font-mono text-[10px] text-emerald-500/40">
            <div>LATENCY: 12ms</div>
            <div>UPTIME: 99.998%</div>
            <div className="flex gap-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 h-3 bg-emerald-500/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        </header>

        {scanning ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-40">
             <div className="w-64 h-1 bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500 w-full -translate-x-full animate-progress-scan" />
             </div>
             <div className="text-emerald-500 font-orbitron font-black text-xs tracking-[1em] animate-pulse">DECRYPTING ARCHIVES...</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             {pokemonList.map((pkmn, idx) => (
               <button
                 key={pkmn.realm}
                 onClick={() => onSelectPokemon(pkmn.realm)}
                 style={{ animationDelay: `${idx * 0.05}s` }}
                 className={`group relative aspect-[3/4] bg-zinc-900/10 backdrop-blur-md rounded-[30px] border-2 transition-all duration-500 flex flex-col items-center justify-between p-6 sm:p-8 hover:-translate-y-4 hover:bg-zinc-800/30 ${getColorStyles(pkmn.color)} animate-in zoom-in fade-in`}
               >
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-inherit rounded-tl-[30px] opacity-20 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-inherit rounded-br-[30px] opacity-20 group-hover:opacity-100 transition-opacity" />

                  <div className="w-full flex justify-between items-start z-10">
                    <div className="font-mono text-[9px] opacity-40 group-hover:opacity-100 transition-opacity">#{String(pkmn.id).padStart(3, '0')}</div>
                    <i className={`fa-solid ${pkmn.icon} text-xs opacity-20 group-hover:opacity-100 group-hover:scale-125 transition-all`}></i>
                  </div>

                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity" />
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pkmn.id}.png`} 
                      className="h-[120%] w-[120%] object-contain z-10 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]" 
                      alt={pkmn.name}
                    />
                  </div>

                  <div className="w-full text-center space-y-2 z-10">
                    <div className="text-[7px] font-black uppercase tracking-[0.6em] opacity-40 group-hover:opacity-100 group-hover:text-inherit transition-all">
                      {pkmn.classification}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-orbitron font-black tracking-tighter italic uppercase group-hover:scale-105 transition-transform">
                      {pkmn.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 opacity-20 group-hover:opacity-60 transition-opacity">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-3 h-1 bg-white" />
                      ))}
                    </div>
                  </div>

                  {/* Hover Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex items-center justify-center translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/80 to-transparent rounded-b-[30px]">
                     <span className="text-[9px] font-black uppercase tracking-[0.8em] text-white">Establish Link</span>
                  </div>
               </button>
             ))}
          </div>
        )}

        <footer className="mt-20 pt-12 border-t border-emerald-500/10 flex flex-col sm:flex-row justify-between items-center gap-8 text-[9px] font-black uppercase tracking-[0.6em] text-white/20">
           <div className="flex items-center gap-6">
              <span className="text-emerald-500/40">Secure Connection: AES-256</span>
              <span className="hidden sm:block">Archive Node: Sector 7-G</span>
           </div>
           <div className="flex gap-10">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <span>Stable</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span>Monitoring</span>
              </div>
           </div>
        </footer>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes progress-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-progress-scan { animation: progress-scan 1.5s ease-in-out infinite; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default PokemonSection;
