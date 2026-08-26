import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center px-4 py-10 sm:px-6 bg-[#fcfcfd]">
      <div className="max-w-4xl w-full text-center space-y-6 my-auto">
        <div className="flex flex-col items-center justify-center gap-3">
          <img
            src="/logo.png"
            alt="PRIS Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-xs"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-950 tracking-tight leading-[1.1]">
            Granular insights beyond aggregate star ratings.
          </h1>
          <p className="text-zinc-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Extract coherent feature topics with BERTopic and score sentiment polarity via VADER to uncover actionable consumer opinions across e-commerce reviews[cite: 1].
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
          <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
              <Layers size={16} />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">Automated Aspects</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Unsupervised clustering isolates recurring feature topics without manual labeling[cite: 1].
            </p>
          </div>

          <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
              <Cpu size={16} />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">VADER Polarity</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Lexicon heuristics quantify positive, neutral, and negative sentiment per product dimension[cite: 1].
            </p>
          </div>

          <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
              <ShieldCheck size={16} />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">Discrepancy Surfacing</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Pinpoints hardware or usability defects masked by deceptive aggregate star scores[cite: 1].
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 transform active:scale-98"
          >
            <span>Explore Products</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}