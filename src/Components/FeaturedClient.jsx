'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, Bookmark } from '@gravity-ui/icons';
import { motion } from 'framer-motion';

// Parent container variant to coordinate staggering orchestrations beautifully
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // Staggers children items sequentially
      delayChildren: 0.1,
    }
  }
};

// Clean, standalone item animation properties
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.215, 0.610, 0.355, 1.000] // Clean cubic-bezier easing
    }
  }
};

export default function FeaturedClient({ featuredBooks = [] }) {
  return (
    <motion.section
      className="w-full space-y-12 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        className="flex items-end justify-between border-b border-white/5 pb-6"
        variants={itemVariants}
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-1">
            Curated Matrix
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Featured Releases
          </h2>
        </div>

        <Link 
          href="/books" 
          className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition group"
        >
          View All Catalog
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredBooks.map((book) => (
          <motion.div
            key={book.id || book._id}
            variants={itemVariants}
            className="group relative bg-slate-900/20 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 rounded-3xl p-5 flex flex-col overflow-hidden transition-colors duration-500"
            whileHover={{ 
              y: -8,
              transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
            }}
          >
            {/* Subtle card background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 to-indigo-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Image Wrapper */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 mb-5 Isolation-isolate">
              {/* Separate hover tracking target container */}
              <div className="w-full h-full overflow-hidden rounded-2xl group-hover:scale-[1.03] transition-transform duration-700 ease-[0.25,1,0.5,1]">
                <Image
                  src={book.image || book.coverImage || book.imageUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop"}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[0.25,1,0.5,1] group-hover:scale-105"
                  unoptimized
                />
              </div>

              {/* Tag stays clean */}
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md text-slate-200">
                  {book.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3 relative z-10">
              <h3 className="font-bold text-lg text-white tracking-tight line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
                {book.title}
              </h3>

              <p className="text-sm text-slate-400">By {book.author}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{book.rating?.toFixed(1) || "4.8"}</span>
                </div>
                <span className="font-bold text-emerald-400">
                  ${book.price || "0.00"}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3 relative z-10">
              <Link 
                href={`/books/${book.id || book._id}`}
                className="flex-1 bg-white text-black font-semibold text-sm py-3 rounded-2xl text-center hover:bg-slate-100 active:scale-[0.98] transition-all duration-200"
              >
                View Details
              </Link>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/30 rounded-2xl text-slate-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <Bookmark className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div className="flex justify-center pt-6" variants={itemVariants}>
        <Link 
          href="/books"
          className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold text-sm flex items-center gap-3 group transition-all duration-300 hover:border-indigo-500/40"
        >
          Explore Full Catalog
          <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </motion.div>
    </motion.section>
  );
}