
import React, { useState, useEffect, useRef } from 'react';
import { Realm, ViewState } from './types';
import HomeView from './components/HomeView';
import PokemonSection from './components/PokemonSection';
import CharacterSection from './components/CharacterSection';
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
  const [viewState, setViewState] = useState<ViewState>('BOOT');
  const [activeRealm, setActiveRealm] = useState<Realm>(Realm.ZEKROM);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleBack = () => setViewState(viewState === 'POKEMON_DETAIL' ? 'POKEMON_SECTION' : 'HOME');

  // Theme mapping for background particles
  const themeColors: Record<Realm, string> = {
    [Realm.ZEKROM]: '#3b82f6',
    [Realm.PIKACHU]: '#eab308',
    [Realm.CHARIZARD]: '#f97316',
    [Realm.MEWTWO]: '#a855f7',
    [Realm.SQUIRTLE]: '#06b6d4',
    [Realm.BULBASAUR]: '#10b981',
    [Realm.WOBBUFFET]: '#3b82f6',
    [Realm.GENGAR]: '#6d28d9',
    [Realm.MAGNETON]: '#a1a1aa',
    [Realm.SNORLAX]: '#059669',
  };

  useEffect(() => {
    // Initial Boot Sequence
    const timer = setTimeout(() => {
      setViewState('HOME');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2,
      }));
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = viewState === 'HOME' ? '#3b82f6' : themeColors[activeRealm];
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p2) => {
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 180) * 0.04;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [activeRealm, viewState]);

  const renderContent = () => {
    switch (viewState) {
      case 'BOOT':
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-6 animate-pulse">
            <div className="w-24 h-[1px] bg-blue-500/50"></div>
            <div className="text-[12px] font-orbitron font-black tracking-[1.5em] text-blue-400 uppercase">
              Initializing_Sovereign_Link
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        );
      case 'HOME':
        return <HomeView onSelectSection={(state) => setViewState(state)} />;
      case 'CHARACTER_SECTION':
        return <CharacterSection onBack={() => setViewState('HOME')} />;
      case 'POKEMON_SECTION':
        return (
          <PokemonSection 
            onSelectPokemon={(realm) => {
              setActiveRealm(realm);
              setViewState('POKEMON_DETAIL');
            }} 
            onBack={() => setViewState('HOME')} 
          />
        );
      case 'POKEMON_DETAIL':
        const views: Record<Realm, React.ReactNode> = {
          [Realm.ZEKROM]: <ZekromView onBack={handleBack} />,
          [Realm.PIKACHU]: <PikachuView onBack={handleBack} />,
          [Realm.CHARIZARD]: <CharizardView onBack={handleBack} />,
          [Realm.MEWTWO]: <MewtwoView onBack={handleBack} />,
          [Realm.SQUIRTLE]: <SquirtleView onBack={handleBack} />,
          [Realm.BULBASAUR]: <BulbasaurView onBack={handleBack} />,
          [Realm.WOBBUFFET]: <WobbuffetView onBack={handleBack} />,
          [Realm.GENGAR]: <GengarView onBack={handleBack} />,
          [Realm.MAGNETON]: <MagnetonView onBack={handleBack} />,
          [Realm.SNORLAX]: <SnorlaxView onBack={handleBack} />,
        };
        return (
          <>
            {views[activeRealm]}
            <CommandCenter activeRealm={activeRealm} />
          </>
        );
      default:
        return <HomeView onSelectSection={(state) => setViewState(state)} />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-black text-white font-rajdhani chromatic-aberration">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none opacity-5 static-overlay z-[99]" />
      
      <main className="flex-1 w-full h-full relative z-10 overflow-hidden">
        {renderContent()}
      </main>

      {/* Persistent Technical Markers */}
      <div className="fixed top-8 left-8 z-[100] pointer-events-none mix-blend-difference hidden sm:flex flex-col gap-1">
        <div className="text-[11px] font-orbitron font-black uppercase tracking-[1em] text-white/50">ARCHIVE_NODE_09</div>
        <div className="h-[1px] w-32 bg-white/20"></div>
      </div>
    </div>
  );
};

export default App;
