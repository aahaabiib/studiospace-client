'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SearchX } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { categories, inputCls, btnPrimary } from '@/lib/ui';
import StudioCard from '@/components/StudioCard';
import { GridSkeleton } from '@/components/Skeletons';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';

  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [sort, setSort] = useState('newest');
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (debounced) params.set('search', debounced);
    params.set('sort', sort);

    apiFetch(`/api/studios?${params.toString()}`)
      .then((res) => !cancelled && setStudios(res.data || []))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [category, debounced, sort]);

  const setCategory = (c) => {
    router.replace(c ? `/studios?category=${encodeURIComponent(c)}` : '/studios', { scroll: false });
  };

  const clearAll = () => {
    setSearch('');
    setDebounced('');
    setSort('newest');
    setCategory('');
  };

  const chip = (active) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      active
        ? 'border-violet-600 bg-violet-600 text-white'
        : 'border-slate-300 text-slate-700 hover:border-violet-500 dark:border-slate-700 dark:text-slate-300'
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Explore Studios</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Search verified creative spaces and filter by category, price or rating.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by studio name or location"
            className={`${inputCls} pl-10`}
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputCls} md:w-56`}>
          <option value="newest">Newest first</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button className={chip(!category)} onClick={() => setCategory('')}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <GridSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : studios.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <SearchX size={44} className="text-slate-400" />
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No studios found</h3>
          <p className="mt-1 max-w-md text-slate-600 dark:text-slate-400">
            Nothing matches your filters right now. Try a different keyword or clear the filters.
          </p>
          <button onClick={clearAll} className={`${btnPrimary} mt-6`}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Showing {studios.length} {studios.length === 1 ? 'studio' : 'studios'}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ExploreStudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <GridSkeleton />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}