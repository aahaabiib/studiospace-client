'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import HeroSlider from '@/components/HeroSlider';
import HostGuarantee from '@/components/HostGuarantee';
import { Camera, Mic, Music, Clapperboard, Palette, MapPin, Star } from 'lucide-react';

const categories = [
  { name: 'Photo Studio', icon: Camera, color: 'from-pink-500 to-rose-500' },
  { name: 'Film Stage', icon: Clapperboard, color: 'from-violet-500 to-purple-500' },
  { name: 'Podcast Lounge', icon: Mic, color: 'from-blue-500 to-cyan-500' },
  { name: 'Music Suite', icon: Music, color: 'from-emerald-500 to-teal-500' },
  { name: 'Art Workshop', icon: Palette, color: 'from-amber-500 to-orange-500' },
];

const steps = [
  { step: 1, title: 'Discover Spaces', desc: 'Browse professional studios filtered by type, location and price.' },
  { step: 2, title: 'Select Shoot Hours', desc: 'Pick the exact date and hours that fit your production schedule.' },
  { step: 3, title: 'Book Instantly', desc: 'Secure your slot with transparent hourly pricing and no hidden fees.' },
  { step: 4, title: 'Create & Produce', desc: 'Show up, create something great and leave a review for the next creator.' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/studios/featured')
      .then((data) => setFeatured(data.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Browse by Studio Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/studios?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} text-white`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-center group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Studios */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold">Featured Studios</h2>
            <Link href="/studios" className="text-violet-600 hover:underline font-medium">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-4">No studios listed yet.</p>
              <Link href="/add-studio" className="text-violet-600 font-medium hover:underline">
                Be the first to host a space →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((studio) => (
                <div
                  key={studio._id}
                  className="group flex h-full flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={studio.imageURL}
                      alt={studio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white">
                      {studio.category}
                    </span>
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-900">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {Number(studio.rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{studio.title}</h3>
                    <p className="flex items-center gap-1 text-sm text-gray-500 mb-3 line-clamp-1">
                      <MapPin className="h-4 w-4 shrink-0" /> {studio.location}
                    </p>
                    <p className="font-bold text-violet-600 mb-4">${studio.hourlyRate} / hr</p>
                    <Link
                      href={`/studios/${studio._id}`}
                      className="mt-auto rounded-xl bg-violet-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-violet-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">How Booking Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-violet-600 text-white flex items-center justify-center text-xl font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Host Guarantee */}
      <HostGuarantee />
    </div>
  );
}