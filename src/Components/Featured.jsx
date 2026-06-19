import React from 'react';
import FeaturedClient from './FeaturedClient'; // Adjust this import path to match your folder setup

// Force next.js to keep data fresh without getting stuck in cache
export const revalidate = 0;

const Featured = async () => {
  let featuredBooks = [];
  let error = null;

  try {
    const res = await fetch('http://localhost:5000/api/books', { cache: 'no-store' });
    if (!res.ok) throw new Error('Could not establish catalog database link.');
    const data = await res.json();

    featuredBooks = data.slice(0, 6);
  } catch (err) {
    error = err.message;
  }

  if (error || featuredBooks.length === 0) return null;

  // Hand over the fetched array directly to the animating client view layer
  return <FeaturedClient featuredBooks={featuredBooks} />;
};

export default Featured;