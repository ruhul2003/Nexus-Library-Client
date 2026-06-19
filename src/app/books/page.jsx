import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Bookmark, Layers } from '@gravity-ui/icons';
import SearchFilter from './SearchFilter'; 


export const revalidate = 0;

const BooksPage = async ({ searchParams }) => {
  let books = [];
  let error = null;

  const query = (await searchParams)?.search || '';

  try {
    const res = await fetch('http://localhost:5000/api/books', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not establish database pipeline sync.');
    books = await res.json();
  } catch (err) {
    error = err.message;
  }


  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase()) ||
    book.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  if (error) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="text-rose-500 font-bold text-lg mb-2">Network Sync Interrupted</div>
        <p className="text-sm text-slate-400 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-10/12 mx-auto mt-10 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Universal Catalog</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Explore curated technical repositories and premium documentation manuals.</p>
        </div>
        <SearchFilter currentQuery={query} />
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <p className="text-slate-500 text-sm">No items found matching current index parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div 
              key={book.id || book._id} 
              className="group relative bg-slate-900/20 hover:bg-slate-900/40 border border-white/10 hover:border-white/20 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl backdrop-blur-xs hover:-translate-y-1"
            >
              <div>
                <div className="relative w-full aspect-4/5 rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-4">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(max-w-7xl) 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-indigo-300 border border-white/10 px-2 py-1 rounded-md backdrop-blur-md">
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Metadata details info */}
                <div className="space-y-1">
                  <h3 className="font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">By {book.author}</p>
                </div>

                {/* Star rating matrix rows */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span className="text-xs font-bold text-slate-300">{book.rating?.toFixed(1) || "4.5"}</span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className={`text-[11px] font-semibold ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of stock'}
                  </span>
                </div>

                {/* Description excerpt */}
                <p className="text-slate-400 text-xs leading-relaxed mt-3 line-clamp-2">
                  {book.description}
                </p>
              </div>

              {/* Action Buttons Row with deep linking to the Details dynamic route */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2">
                <Link 
                  href={`/books/${book.id || book._id}`}
                  className="flex-1 bg-white hover:bg-slate-100 text-center text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl transition duration-200 active:scale-98"
                >
                  View Details
                </Link>
                <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-xl transition">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default BooksPage;