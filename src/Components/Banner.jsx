'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Star, Flame } from '@gravity-ui/icons';
import Image from 'next/image';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

const slides = [
  {
    id: 1,
    slogan: "Where Intellect Meets Innovation",
    title: "Unleash Unlimited Knowledge",
    description: "Access a pristine, curated matrix of technical publications, research assets, and literary masterpieces seamlessly on your personal dashboard grid.",
    accentBadges: ["150k+ Titles", "Instant Access"],
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: 2,
    slogan: "Empowering Readers Everywhere",
    title: "Your Ultimate Digital Haven",
    description: "Track your real-time reading speeds, organize advanced collections, and check out peer-reviewed assets through an optimized engineering infrastructure.",
    accentBadges: ["Smart Tracking", "Elite Tier Benefits"],
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920&auto=format&fit=crop"
  },
  {
    id: 3,
    slogan: "Curated Literary Technology",
    title: "Bridge the Horizon of Discovery",
    description: "From deep system architecture references to legendary creative non-fiction, discover your next obsidian-grade breakthrough on Library Nexus.",
    accentBadges: ["Live Synced Catalogs", "Offline Storage"],
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920&auto=format&fit=crop"
  }
];

const ReaderBanner = () => {
  const [current, setCurrent] = useState(0);
  
  // Cleaned up syntax error and placed hook inside the component layout
  const session = authClient.useSession();
  const isLoggedIn = !!session?.data;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Adjusted slider ticking mechanism to swipe every 10 seconds (10000ms)
  useEffect(() => {
    const slideTimer = setInterval(nextSlide, 10000);
    return () => clearInterval(slideTimer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[80vh] min-h-[500px] md:h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group">

      {/* 1. Interactive Slides Container */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out ${
            index === current ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          {/* Background Image Layer */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            priority={index === current}
            className="object-cover select-none"
          />

          {/* Premium Multi-Layer Dark Vignette Gradients */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-slate-900/40" />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/20 to-slate-950/20" />

          {/* Centered Descriptive Context Content Block */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 sm:px-12 max-w-4xl mx-auto space-y-4 md:space-y-6 z-10">

            {/* The Dynamic Website Slogan on top */}
            <div className="space-y-2">
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-indigo-400" />
                {slide.slogan}
              </span>
            </div>

            {/* Slide Title Header */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight max-w-3xl">
              {slide.title}
            </h1>

            {/* Supporting Pitch text */}
            <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-2xl">
              {slide.description}
            </p>

            {/* Attrition/Value Accent Tags */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {slide.accentBadges.map((badge, bIdx) => (
                <div key={bIdx} className="flex items-center gap-1.5 text-xs font-medium text-slate-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                  {bIdx % 2 === 0 ? <Star className="w-3.5 h-3.5 text-amber-400" /> : <Flame className="w-3.5 h-3.5 text-orange-400" />}
                  {badge}
                </div>
              ))}
            </div>

            {/* Dynamic Authenticated Call to Action Button Row */}
            <div className="pt-4">
              <Link
                href={isLoggedIn ? "/books" : "/auth/login"}
                className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/20 border border-white/10 backdrop-blur-xs"
              >
                {isLoggedIn ? "Browse Books" : "Get Started"}
              </Link>
            </div>

          </div>
        </div>
      ))}

      {/* 2. Manual Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-xl active:scale-95"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-white/10 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-xl active:scale-95"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {slides.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => setCurrent(dotIdx)}
            className={`h-2.5 rounded-full transition-all duration-500 bg-white ${
              dotIdx === current ? 'w-8 opacity-100 bg-linear-to-r from-indigo-400 to-violet-500' : 'w-2.5 opacity-40 hover:opacity-70'
            }`}
            aria-label={`Go to slide ${dotIdx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default ReaderBanner;