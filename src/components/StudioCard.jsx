import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import WishlistButton from './WishlistButton';

export default function StudioCard({ studio }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
        <img
          src={studio.imageURL}
          alt={studio.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
          {studio.category}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {Number(studio.rating || 0).toFixed(1)}
        </span>
        <WishlistButton studioId={studio._id} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">{studio.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
            ${studio.hourlyRate} <span className="text-sm font-medium text-slate-500">/ hr</span>
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}