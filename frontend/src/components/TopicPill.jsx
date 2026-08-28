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
          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
          : isNegative
          ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/50 text-rose-900 dark:text-rose-300 hover:bg-rose-100/60 dark:hover:bg-rose-900/40'
          : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{aspect.topic_name}</span>
      <div className="flex items-center gap-1 font-mono text-[11px] font-semibold opacity-80">
        {isPositive && <TrendingUp size={12} className="text-emerald-600 dark:text-emerald-400" />}
        {isNegative && <TrendingDown size={12} className="text-rose-600 dark:text-rose-400" />}
        {!isPositive && !isNegative && <Minus size={12} className="text-zinc-500 dark:text-zinc-400" />}
        <span>{aspect.vader_compound > 0 ? `+${aspect.vader_compound.toFixed(2)}` : aspect.vader_compound.toFixed(2)}</span>
      </div>
    </button>
  );
}