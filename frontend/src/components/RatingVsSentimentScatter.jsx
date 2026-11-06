import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Filter } from 'lucide-react';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const isInflated = data.delta < -0.4;
  const isUnderrated = data.delta > 0.4;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-xl shadow-xl max-w-xs text-left text-xs space-y-2 pointer-events-none">
      <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2">
        {data.name}
      </div>
      <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
        {data.category}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-zinc-400 block">Amazon Stars</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
            ⭐ {data.starRating.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-zinc-400 block">PRIS (1–5)</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
            🎯 {data.normalizedPris.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-400">Raw Polarity:</span>
        <span className="font-mono text-zinc-600 dark:text-zinc-300">
          {data.rawPris > 0 ? `+${data.rawPris.toFixed(4)}` : data.rawPris.toFixed(4)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-zinc-400">Divergence (Δ):</span>
        <span
          className={`font-semibold font-mono ${
            isInflated
              ? 'text-rose-500 dark:text-rose-400'
              : isUnderrated
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          {data.delta > 0 ? `+${data.delta.toFixed(2)}` : data.delta.toFixed(2)}
        </span>
      </div>

      {isInflated && (
        <span className="inline-block mt-1 text-[10px] font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60">
          ⚠️ Rating Inflation Detected
        </span>
      )}
      {isUnderrated && (
        <span className="inline-block mt-1 text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/60">
          💎 Underrated Sentiment
        </span>
      )}
    </div>
  );
}

export default function RatingVsSentimentScatter({ products = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive unique categories from ingested products
  const categories = useMemo(() => {
    const rawCategories = products
      .map((p) => p.category)
      .filter((cat) => Boolean(cat) && cat.trim() !== '');
    return ['All', ...Array.from(new Set(rawCategories)).sort()];
  }, [products]);

  // Filter products by selected category and normalize scores
  const chartData = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;
        const hasValidScores = p.star_rating != null && p.pris_score != null;
        return matchesCategory && hasValidScores;
      })
      .map((p) => {
        const starRating = parseFloat(p.star_rating);
        const rawPris = parseFloat(p.pris_score);
        const normalizedPris = Number((3 + 2 * rawPris).toFixed(2));
        const delta = Number((normalizedPris - starRating).toFixed(2));

        return {
          id: p.id,
          name: p.name,
          category: p.category,
          starRating,
          rawPris,
          normalizedPris,
          delta,
        };
      });
  }, [products, selectedCategory]);

  const getPointColor = (delta) => {
    if (delta < -0.4) return '#f43f5e'; // Rose: Inflation
    if (delta > 0.4) return '#10b981';  // Emerald: Underrated
    return '#6366f1';                   // Indigo: Parity
  };

  return (
    <div className="w-full bg-white dark:bg-[#0c1019]/90 border border-zinc-200/90 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header with Title and Category Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Star Rating vs. PRIS Sentiment Parity
            </h2>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md">
              {chartData.length} {chartData.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Cross-examining Amazon star ratings against normalized compound sentiment (1.0 to 5.0).
          </p>
        </div>

        {/* Filter & Legend Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-lg px-2.5 py-1">
            <Filter size={13} className="text-zinc-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
                  {cat === 'All' ? 'All Categories' : cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[11px] text-zinc-600 dark:text-zinc-400 pl-1 border-l border-zinc-200 dark:border-zinc-800">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Inflated
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Underrated
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Parity
            </span>
          </div>
        </div>
      </div>

      {/* 1:1 Aspect-Ratio Chart Container */}
      <div className="w-full h-[420px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 25, bottom: 35, left: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#71717a" opacity={0.2} />

            <XAxis
              type="number"
              dataKey="starRating"
              name="Star Rating"
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              unit=" ★"
              stroke="#a1a1aa"
              fontSize={12}
              label={{
                value: 'Amazon Star Rating (1.0 - 5.0)',
                position: 'insideBottom',
                offset: -15,
                fill: '#a1a1aa',
                fontSize: 12,
              }}
            />

            <YAxis
              type="number"
              dataKey="normalizedPris"
              name="Normalized PRIS"
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#a1a1aa"
              fontSize={12}
              label={{
                value: 'Normalized PRIS Sentiment (1.0 - 5.0)',
                angle: -90,
                position: 'insideLeft',
                offset: 0,
                fill: '#a1a1aa',
                fontSize: 12,
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              segment={[
                { x: 1, y: 1 },
                { x: 5, y: 5 },
              ]}
              stroke="#71717a"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Parity (y = x)',
                position: 'insideTopRight',
                fill: '#71717a',
                fontSize: 11,
              }}
            />

            <Scatter data={chartData} fill="#6366f1">
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={getPointColor(entry.delta)}
                  fillOpacity={0.8}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Callout */}
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
        💡 <strong>Viewing Category:</strong> Showing{' '}
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          {selectedCategory === 'All' ? 'all categories' : selectedCategory.replace(/_/g, ' ')}
        </span>
        . Points located below the parity diagonal line ($y = x$) represent products where customer written sentiment scores lower than the numerical star rating.
      </div>
    </div>
  );
}