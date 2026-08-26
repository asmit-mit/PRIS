import React from 'react';
import { X, Quote, CheckCircle2, MinusCircle, AlertCircle } from 'lucide-react';

export default function TopicModal({ aspect, productName, onClose }) {
  if (!aspect) return null;

  const isPositive = aspect.vader_compound >= 0.05;
  const isNegative = aspect.vader_compound <= -0.05;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-zinc-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 text-left">
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Aspect Inspection</span>
            <h3 className="text-xl font-bold text-zinc-900 mt-0.5">{aspect.topic_name}</h3>
            <p className="text-xs text-zinc-500">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-600">Normalized Polarity Score</span>
            <span
              className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md border ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isNegative
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200'
              }`}
            >
              {aspect.vader_compound > 0 ? `+${aspect.vader_compound}` : aspect.vader_compound}
            </span>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center justify-center gap-1 text-emerald-800 text-[11px] font-semibold">
                <CheckCircle2 size={13} /> Positive
              </div>
              <p className="text-lg font-bold text-emerald-950 mt-1">{aspect.positive_pct}%</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <div className="flex items-center justify-center gap-1 text-zinc-600 text-[11px] font-semibold">
                <MinusCircle size={13} /> Neutral
              </div>
              <p className="text-lg font-bold text-zinc-900 mt-1">{aspect.neutral_pct}%</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100">
              <div className="flex items-center justify-center gap-1 text-rose-800 text-[11px] font-semibold">
                <AlertCircle size={13} /> Negative
              </div>
              <p className="text-lg font-bold text-rose-950 mt-1">{aspect.negative_pct}%</p>
            </div>
          </div>

          {aspect.sample_sentence && (
            <div className="p-4 bg-zinc-50/80 border border-zinc-200/80 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <Quote size={12} /> Representative Sentence
              </div>
              <p className="text-sm italic text-zinc-700 leading-relaxed font-serif">
                "{aspect.sample_sentence}"
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}