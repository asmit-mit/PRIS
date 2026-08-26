import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TopicPill({ aspect, onClick }) {
  const isPositive = aspect.vader_compound >= 0.05;
  const isNegative = aspect.vader_compound <= -0.05;

  return (
    <button
      onClick={() => onClick(aspect)}
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 active:scale-98 ${
        isPositive
          ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/60 hover:border-emerald-300'
          : isNegative
          ? 'bg-rose-50/50 border-rose-200/80 text-rose-900 hover:bg-rose-100/60 hover:border-rose-300'
          : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
      }`}
    >
      <span className="font-medium text-zinc-900">{aspect.topic_name}</span>
      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold opacity-80">
        {isPositive && <TrendingUp size={12} className="text-emerald-600" />}
        {isNegative && <TrendingDown size={12} className="text-rose-600" />}
        {!isPositive && !isNegative && <Minus size={12} className="text-zinc-500" />}
        <span>{aspect.vader_compound > 0 ? `+${aspect.vader_compound.toFixed(2)}` : aspect.vader_compound.toFixed(2)}</span>
      </div>
    </button>
  );
}