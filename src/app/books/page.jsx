import React from 'react';
import Link from 'next/link';
import SearchFilter from './SearchFilter'; 
import BooksGridClient from '@/Components/BooksGridClient'; 

export const revalidate = 0;

const BooksPage = async ({ searchParams }) => {
  let books = [];
  let error = null;

  const params = await searchParams;
  const query = params?.search || '';
  const currentPage = Number(params?.page) || 1;
  const ITEMS_PER_PAGE = 8; 

  try {
    const baseURl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${baseURl}/api/books`, { cache: 'no-store' });
    
    if (!res.ok) throw new Error('Could not establish database pipeline sync.');
    books = await res.json();
  } catch (err) {
    error = err.message;
  }

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(query.toLowerCase()) ||
    book.author?.toLowerCase().includes(query.toLowerCase()) ||
    book.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

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

      {paginatedBooks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <p className="text-slate-500 text-sm">No items found matching current index parameters.</p>
        </div>
      ) : (
        <>
          <BooksGridClient filteredBooks={paginatedBooks} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5 font-mono text-xs">
              
              {/* Previous Button */}
              <Link
                href={{
                  query: { ...params, page: Math.max(1, currentPage - 1) }
                }}
                className={`px-4 py-2 bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 transition ${
                  currentPage === 1 ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                PREV
              </Link>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={{
                        query: { ...params, page: pageNum }
                      }}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold border transition ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              <Link
                href={{
                  query: { ...params, page: Math.min(totalPages, currentPage + 1) }
                }}
                className={`px-4 py-2 bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 transition ${
                  currentPage === totalPages ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                NEXT
              </Link>

            </div>
          )}
        </>
      )}

    </div>
  );
};

export default BooksPage;