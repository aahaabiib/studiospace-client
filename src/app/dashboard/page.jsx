'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';

const badge = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const actions = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
};

const actionLabel = { Confirmed: 'Confirm', Completed: 'Mark Completed', Cancelled: 'Decline' };

function DashboardContent() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [a, b, c] = await Promise.all([
        apiFetch('/api/studios/my/listings'),
        apiFetch('/api/bookings/my'),
        apiFetch('/api/bookings/host'),
      ]);
      setListings(a.data || []);
      setMyBookings(b.data || []);
      setRequests(c.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      const res = await apiFetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success(res.message || 'Booking updated');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not update booking');
    }
  };

  const stats = [
    { label: 'My Studios', value: listings.length },
    { label: 'My Bookings', value: myBookings.length },
    { label: 'Pending Requests', value: requests.filter((r) => r.status === 'Pending').length },
    { label: 'Confirmed Requests', value: requests.filter((r) => r.status === 'Confirmed').length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your studios and booking requests in one place.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
            <p className="text-sm text-gray-500">{s.label}</p>
            {loading ? (
              <div className="mt-2 h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            ) : (
              <p className="mt-1 text-3xl font-bold text-violet-600">{s.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/add-studio" className="rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white transition hover:bg-violet-700">
          Add New Studio
        </Link>
        <Link href="/my-listings" className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
          My Listings
        </Link>
        <Link href="/my-bookings" className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
          My Bookings
        </Link>
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold">Booking Requests for Your Studios</h2>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No one has booked your studios yet.</p>
          <Link href="/add-studio" className="mt-4 inline-block font-medium text-violet-600 hover:underline">
            List a studio to get started
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r._id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{r.studioTitle}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {r.userName} ({r.userEmail})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(r.startTime).toLocaleString()} to {new Date(r.endTime).toLocaleTimeString()} · {r.totalHours}h · ${r.totalPrice}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge[r.status]}`}>{r.status}</span>
                {(actions[r.status] || []).map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(r._id, s)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      s === 'Cancelled'
                        ? 'border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'bg-violet-600 text-white hover:bg-violet-700'
                    }`}
                  >
                    {actionLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}