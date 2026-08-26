import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import TopicModal from '../components/TopicModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minRating, setMinRating] = useState('');
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState('');

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ search, category, minRating });
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCatalog();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, category, minRating]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Title Header */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Product Analysis Feed</h1>
        <p className="text-sm text-zinc-500">
          Inspect automatically extracted thematic dimensions and granular VADER polarity scores across Amazon products.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-zinc-200/90 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by product name, features, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50/70 border border-zinc-200/80 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-zinc-50/70 border border-zinc-200/80 px-3 py-1.5 rounded-xl">
            <Filter size={14} className="text-zinc-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Computers">Computers</option>
              <option value="Electronics">Electronics</option>
              <option value="Wearables">Wearables</option>
            </select>
          </div>

          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="bg-zinc-50/70 border border-zinc-200/80 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="">Any Star Rating</option>
            <option value="3.5">≥ 3.5 Stars</option>
            <option value="4.0">≥ 4.0 Stars</option>
            <option value="4.5">≥ 4.5 Stars</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-zinc-400">
          <Loader2 size={24} className="animate-spin mb-2 text-zinc-600" />
          <span className="text-xs font-medium">Querying PRIS database...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white border border-zinc-200 rounded-2xl">
          <p className="text-zinc-500 text-sm font-medium">No product records match the selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectAspect={(asp, pName) => {
                setSelectedAspect(asp);
                setSelectedProductName(pName);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedAspect && (
        <TopicModal
          aspect={selectedAspect}
          productName={selectedProductName}
          onClose={() => setSelectedAspect(null)}
        />
      )}
    </div>
  );
}