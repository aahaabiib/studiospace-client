import Link from 'next/link';
import { Aperture } from 'lucide-react';

export const metadata = { title: 'Page not found | StudioSpace' };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-600 text-white">
        <Aperture size={44} />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-violet-600">Error 404</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">This shot is out of frame</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
      >
        Return to Home
      </Link>
    </div>
  );
}