'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState([]);

 useEffect(() => {
  if (loading) return;
  if (!user) {
    setIds([]);
    return;
  }
  apiFetch('/api/wishlist/ids')
    .then((res) => setIds(res.data || []))
    .catch(() => {});
}, [user?.email, loading]);

  const toggle = async (studioId) => {
    if (!user) {
      toast.error('Please log in to save studios');
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    try {
      const res = await apiFetch(`/api/wishlist/${studioId}`, { method: 'POST' });
      setIds((prev) => (res.data.saved ? [...prev, studioId] : prev.filter((i) => i !== studioId)));
      toast.success(res.data.saved ? 'Saved to wishlist' : 'Removed from wishlist');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return <WishlistContext.Provider value={{ ids, toggle }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);