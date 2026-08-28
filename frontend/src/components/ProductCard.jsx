import React from 'react';
import { Star, Sparkles, MessageSquare } from 'lucide-react';
import TopicPill from './TopicPill';

export default function ProductCard({ product, onSelectAspect }) {
  const isPrisPositive = product.pris_score >= 0.05;
  const isPrisNegative = product.pris_score <= -0.05;

  return (
    <div className="group relative w-full bg-white dark:bg-[#0c1019]/90 border border-zinc-200/90 dark:border-white/10 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-white/20 transition-all duration-200 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-5">
        <div className="space-y-1.5">
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/80">
            {product.category}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors">
            {product.name}
          </h2>
        </div>

        {/* Ratings Comparison */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-white-50/70 dark:bg-slate-950/30 border border-amber-200/80 dark:border-amber-800/50 px-3 py-1.5 rounded-xl text-amber-900 dark:text-amber-300 shadow-2xs">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{product.star_rating}</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">/ 5.0</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${
              isPrisPositive
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-300'
                : isPrisNegative
                ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/50 text-rose-900 dark:text-rose-300'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300'
            }`}
          >
            <span className="text-[11px] font-medium opacity-70">PRIS:</span>
            <span>{product.pris_score > 0 ? `+${product.pris_score}` : product.pris_score}</span>
          </div>
        </div>
      </div>

      {/* AI Thematic Summary */}
      <div className="my-5 p-4 rounded-xl bg-zinc-50/75 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-white/5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-200 mb-1.5">
          <span>Synthesized Review Summary</span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {product.ai_summary}
        </p>
      </div>

      {/* Topic Pillars Grid */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-3">
          <MessageSquare size={13} />
          <span>Extracted Topic Dimensions (Click to Inspect Evidence)</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {product.aspects?.map((aspect) => (
            <TopicPill
              key={aspect.id}
              aspect={aspect}
              onClick={(asp) => onSelectAspect(asp, product.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}