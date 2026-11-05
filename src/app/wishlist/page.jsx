'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import PrivateRoute from '@/components/PrivateRoute';
import StudioCard from '@/components/StudioCard';
import { GridSkeleton } from '@/components/Skeletons';
import { useWishlist } from '@/context/WishlistContext';
import { apiFetch } from '@/lib/api';
import { btnPrimary } from '@/lib/ui';

function Wishlist() {
  const { ids } = useWishlist();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/wishlist')
      .then((res) => setStudios(res.data || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = studios.filter((s) => ids.includes(String(s._id)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Wishlist</h1>
      <p className="mb-8 mt-2 text-slate-600 dark:text-slate-400">Studios you saved for later.</p>

      {loading ? (
        <GridSkeleton count={3} />
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <Heart size={44} className="text-slate-400" />
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
          <p className="mt-1 max-w-md text-slate-600 dark:text-slate-400">
            Tap the heart on any studio to save it here.
          </p>
          <Link href="/studios" className={`${btnPrimary} mt-6`}>
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <StudioCard key={s._id} studio={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <PrivateRoute>
      <Wishlist />
    </PrivateRoute>
  );
}