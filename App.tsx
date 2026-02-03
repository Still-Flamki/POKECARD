
import React, { useState } from 'react';
import { Realm, ViewState } from './types';
import PokemonSection from './components/PokemonSection';
import ZekromView from './components/ZekromView';
import PikachuView from './components/PikachuView';
import CharizardView from './components/CharizardView';
import MewtwoView from './components/MewtwoView';
import SquirtleView from './components/SquirtleView';
import BulbasaurView from './components/BulbasaurView';
import WobbuffetView from './components/WobbuffetView';
import GengarView from './components/GengarView';
import MagnetonView from './components/MagnetonView';
import SnorlaxView from './components/SnorlaxView';
import CommandCenter from './components/CommandCenter';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('POKEMON_SECTION');
  const [activeRealm, setActiveRealm] = useState<Realm>(Realm.ZEKROM);

  const renderContent = () => {
    switch (viewState) {
      case 'POKEMON_SECTION':
        return (
          <PokemonSection 
            onSelectPokemon={(realm) => {
              setActiveRealm(realm);
              setViewState('POKEMON_DETAIL');
            }} 
            onBack={() => {}} 
          />
        );
      case 'POKEMON_DETAIL':
        switch (activeRealm) {
          case Realm.ZEKROM: return <ZekromView />;
          case Realm.PIKACHU: return <PikachuView />;
          case Realm.CHARIZARD: return <CharizardView />;
          case Realm.MEWTWO: return <MewtwoView />;
          case Realm.SQUIRTLE: return <SquirtleView />;
          case Realm.BULBASAUR: return <BulbasaurView />;
          case Realm.WOBBUFFET: return <WobbuffetView />;
          case Realm.GENGAR: return <GengarView />;
          case Realm.MAGNETON: return <MagnetonView />;
          case Realm.SNORLAX: return <SnorlaxView />;
          default: return <ZekromView />;
        }
      default:
        return (
          <PokemonSection 
            onSelectPokemon={(realm) => {
              setActiveRealm(realm);
              setViewState('POKEMON_DETAIL');
            }} 
            onBack={() => {}}
          />
        );
    }
  };

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-black text-white font-rajdhani">
      <div className="fixed inset-0 pointer-events-none opacity-20 static-overlay z-0" />

      <main className="flex-1 w-full h-full relative z-10 overflow-hidden">
        {renderContent()}
      </main>

      {/* Global Interface Overlay */}
      {viewState === 'POKEMON_DETAIL' && (
        <>
          <nav className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] flex gap-4 p-2 bg-black/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-10 fade-in duration-700">
            <button 
              onClick={() => setViewState('POKEMON_SECTION')}
              className="px-10 h-14 rounded-full bg-emerald-600/10 border border-emerald-500/30 flex items-center gap-3 hover:bg-emerald-500/20 transition-all group"
            >
              <i className="fa-solid fa-grid-2 text-emerald-400 group-hover:scale-125 transition-transform"></i>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">Unit Registry</span>
            </button>
          </nav>
          
          <CommandCenter activeRealm={activeRealm} />
        </>
      )}

      {/* Global Status Bar */}
      <div className="fixed top-6 left-6 z-40 flex items-center gap-4 pointer-events-none opacity-60">
        <div className="h-[1px] w-8 bg-emerald-500/50"></div>
        <div className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500/80">
          REALM_LINK: {activeRealm.toUpperCase()} // STATUS: ACTIVE
        </div>
      </div>
    </div>
  );
};

export default App;
