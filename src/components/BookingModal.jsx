'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Modal from './Modal';
import { apiFetch } from '@/lib/api';
import { inputCls, btnPrimary, btnOutline } from '@/lib/ui';

const todayStr = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const fmt = (d) => new Date(d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function BookingModal({ open, onClose, studio }) {
  const router = useRouter();
  const [date, setDate] = useState(todayStr());
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('12:00');
  const [slots, setSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // এই তারিখের Confirmed slot গুলো আনা
  useEffect(() => {
    if (!open || !date) return;
    let cancelled = false;
    const from = new Date(`${date}T00:00`).toISOString();
    const to = new Date(`${date}T23:59:59`).toISOString();

    apiFetch(`/api/bookings/slots/${studio._id}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then((res) => !cancelled && setSlots(res.data || []))
      .catch(() => !cancelled && setSlots([]));

    return () => {
      cancelled = true;
    };
  }, [open, date, studio._id]);

  const startDate = useMemo(() => (date && start ? new Date(`${date}T${start}`) : null), [date, start]);
  const endDate = useMemo(() => (date && end ? new Date(`${date}T${end}`) : null), [date, end]);

  const validRange = !!(startDate && endDate && endDate > startDate);
  const hours = validRange ? (endDate - startDate) / 36e5 : 0;
  const total = Math.round(hours * studio.hourlyRate * 100) / 100;
  const conflict =
    validRange && slots.some((s) => new Date(s.startTime) < endDate && new Date(s.endTime) > startDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validRange) return toast.error('End time must be after start time');
    if (startDate <= new Date()) return toast.error('Please choose a future start time');
    if (conflict) return toast.error('This time overlaps with a confirmed booking');

    setSubmitting(true);
    try {
      await apiFetch('/api/bookings', {
        method: 'POST',
        body: {
          studioId: studio._id,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });
      toast.success('Booking request sent! The host will confirm it shortly.');
      onClose();
      router.push('/my-bookings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book ${studio.title}`} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
          <input
            type="date"
            min={todayStr()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Start time</label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">End time</label>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={inputCls} required />
          </div>
        </div>

        {slots.length > 0 && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <p className="font-semibold">Already booked on this day:</p>
            <ul className="mt-1 list-inside list-disc">
              {slots.map((s, i) => (
                <li key={i}>
                  {fmt(s.startTime)} – {fmt(s.endTime)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {conflict && (
          <p className="text-sm font-medium text-red-600">
            Your selected time overlaps with a confirmed booking. Please pick another slot.
          </p>
        )}

        <div className="rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-800">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              ${studio.hourlyRate} × {hours > 0 ? hours.toFixed(1) : 0} hr
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">${total}</span>
          </div>
          {studio.securityDeposit > 0 && (
            <div className="mt-1 flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Security deposit (refundable)</span>
              <span className="font-semibold text-slate-900 dark:text-white">${studio.securityDeposit}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnOutline} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary} disabled={submitting || conflict || !validRange}>
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Confirm Request
          </button>
        </div>
      </form>
    </Modal>
  );
}