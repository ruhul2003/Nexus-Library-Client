import React from 'react';
import FeaturedClient from './FeaturedClient'; 

export const revalidate = 0;

const Featured = async () => {
    const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  let featuredBooks = [];
  let error = null;

  const FALLBACK_COVER = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop";

  try {
    const res = await fetch(`${apiURL}/api/books`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not establish catalog database link.');
    const data = await res.json();

    const sanitizedData = data.map((book) => {
      const rawImageSrc = book.image || book.cover || book.coverImage || book.imageUrl || "";

      return {
        ...book,
        image: typeof rawImageSrc === 'string' && rawImageSrc.trim() !== "" ? rawImageSrc : FALLBACK_COVER
      };
    });

    featuredBooks = sanitizedData.slice(0, 6);
  } catch (err) {
    error = err.message;
  }

  if (error || featuredBooks.length === 0) return null;

  return <FeaturedClient featuredBooks={featuredBooks} />;
};

export default Featured;