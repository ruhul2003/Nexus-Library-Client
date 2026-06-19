'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ArrowRight, Bookmark } from '@gravity-ui/icons';
import { motion } from 'framer-motion';

export default function FeaturedClient({ featuredBooks }) {
  // Animation configurations safely kept inside client territory
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.section 
      className="w-full space-y-8 py-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Grid Headers Context */}
      <motion.div className="flex items-end justify-between border-b border-white/5 pb-4" variants={headerVariants}>
        <div>
          <motion.span 
            className="text-xs font-bold uppercase tracking-widest text-indigo-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Curated Matrix
          </motion.span>
          <motion.h2 
            className="text-xl md:text-2xl font-black tracking-tight text-white mt-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Featured Releases
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/books" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition group">
            View All Catalog 
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* 3-Column Content Flex Row */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
        {featuredBooks.map((book, index) => (
          <motion.div 
            key={book.id || book._id}
            className="group relative bg-slate-900/20 hover:bg-slate-900/40 border border-white/10 hover:border-white/20 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl backdrop-blur-xs"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              {/* Image Frame Block */}
              <motion.div className="relative w-full aspect-4/5 rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-4" whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }}>
                <motion.div initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="w-full h-full">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    sizes="(max-width: 7xl) 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
                <motion.div className="absolute top-2.5 right-2.5 z-10" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-indigo-300 border border-white/10 px-2 py-1 rounded-md backdrop-blur-md">
                    {book.category}
                  </span>
                </motion.div>
              </motion.div>

              {/* Book Info row containing styled price matrix */}
              <motion.div className="space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}>
                <h3 className="font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {book.title}
                </h3>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-400 font-medium">By {book.author}</p>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
                    ${book.price || "0.00"}
                  </span>
                </div>
              </motion.div>

              {/* Rating and Availability Matrix */}
              <motion.div className="flex items-center gap-1.5 mt-2.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}>
                <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                </motion.div>
                <span className="text-xs font-bold text-slate-300">{book.rating?.toFixed(1) || "4.5"}</span>
                <span className="text-slate-600 text-xs">•</span>
                <span className={`text-[11px] font-semibold ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of stock'}
                </span>
              </motion.div>

              {/* Synopsis snippet excerpt */}
              <motion.p className="text-slate-400 text-xs leading-relaxed mt-3 line-clamp-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}>
                {book.description}
              </motion.p>
            </div>

            {/* Action Buttons Row */}
            <motion.div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}>
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href={`/books/${book.id || book._id}`} className="block bg-white hover:bg-slate-100 text-center text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition duration-200">
                  View Details
                </Link>
              </motion.div>
              <motion.button className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition" whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }} whileTap={{ scale: 0.9 }}>
                <Bookmark className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Base View All Trigger Anchor Button */}
      <motion.div className="flex justify-center pt-4" variants={buttonVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/books" className="w-full sm:w-auto text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all duration-200 shadow-md inline-block">
            View All Books
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}