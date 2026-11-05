'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=80',
    title: 'Book Professional Studios. Create Without Limits.',
    text: 'Photography cyc walls, cinema sound stages and lighting-ready spaces, available by the hour.',
  },
  {
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1800&q=80',
    title: 'Record Your Next Track in a Real Music Suite.',
    text: 'Treated rooms, quality monitors and gear you can rely on, from verified local hosts.',
  },
  {
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1800&q=80',
    title: 'Launch Your Podcast From a Studio That Sounds Great.',
    text: 'Cozy podcast lounges with pro microphones and mixers. Walk in, plug in, press record.',
  },
];

export default function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[70vh] min-h-[480px] w-full"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full w-full">
              <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10">
                <div className="max-w-2xl text-white">
                  <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{s.title}</h1>
                  <p className="mt-4 text-base text-gray-200 sm:text-lg">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/studios"
                      className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
                    >
                      Explore Studios
                    </Link>
                    <Link
                      href="/add-studio"
                      className="rounded-xl border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-gray-900"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}