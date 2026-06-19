import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Bookmark, Calendar, ShieldCheck, Flame, BookOpen } from '@gravity-ui/icons';

// Prevent stale caching so book modifications (like changing quantities) show up instantly
export const revalidate = 0;

const BookDetailsPage = async ({ params }) => {
  // Await params to access dynamic route parameter properties safely
  const { id } = await params;
  let book = null;
  let error = null;

  try {
    const res = await fetch(`http://localhost:5000/api/books/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      if (res.status === 404) throw new Error('The requested book resource does not exist inside our active index.');
      throw new Error('Failed to download book profile data stream.');
    }

    book = await res.json();
  } catch (err) {
    error = err.message;
  }

  // Error Handling Layout Context
  if (error || !book) {
    return (
      <div className="text-center py-24 max-w-md mx-auto space-y-4">
        <div className="text-rose-500 font-bold text-lg">Lookup Exception</div>
        <p className="text-sm text-slate-400 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4">{error || 'Unknown runtime error'}</p>
        <Link href="/books" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:underline pt-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalog System
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">

      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Universal Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

        <div className="md:col-span-5 lg:col-span-4 w-full max-w-sm mx-auto md:max-w-none">
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl shadow-indigo-950/40 group">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              priority
              sizes="(max-w-6xl) 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
              {book.category}
            </span>
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400/20" />
              {book.rating?.toFixed(1)} Rating
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {book.title}
            </h1>
            <p className="text-slate-400 font-medium text-base md:text-lg">
              Written by <span className="text-white hover:text-indigo-400 transition cursor-pointer font-semibold">{book.author}</span>
            </p>
          </div>

          <hr className="border-white/5" />

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Synopsis</h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {book.description}
            </p>
          </div>

          {book.tags && book.tags.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Indexed Tags</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hover:bg-white/10 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="border-white/5" />

          {/* Updated structural pricing and details layout matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Purchase Price</span>
              <span className="text-xl font-black mt-1 text-emerald-400">
                ${book.price || "0.00"}
              </span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Available Quantities</span>
              <span className={`text-xl font-black mt-1 ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {book.availableCopies} / {book.totalCopies} Units
              </span>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pipeline Status</span>
              <span className={`text-sm font-bold mt-1.5 inline-flex items-center gap-1.5 ${book.availableCopies > 0 ? 'text-indigo-400' : 'text-slate-400'}`}>
                {book.availableCopies > 0 ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Checkout
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-orange-400" /> Waiting List Active
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 max-w-xl w-full">
            <form action="/api/checkout_sessions" method="POST" className="flex-1">
              <button 
                type="submit" 
                role="link"
                className="w-full block bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-center text-white font-bold text-sm py-3 px-6 rounded-xl transition duration-200 shadow-lg hover:shadow-indigo-500/30"
              >
                Order Now
              </button>
            </form>

            <button
              className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition flex items-center justify-center"
              title="Add to Vault Saved Reading List"
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default BookDetailsPage;