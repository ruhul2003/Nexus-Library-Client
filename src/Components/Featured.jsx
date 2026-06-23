import React from 'react';
import FeaturedClient from './FeaturedClient'; 

// Force next.js to keep data fresh without getting stuck in cache
export const revalidate = 0;

const Featured = async () => {
  let featuredBooks = [];
  let error = null;

  // Global fallback cover image asset
  const FALLBACK_COVER = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop";

  try {
    const res = await fetch('http://localhost:5000/api/books', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not establish catalog database link.');
    const data = await res.json();

    // Sanitize data objects thoroughly before pushing to client layer
    const sanitizedData = data.map((book) => {
      // Find whichever field contains your image string
      const rawImageSrc = book.image || book.cover || book.coverImage || book.imageUrl || "";

      return {
        ...book,
        // Fallback safely if it's an empty string, whitespace, or completely missing
        image: typeof rawImageSrc === 'string' && rawImageSrc.trim() !== "" ? rawImageSrc : FALLBACK_COVER
      };
    });

    featuredBooks = sanitizedData.slice(0, 6);
  } catch (err) {
    error = err.message;
  }

  if (error || featuredBooks.length === 0) return null;

  // Hand over the guaranteed clean array to the client layer
  return <FeaturedClient featuredBooks={featuredBooks} />;
};

export default Featured;