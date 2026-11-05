'use client';
import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function AuthSuccessInner() {
  const router = useRouter();
  const params = useSearchParams();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; 
    ran.current = true;

    const raw = params.get('redirect') || '/';
    const target = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';

    (async () => {
      try {
        const res = await fetch('/api/token', { cache: 'no-store' });
        if (!res.ok) throw new Error('token failed');
        toast.success('Logged in with Google', { id: 'google-login' });
        router.replace(target);
      } catch {
        toast.error('Google login succeeded but the API token could not be created. Please try again.', {
          id: 'google-login-error',
        });
        router.replace('/login');
      }
    })();
  }, [params, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      <p className="text-slate-600 dark:text-slate-400">Signing you in…</p>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      }
    >
      <AuthSuccessInner />
    </Suspense>
  );
}