import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Star, AlertTriangle, Award, Loader2 } from 'lucide-react';
import { getProducts } from '../services/api';
import RatingVsSentimentScatter from '../components/RatingVsSentimentScatter';

export default function Statistics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const data = await getProducts();
        const list = Array.isArray(data) ? data : data?.results || [];
        setProducts(list);
      } catch (err) {
        console.error('Failed to load statistics catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Compute live catalog-wide KPI metrics
  const stats = useMemo(() => {
    if (!products.length) {
      return {
        totalProducts: 0,
        avgRating: '0.00',
        avgPris: '0.0000',
        avgNormalizedPris: '0.00',
        inflatedCount: 0,
        inflatedPct: 0,
      };
    }

    let totalRating = 0;
    let totalPris = 0;
    let validCount = 0;
    let inflated = 0;

    products.forEach((p) => {
      const star = parseFloat(p.star_rating);
      const pris = parseFloat(p.pris_score);
      if (!isNaN(star) && !isNaN(pris)) {
        totalRating += star;
        totalPris += pris;
        validCount += 1;

        // Normalized PRIS (1 - 5)
        const norm = 3 + 2 * pris;
        // Review inflation: stars significantly higher than sentiment
        if (norm - star < -0.4) {
          inflated += 1;
        }
      }
    });

    const avgR = validCount ? totalRating / validCount : 0;
    const avgP = validCount ? totalPris / validCount : 0;
    const avgNorm = 3 + 2 * avgP;

    return {
      totalProducts: validCount,
      avgRating: avgR.toFixed(2),
      avgPris: (avgP > 0 ? `+${avgP.toFixed(4)}` : avgP.toFixed(4)),
      avgNormalizedPris: avgNorm.toFixed(2),
      inflatedCount: inflated,
      inflatedPct: validCount ? Math.round((inflated / validCount) * 100) : 0,
    };
  }, [products]);

  const metricCards = [
    {
      label: 'Products Cataloged',
      val: stats.totalProducts.toLocaleString(),
      change: 'Ingested via automated pipeline',
      icon: Layers,
    },
    {
      label: 'Mean Catalog Star Rating',
      val: `${stats.avgRating} ★`,
      change: `Norm. PRIS parity: ${stats.avgNormalizedPris} / 5.0`,
      icon: Star,
    },
    {
      label: 'Average PRIS Compound',
      val: stats.avgPris,
      change: 'VADER polarity baseline (-1.0 to +1.0)',
      icon: Award,
    },
    {
      label: 'Star Rating Inflation',
      val: `${stats.inflatedCount} items`,
      change: `${stats.inflatedPct}% of catalog masks negative reviews`,
      icon: AlertTriangle,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Aggregating catalog analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8 text-left">
      {/* Page Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/80">
          Analytics
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Catalog Statistics & Sentiment Correlation
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Cross-examining customer star reviews with aspect-based sentiment signals.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="bg-white dark:bg-[#0c1019]/90 border border-zinc-200/90 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-2 hover:border-zinc-300 dark:hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                <span className="text-xs font-medium">{m.label}</span>
                <Icon size={16} />
              </div>
              <div className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 font-mono">
                {m.val}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                {m.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Primary Visualization: Scatter Plot */}
      <RatingVsSentimentScatter products={products} />
    </div>
  );
}