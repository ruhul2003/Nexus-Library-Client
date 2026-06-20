import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Bookmark, ShieldCheck, Flame } from '@gravity-ui/icons';

export const revalidate = 0;

const BookDetailsPage = async ({ params }) => {
  const { id } = await params; // Captures directory parameter segment cleanly
  let book = null;
  let error = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/books/${id}`, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error('Book not found');
      throw new Error('Failed to fetch book details');
    }

    book = await res.json();
  } catch (err) {
    error = err.message;
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="text-rose-500 font-bold text-xl">Lookup Exception</div>
          <p className="text-slate-400 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6">
            {error || 'Book not found'}
          </p>
          <Link 
            href="/books" 
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-16 space-y-8 px-4">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Universal Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cover */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
            <Image
              src={book.coverImage || '/images/book-placeholder.jpg'}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
              {book.category}
            </span>
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-xs font-semibold text-amber-400">
              <Star className="w-4 h-4" />
              {book.rating?.toFixed(1)} Rating
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {book.title}
            </h1>
            <p className="text-slate-400 text-lg mt-2">
              by <span className="text-white font-semibold">{book.author}</span>
            </p>
          </div>

          <hr className="border-white/10" />

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Synopsis</h3>
            <p className="text-slate-300 leading-relaxed">{book.description}</p>
          </div>

          {book.tags?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="border-white/10" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">Price</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                ${book.price || "0.00"}
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">Available</p>
              <p className={`text-3xl font-black mt-1 ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {book.availableCopies} / {book.totalCopies}
              </p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">Status</p>
              <p className={`mt-2 font-medium flex items-center gap-2 ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                {book.availableCopies > 0 ? (
                  <>✅ Available Now</>
                ) : (
                  <>⏳ On Waiting List</>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <form action="http://localhost:5000/api/checkout_sessions" method="POST" className="flex-1">
              {/* SWITCHED: Replaced identifier keys securely with standard MongoDB database identity field metadata */}
              <input type="hidden" name="bookId" value={book._id} />
              <button 
                type="submit"
                className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-2xl transition shadow-lg"
              >
                Order Now
              </button>
            </form>

            <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-300 hover:text-white transition">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;