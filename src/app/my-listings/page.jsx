'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2, Plus, Building2 } from 'lucide-react';
import PrivateRoute from '@/components/PrivateRoute';
import ConfirmModal from '@/components/ConfirmModal';
import { apiFetch } from '@/lib/api';
import { btnPrimary } from '@/lib/ui';

function MyListings() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiFetch('/api/studios/my/listings')
      .then((res) => setStudios(res.data || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/api/studios/${toDelete._id}`, { method: 'DELETE' });
      setStudios((list) => list.filter((s) => s._id !== toDelete._id));
      toast.success('Studio deleted');
      setToDelete(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const iconBtn =
    'rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Studio Listings</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Manage the spaces you host on StudioSpace.</p>
        </div>
        <Link href="/add-studio" className={btnPrimary}>
          <Plus size={16} /> Add New Studio
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <Building2 size={44} className="text-slate-400" />
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">You haven&apos;t listed a studio yet</h3>
          <p className="mt-1 max-w-md text-slate-600 dark:text-slate-400">
            Turn your spare room, stage or workshop into income. It takes only a few minutes.
          </p>
          <Link href="/add-studio" className={`${btnPrimary} mt-6`}>
            List your first studio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Studio</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {studios.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.imageURL} alt={s.title} className="h-12 w-16 rounded-lg object-cover" />
                      <span className="font-semibold text-slate-900 dark:text-white">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.category}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.location}</td>
                  <td className="px-4 py-3 font-semibold text-violet-600 dark:text-violet-400">${s.hourlyRate}/hr</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/studios/${s._id}`} className={iconBtn} aria-label="View">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/studios/edit/${s._id}`} className={iconBtn} aria-label="Edit">
                        <Pencil size={18} />
                      </Link>
                      <button onClick={() => setToDelete(s)} className={`${iconBtn} hover:!text-red-600`} aria-label="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this studio?"
        message={`“${toDelete?.title || ''}” will be permanently removed from StudioSpace. This action cannot be undone.`}
        confirmLabel="Yes, delete"
      />
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListings />
    </PrivateRoute>
  );
}