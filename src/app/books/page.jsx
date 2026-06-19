import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers } from '@gravity-ui/icons';
import SearchFilter from './SearchFilter'; 
import BooksGridClient from '@/Components/BooksGridClient'; // Import the newly minted grid system

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
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">Universal Catalog</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Explore curated technical repositories and premium documentation manuals.</p>
        </div>
        <SearchFilter currentQuery={query} />
      </div>

      {/* Conditional Layout Rendering */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <p className="text-slate-500 text-sm">No items found matching current index parameters.</p>
        </div>
      ) : (
        /* Render animating Framer-Motion wrapper safely initialized */
        <BooksGridClient filteredBooks={filteredBooks} />
      )}

    </div>
  );
};

export default BooksPage;