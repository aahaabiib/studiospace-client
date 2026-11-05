'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CalendarX, MapPin, Clock, FileDown } from 'lucide-react';
import PrivateRoute from '@/components/PrivateRoute';
import ConfirmModal from '@/components/ConfirmModal';
import { apiFetch } from '@/lib/api';
import { btnPrimary, btnOutline } from '@/lib/ui';
import { downloadInvoice } from '@/lib/invoice';

const badgeCls = {
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  Confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Completed: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    apiFetch('/api/bookings/my')
      .then((res) => setBookings(res.data || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await apiFetch(`/api/bookings/${toCancel._id}/cancel`, { method: 'PATCH' });
      setBookings((list) => list.map((b) => (b._id === toCancel._id ? { ...b, status: 'Cancelled' } : b)));
      toast.success('Booking cancelled');
      setToCancel(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Bookings</h1>
      <p className="mb-8 mt-2 text-slate-600 dark:text-slate-400">Track your studio sessions and their status.</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <CalendarX size={44} className="text-slate-400" />
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No bookings yet</h3>
          <p className="mt-1 max-w-md text-slate-600 dark:text-slate-400">
            Find a studio that fits your next shoot, recording or workshop and book your first session.
          </p>
          <Link href="/studios" className={`${btnPrimary} mt-6`}>
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row"
            >
              <img src={b.studioImage} alt={b.studioTitle} className="h-40 w-full rounded-xl object-cover sm:h-32 sm:w-44" />

              <div className="flex flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Link
                    href={`/studios/${b.studioId}`}
                    className="text-lg font-bold text-slate-900 hover:text-violet-600 dark:text-white"
                  >
                    {b.studioTitle}
                  </Link>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeCls[b.status] || ''}`}>
                    {b.status}
                  </span>
                </div>

                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={14} /> {b.studioLocation}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                  <Clock size={14} /> {fmtDate(b.startTime)}, {fmtTime(b.startTime)} – {fmtTime(b.endTime)}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    ${Number(b.totalPrice).toFixed(2)}
                    <span className="ml-1 text-sm font-medium text-slate-500">
                      ({Number(b.totalHours).toFixed(1)} hr)
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {(b.status === 'Confirmed' || b.status === 'Completed') && (
                      <button onClick={() => downloadInvoice(b)} className={btnOutline}>
                        <FileDown size={16} /> Invoice
                      </button>
                    )}
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => setToCancel(b)}
                        className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this booking?"
        message={`Your request for “${toCancel?.studioTitle || ''}” will be cancelled. You can book again later if the slot is free.`}
        confirmLabel="Yes, cancel"
      />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookings />
    </PrivateRoute>
  );
}