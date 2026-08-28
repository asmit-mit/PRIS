import React from 'react';
import { X, Quote, CheckCircle2, MinusCircle, AlertCircle } from 'lucide-react';

export default function TopicModal({ aspect, productName, onClose }) {
  if (!aspect) return null;

  const isPositive = aspect.vader_compound >= 0.05;
  const isNegative = aspect.vader_compound <= -0.05;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0e131f] border border-zinc-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 text-left">
        <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Aspect Inspection</span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">{aspect.topic_name}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Normalized Polarity Score</span>
            <span
              className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md border ${
                isPositive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : isNegative
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {aspect.vader_compound > 0 ? `+${aspect.vader_compound}` : aspect.vader_compound}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
              <div className="flex items-center justify-center gap-1 text-emerald-800 dark:text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 size={13} /> Positive
              </div>
              <p className="text-lg font-bold text-emerald-950 dark:text-emerald-200 mt-1">{aspect.positive_pct}%</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold">
                <MinusCircle size={13} /> Neutral
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-200 mt-1">{aspect.neutral_pct}%</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/30">
              <div className="flex items-center justify-center gap-1 text-rose-800 dark:text-rose-400 text-[11px] font-semibold">
                <AlertCircle size={13} /> Negative
              </div>
              <p className="text-lg font-bold text-rose-950 dark:text-rose-200 mt-1">{aspect.negative_pct}%</p>
            </div>
          </div>

          {aspect.sample_sentence && (
            <div className="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/5 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <Quote size={12} /> Representative Sentence
              </div>
              <p className="text-sm italic text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif">
                "{aspect.sample_sentence}"
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-sm font-semibold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}