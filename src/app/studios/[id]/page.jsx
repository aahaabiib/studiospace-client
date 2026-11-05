'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MapPin, Star, Users, ShieldCheck, Check, CalendarDays, FrownIcon } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BookingModal from '@/components/BookingModal';
import { DetailsSkeleton } from '@/components/Skeletons';
import { btnPrimary } from '@/lib/ui';

function Stars({ value }) {
  const full = Math.round(value || 0);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={18} className={n <= full ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'} />
      ))}
    </div>
  );
}

export default function StudioDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/api/studios/${id}`);
        if (!cancelled) setStudio(res.data);
      } catch {
        if (!cancelled) setStudio(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <DetailsSkeleton />;

  if (!studio) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <FrownIcon size={48} className="text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Studio not found</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link href="/studios" className={`${btnPrimary} mt-6`}>
          Browse all studios
        </Link>
      </div>
    );
  }

  const images = [studio.imageURL, ...(studio.gallery || [])].filter(Boolean);
  const isOwner = user?.email && user.email === studio.ownerEmail;
  const rating = Number(studio.rating || 0);

  const handleBook = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    setOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left */}
        <div className="min-w-0 space-y-8 lg:col-span-2">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={images.length > 1}
            className="aspect-[16/9] w-full overflow-hidden rounded-2xl"
            style={{
              '--swiper-navigation-color': '#ffffff',
              '--swiper-pagination-color': '#ffffff',
            }}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <img src={src} alt={`${studio.title} photo ${i + 1}`} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                {studio.category}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Star size={16} className="fill-amber-400 text-amber-400" /> {rating.toFixed(1)}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{studio.title}</h1>
            <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin size={18} /> {studio.location}
            </p>
          </div>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Overview</h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">{studio.overview}</p>
          </section>

          {studio.amenities?.length > 0 && (
            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Amenities</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Check size={18} className="text-emerald-500" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Hosted by</h2>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
                {(studio.ownerName || 'H').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{studio.ownerName || 'Studio Host'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Verified StudioSpace host</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">Reviews</h2>
            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-slate-900 dark:text-white">{rating.toFixed(1)}</p>
                <div>
                  <Stars value={rating} />
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Average studio rating</p>
                </div>
              </div>
              <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                No written reviews yet. Book a session and be the first to share your experience.
              </p>
            </div>
          </section>
        </div>

        {/* Right: booking card */}
        <aside className="self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
            ${studio.hourlyRate} <span className="text-base font-medium text-slate-500">/ hour</span>
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <Users size={18} className="text-slate-400" /> Up to {studio.maxCapacity || 1} people
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-slate-400" /> Security deposit: ${studio.securityDeposit || 0}
            </li>
            <li className="flex items-center gap-2">
              <CalendarDays size={18} className="text-slate-400" /> Host confirms your request
            </li>
          </ul>

          {isOwner ? (
            <div className="mt-6 space-y-3">
              <p className="rounded-lg bg-slate-100 p-3 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                This is your own listing.
              </p>
              <Link href={`/studios/edit/${studio._id}`} className={`${btnPrimary} w-full`}>
                Edit Studio
              </Link>
            </div>
          ) : (
            <button onClick={handleBook} className={`${btnPrimary} mt-6 w-full py-3`}>
              Book Workspace Now
            </button>
          )}
        </aside>
      </div>

      <BookingModal open={open} onClose={() => setOpen(false)} studio={studio} />
    </div>
  );
}