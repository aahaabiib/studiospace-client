'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Aperture } from 'lucide-react';

const categories = ['Photo Studio', 'Film Stage', 'Podcast Lounge', 'Music Suite', 'Art Workshop'];

function XLogo({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function StrokeIcon({ className = 'w-4 h-4', children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const InstagramIcon = () => (
  <StrokeIcon>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </StrokeIcon>
);

const YoutubeIcon = () => (
  <StrokeIcon>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </StrokeIcon>
);

const FacebookIcon = () => (
  <StrokeIcon>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </StrokeIcon>
);

export default function Footer() {
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success('Thanks for subscribing to StudioSpace updates!');
    setEmail('');
  };

  const socials = [
    { label: 'X', icon: <XLogo /> },
    { label: 'Instagram', icon: <InstagramIcon /> },
    { label: 'YouTube', icon: <YoutubeIcon /> },
    { label: 'Facebook', icon: <FacebookIcon /> },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                <Aperture className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                StudioSpace
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Our mission is to put every creator in the right room. Find, book and shoot in verified photo, film,
              podcast and music spaces by the hour.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="p-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-violet-600">Home</Link></li>
              <li><Link href="/studios" className="hover:text-violet-600">Explore Studios</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-violet-600">How It Works</Link></li>
              <li><Link href="/#about" className="hover:text-violet-600">About Us</Link></li>
              <li><Link href="/add-studio" className="hover:text-violet-600">Host Your Space</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/studios?category=${encodeURIComponent(c)}`} className="hover:text-violet-600">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              New studios and creator tips in your inbox, once a month.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aahaabiib@gmail.com"
                className="min-w-0 flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {year} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}