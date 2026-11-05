'use client';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistButton({ studioId }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(String(studioId));

  return (
    <button
      type="button"
      onClick={() => toggle(String(studioId))}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 shadow transition hover:scale-110 dark:bg-slate-900/90"
    >
      <Heart size={18} className={saved ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'} />
    </button>
  );
}