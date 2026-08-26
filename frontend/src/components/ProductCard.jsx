import React from 'react';
import { Star, Sparkles, MessageSquare } from 'lucide-react';
import TopicPill from './TopicPill';

export default function ProductCard({ product, onSelectAspect }) {
  const isPrisPositive = product.pris_score >= 0.05;
  const isPrisNegative = product.pris_score <= -0.05;

  return (
    <div className="group relative w-full bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="space-y-1.5">
          <span className="inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200">
            {product.category}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-zinc-950 transition-colors">
            {product.name}
          </h2>
        </div>

        {/* Ratings Comparison */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 border border-slate-200/80 px-3 py-1.5 rounded-xl text-amber-900 shadow-2xs">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold">{product.star_rating}</span>
            <span className="text-[10px] text-amber-600 font-medium">/ 5.0</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-2xs ${
              isPrisPositive
                ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-700'
                : isPrisNegative
                ? 'bg-rose-50/50 border-rose-200/80 text-rose-900'
                : 'border-zinc-200 text-zinc-800'
            }`}
          >
            <span className="text-[11px] font-large opacity-70">PRIS score:</span>
            <span>{product.pris_score > 0 ? `+${product.pris_score}` : product.pris_score}</span>
          </div>
        </div>
      </div>

      {/* AI Thematic Summary */}
      <div className="my-5 p-4 rounded-xl bg-zinc-50/75 border border-zinc-200/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-1.5">
          <span>Synthesized Review Summary</span>
        </div>
        <p className="text-sm text-zinc-600 leading-relaxed">
          {product.ai_summary}
        </p>
      </div>

      {/* Topic Pillars Grid */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">
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