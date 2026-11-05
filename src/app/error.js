'use client';

export default function GlobalError({ error, reset }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        We hit an unexpected problem. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
      >
        Try again
      </button>
    </div>
  );
}