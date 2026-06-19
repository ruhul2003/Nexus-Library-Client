'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Bookmark } from '@gravity-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function BooksGridClient({ filteredBooks }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const toggleBookmark = (bookId) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

  // Grid container orchestration variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  // Enhanced card animations with multiple stages
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.92,
      rotateX: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // spring-like cubic-bezier
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  // Image reveal animation
  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Category badge animation
  const badgeVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.05,
      x: -2,
      transition: { duration: 0.2 }
    }
  };

  // Star animation on hover
  const starVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 12,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Floating bookmark animation
  const bookmarkVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.15,
      y: -2,
      rotate: -5,
      transition: { duration: 0.3 }
    },
    clicked: {
      scale: [1, 1.3, 1.1],
      rotate: [-5, 15, 0],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Shimmer effect overlay
  const shimmerVariants = {
    initial: { x: -100 },
    hover: {
      x: 100,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  // Text stagger animation
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Glow effect animation
  const glowVariants = {
    rest: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 0.5,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      layout
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filteredBooks.map((book, index) => {
          const isHovered = hoveredId === (book.id || book._id);
          const isBookmarked = bookmarkedIds.has(book.id || book._id);

          return (
            <motion.div 
              layout
              key={book.id || book._id}
              variants={cardVariants}
              onHoverStart={() => setHoveredId(book.id || book._id)}
              onHoverEnd={() => setHoveredId(null)}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative bg-slate-900/20 hover:bg-slate-900/40 border border-white/10 hover:border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xl backdrop-blur-xs overflow-hidden"
            >
              {/* Animated background glow on hover */}
              <motion.div
                variants={glowVariants}
                initial="rest"
                animate={isHovered ? "hover" : "rest"}
                className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
              />

              <div className="relative z-10">
                {/* Image Container with Advanced Effects */}
                <div className="relative w-full aspect-4/5 rounded-xl overflow-hidden bg-slate-950 border border-white/5 mb-4">
                  {/* Shimmer effect */}
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate={isHovered ? "hover" : "initial"}
                    className="absolute inset-0 z-20 bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                  />

                  {/* Image with parallax */}
                  <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      sizes="(max-width: 1280px) 25vw, 20vw"
                      className="object-cover"
                      priority={index < 4}
                    />
                  </motion.div>

                  {/* Enhanced Category Badge */}
                  <motion.div 
                    className="absolute top-2.5 right-2.5 z-30"
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <motion.span 
                      className="text-[10px] font-bold uppercase tracking-wider bg-slate-950/90 text-indigo-300 border border-indigo-500/50 px-2.5 py-1.5 rounded-md backdrop-blur-md inline-block"
                      whileHover={{ 
                        boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)"
                      }}
                    >
                      {book.category}
                    </motion.span>
                  </motion.div>

                  {/* Stock indicator with pulse */}
                  {book.availableCopies <= 3 && book.availableCopies > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-2.5 left-2.5 w-2 h-2 bg-amber-400 rounded-full"
                    />
                  )}
                </div>

                {/* Text Metadata with stagger animation */}
                <motion.div 
                  className="space-y-2.5"
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={textItemVariants}>
                    <motion.h3 
                      className="font-bold text-white tracking-tight line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200 text-sm"
                      whileHover={{ letterSpacing: "0.5px" }}
                    >
                      {book.title}
                    </motion.h3>
                  </motion.div>

                  <motion.div variants={textItemVariants} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-400 font-medium">By {book.author}</p>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 whitespace-nowrap">
                      ${book.price || "0.00"}
                    </span>
                  </motion.div>

                  {/* Enhanced Star Rating with animations */}
                  <motion.div 
                    className="flex items-center gap-2 pt-1"
                    variants={textItemVariants}
                  >
                    <motion.div
                      variants={starVariants}
                      initial="rest"
                      animate={isHovered ? "hover" : "rest"}
                    >
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                    </motion.div>
                    <span className="text-xs font-bold text-slate-300">
                      {book.rating?.toFixed(1) || "4.5"}
                    </span>
                    <span className="text-slate-600 text-xs">•</span>
                    <motion.span 
                      className={`text-[11px] font-semibold ${book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                      animate={book.availableCopies === 0 ? { opacity: [1, 0.7, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {book.availableCopies > 0 ? `${book.availableCopies} left` : 'Out of stock'}
                    </motion.span>
                  </motion.div>

                  {/* Excerpt Block with gradient fade */}
                  <motion.p 
                    className="text-slate-400 text-xs leading-relaxed line-clamp-2 pt-1"
                    variants={textItemVariants}
                  >
                    {book.description}
                  </motion.p>
                </motion.div>
              </div>

              {/* Enhanced Actions Footer */}
              <motion.div 
                className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2 relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link 
                    href={`/books/${book.id || book._id}`}
                    className="flex-1 block bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-center text-white font-bold text-xs py-2.5 px-3 rounded-xl transition duration-200 active:scale-98 shadow-lg hover:shadow-indigo-500/50"
                  >
                    View Details
                  </Link>
                </motion.div>

                {/* Enhanced Bookmark Button */}
                <motion.button 
                  onClick={() => toggleBookmark(book.id || book._id)}
                  variants={bookmarkVariants}
                  initial="rest"
                  animate={isBookmarked ? "clicked" : isHovered ? "hover" : "rest"}
                  className={`p-2.5 rounded-xl transition-all duration-200 border ${
                    isBookmarked 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' 
                      : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <motion.div
                    animate={isBookmarked ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-400' : ''}`} />
                  </motion.div>
                </motion.button>
              </motion.div>

            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}