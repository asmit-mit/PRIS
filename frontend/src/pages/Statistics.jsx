import React from 'react';
import { BarChart3, TrendingUp, Layers, PieChart } from 'lucide-react';

export default function Statistics() {
  const metricCards = [
    { label: 'Total Reviews Processed', val: '24,580', change: '+12% from raw SNAP batch', icon: Layers },
    { label: 'Mean Topic Coherence (Cv)', val: '0.642', change: 'BERTopic vs LDA (0.481)', icon: TrendingUp },
    { label: 'Aspect Sentiment Coverage', val: '91.4%', change: 'VADER confidence threshold >= 0.05', icon: PieChart },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8 text-left">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200">
          Analytics
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">System Statistics & Metrics</h1>
        <p className="text-sm text-zinc-500">
          Model performance, aspect coherence scores, and polarity distribution metrics across parsed product corpora[cite: 1].
        </p>
      </div>

      {/* Top KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="text-xs font-medium">{m.label}</span>
                <Icon size={16} />
              </div>
              <div className="text-2xl font-bold text-zinc-950 font-mono">{m.val}</div>
              <p className="text-[11px] text-zinc-500 font-medium">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Visual Workspace Canvas */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-8 shadow-xs text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto border border-zinc-200">
          <BarChart3 size={20} />
        </div>
        <h2 className="text-base font-bold text-zinc-900">ABSA Analytics Visualizations</h2>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Temporal sentiment trend lines, inter-topic distance maps (pyLDAvis/c-TF-IDF), and compound distribution charts will be populated as the ML pipeline exports final batches[cite: 1].
        </p>
      </div>
    </div>
  );
}