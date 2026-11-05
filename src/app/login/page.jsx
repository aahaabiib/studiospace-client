'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Aperture, Eye, EyeOff } from 'lucide-react';
import GoogleButton from '@/components/google-button';
import Modal from '@/components/Modal';
import { inputCls, btnPrimary, btnOutline } from '@/lib/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // আগে থেকেই login থাকলে ফেরত পাঠাবে
  useEffect(() => {
    if (!authLoading && user) {
      const r = new URLSearchParams(window.location.search).get('redirect') || '/';
      router.replace(r.startsWith('/') && !r.startsWith('//') ? r : '/');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
      router.push(redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    toast.success('If an account exists for that email, a reset link has been sent.');
    setForgotOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white mb-4">
            <Aperture className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Login to your StudioSpace account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotOpen(true);
              }}
              className="text-sm text-violet-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold rounded-xl transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" /> OR{' '}
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <GoogleButton />

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-violet-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>

        <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Reset your password">
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your account email and we will send you a reset link.
            </p>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls}
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setForgotOpen(false)} className={btnOutline}>
                Cancel
              </button>
              <button type="submit" className={btnPrimary}>
                Send link
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}