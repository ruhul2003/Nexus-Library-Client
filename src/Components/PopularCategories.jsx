'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Flame, Compass, GraduationCap,  Medal } from '@gravity-ui/icons';
import { FaLaptop } from "react-icons/fa";

import { motion } from 'framer-motion';

export default function PopularCategoriesSection() {
  // Configured structural matrix with respective icons and styled highlights
  const categories = [
    {
      name: "Fiction",
      count: 142,
      icon: Compass,
      color: "from-amber-500/20 to-orange-500/5",
      borderColor: "hover:border-amber-500/40",
      textColor: "text-amber-400"
    },
    {
      name: "Sci-Fi",
      count: 89,
      icon: Flame,
      color: "from-purple-500/20 to-indigo-500/5",
      borderColor: "hover:border-purple-500/40",
      textColor: "text-purple-400"
    },
    {
      name: "Academic",
      count: 214,
      icon: GraduationCap,
      color: "from-emerald-500/20 to-teal-500/5",
      borderColor: "hover:border-emerald-500/40",
      textColor: "text-emerald-400"
    },
    {
      name: "Technology",
      count: 312,
      icon: FaLaptop,
      color: "from-blue-500/20 to-indigo-500/5",
      borderColor: "hover:border-blue-500/40",
      textColor: "text-blue-400"
    },
    {
      name: "Biography",
      count: 64,
      icon: BookOpen,
      color: "from-rose-500/20 to-pink-500/5",
      borderColor: "hover:border-rose-500/40",
      textColor: "text-rose-400"
    },
    {
      name: "Classics",
      count: 115,
      icon: Medal,
      color: "from-indigo-500/20 to-slate-500/5",
      borderColor: "hover:border-indigo-500/40",
      textColor: "text-indigo-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <section className="w-full space-y-6 py-6">
      {/* Section Header Context */}
      <div className="border-b border-white/5 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
          Index Classifications
        </span>
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
          Popular Categories
        </h2>
      </div>

      {/* Grid Allocation Matrix */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categories.map((cat, index) => {
          const IconComponent = cat.icon;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Link 
                href={`/books?search=${encodeURIComponent(cat.name)}`}
                className={`group block relative h-full bg-slate-900/15 border border-white/10 ${cat.borderColor} rounded-2xl p-5 transition-all duration-300 shadow-xl overflow-hidden backdrop-blur-xs`}
              >
                {/* Dynamic Gradient Underlay background on hover */}
                <div className={`absolute inset-0 bg-linear-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  {/* Icon Node Box */}
                  <div className={`p-3 bg-white/5 rounded-xl border border-white/5 group-hover:scale-110 transition-transform duration-300 ${cat.textColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Text Description Block */}
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight transition-colors duration-200">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-400 transition-colors">
                      {cat.count} Volumes
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}