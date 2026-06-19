import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, Bookmark } from '@gravity-ui/icons';

// Force next.js to keep data fresh without getting stuck in cache
export const revalidate = 0;

const Featured = async () => {
  let featuredBooks = [];
  let error = null;

  try {
    const res = await fetch('http://localhost:5000/api/books', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not establish catalog database link.');
    const data = await res.json();
    
    // Slice down to exactly the first 3 items for a balanced homepage layout row
    featuredBooks = data.slice(0, 3);
  } catch (err) {
    error = err.message;
  }

  if (error) return null; // Gracefully hide the section if the backend server is temporarily offline

  return (
    <section className="w-full space-y-8 py-4 animate-in fade-in duration-700">
      
      {/* Grid Headers Context */}
      <div className="flex items-end justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Curated Matrix</span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">Featured Releases</h2>
        </div>
        <Link 
          href="/books" 
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition group"
        >
          View All Catalog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3-Column Content Flex Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBooks.map((book) => (
          <div 
            key={book.id || book._id}
            className="group relative bg-slate-900/20 hover:bg-slate-900/40 border border-white/10 hover:border-white/20 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl backdrop-blur-xs hover:-translate-y-1"
          >
            <div>
              {/* Image Frame Block */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-4">
                <Image
                  src={book.coverImage}
                  alt={book.title}
                  fill
                  sizes="(max-w-7xl) 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-indigo-300 border border-white/10 px-2 py-1 rounded-md backdrop-blur-md">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-1">
                <h3 className="font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium">By {book.author}</p>
              </div>

              {/* Rating and Availability Matrix */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="text-xs font-bold text-slate-300">{book.rating?.toFixed(1) || "4.5"}</span>
                <span className="text-slate-600 text-xs">•</span>
                <span className={`text-[11px] font-semibold ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of stock'}
                </span>
              </div>

              {/* Synopsis snippet excerpt */}
              <p className="text-slate-400 text-xs leading-relaxed mt-3 line-clamp-2">
                {book.description}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
              <Link 
                href={`/books/${book.id || book._id}`}
                className="flex-1 bg-white hover:bg-slate-100 text-center text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition duration-200"
              >
                View Profile
              </Link>
              <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition">
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Main Base View All Trigger Anchor Button */}
      <div className="flex justify-center pt-4">
        <Link 
          href="/books"
          className="w-full sm:w-auto text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all duration-200 active:scale-98 shadow-md"
        >
          View All Books
        </Link>
      </div>

    </section>
  );
};

export default Featured;