
import React from 'react';
import { ViewState } from '../types';

interface HomeViewProps {
  onSelectSection: (section: ViewState) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onSelectSection }) => {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden p-6 sm:p-12">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      
      {/* Title Header */}
      <div className="relative z-20 text-center space-y-4 mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="inline-block px-4 py-1 border border-blue-500/30 bg-blue-500/10 rounded-full mb-4">
          <span className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase">Universal Archive v4.0</span>
        </div>
        <h1 className="text-6xl sm:text-8xl font-orbitron font-black tracking-tighter italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          ENTITY <span className="text-blue-500">DATABASE</span>
        </h1>
        <p className="text-white/40 max-w-lg mx-auto text-sm font-medium tracking-widest uppercase">
          Accessing synchronized neural data streams from the elemental realms.
        </p>
      </div>

      {/* Main Sections Grid - Focused only on Pokemon Section */}
      <div className="w-full max-w-2xl relative z-20">
        {/* POKEMON SECTION */}
        <button 
          onClick={() => onSelectSection('POKEMON_SECTION')}
          className="group relative w-full h-[400px] sm:h-[500px] border border-white/10 rounded-[40px] overflow-hidden bg-zinc-900/20 backdrop-blur-md transition-all duration-700 hover:border-emerald-500/50 hover:shadow-[0_0_100px_rgba(16,185,129,0.15)] flex flex-col p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-20 duration-1000"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

          <div className="mt-auto relative z-20 text-left space-y-4">
             <div className="w-16 h-1 w-full bg-white/10 group-hover:bg-emerald-500 transition-colors"></div>
             <h3 className="text-4xl sm:text-5xl font-orbitron font-black tracking-tighter italic">POKEMON <span className="text-white/40">UNITS</span></h3>
             <p className="text-xs text-white/30 font-bold uppercase tracking-widest leading-loose">
               Elemental database of awakened legendary entities and unique specimens. Full behavioral analytics and neural sync profiles.
             </p>
             <div className="flex items-center gap-4 pt-4 text-emerald-400 font-black text-[10px] tracking-[0.4em] uppercase">
                <span>Enter Database</span>
                <i className="fa-solid fa-arrow-right animate-bounce-x"></i>
             </div>
          </div>

          <div className="absolute top-12 right-12 text-8xl opacity-5 group-hover:opacity-20 transition-all duration-700 rotate-12 group-hover:rotate-0 group-hover:scale-110">
            <i className="fa-solid fa-bolt"></i>
          </div>
        </button>
      </div>

      {/* Decorative scanner line */}
      <div className="fixed left-0 w-full h-[1px] bg-blue-500/20 top-1/2 -translate-y-1/2 pointer-events-none animate-scan z-10" />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-40vh); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40vh); opacity: 0; }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
      `}</style>
    </div>
  );
};

export default HomeView;
