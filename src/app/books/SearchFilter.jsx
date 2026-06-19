'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Magnifier } from '@gravity-ui/icons';

export default function SearchFilter({ currentQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    // Pushes the query parameter onto Next.js URL tracking states quietly
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative max-w-md w-full md:w-80">
      <Magnifier className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search titles, authors, tags..."
        defaultValue={currentQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors backdrop-blur-md"
      />
    </div>
  );
}