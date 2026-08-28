import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center px-4 py-10 sm:px-6 bg-[#fcfcfd] dark:bg-[#07090e] overflow-hidden transition-colors">
      
      {/* --- Velora UI Ambient Background Layer (Grid + Vibrant Spotlight) --- */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Subtle Geometric Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,#000_60%,transparent_100%)] opacity-60 dark:opacity-40" />
        
        {/* Primary Radiant Blue Spotlight */}
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-b from-indigo-500/25 via-sky-500/20 to-transparent dark:from-indigo-600/40 dark:via-sky-500/30 dark:to-transparent blur-[80px] rounded-full" />
      </div>

      {/* --- Foreground Content (Layered above glow with relative z-10) --- */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-6 my-auto">
        <div className="flex flex-col items-center justify-center -space-y-2 sm:-space-y-4">
          <img
            src="/just_logo.png"
            alt="PRIS Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
          />
          <span className="text-2xl sm:text-3xl font-black tracking-[0.05em] leading-none text-[#0f223d] dark:text-white select-none transition-all duration-200 drop-shadow-xs">
            PRIS
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-[1.1]">
            Granular insights beyond aggregate star ratings.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Extract coherent feature topics with BERTopic and score sentiment polarity via VADER to uncover actionable consumer opinions across e-commerce reviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
          <div className="p-5 bg-white/90 dark:bg-[#0c1019]/90 backdrop-blur-xs border border-zinc-200/90 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center border border-zinc-200 dark:border-zinc-700/80">
              <Layers size={16} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Automated Aspects</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Unsupervised clustering isolates recurring feature topics without manual labeling.
            </p>
          </div>

          <div className="p-5 bg-white/90 dark:bg-[#0c1019]/90 backdrop-blur-xs border border-zinc-200/90 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center border border-zinc-200 dark:border-zinc-700/80">
              <Cpu size={16} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">VADER Polarity</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Lexicon heuristics quantify positive, neutral, and negative sentiment per product dimension.
            </p>
          </div>

          <div className="p-5 bg-white/90 dark:bg-[#0c1019]/90 backdrop-blur-xs border border-zinc-200/90 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 flex items-center justify-center border border-zinc-200 dark:border-zinc-700/80">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Discrepancy Surfacing</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Pinpoints hardware or usability defects masked by deceptive aggregate star scores.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 transform active:scale-98"
          >
            <span>Explore Products</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}