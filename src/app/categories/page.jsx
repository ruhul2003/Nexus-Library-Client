"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
// Lucide React Icons ইম্পোর্ট করা হয়েছে
import { 
  BookOpen, 
  Atom, 
  Compass, 
  BrainCircuit, 
  History, 
  Palette, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";

// ক্যাটাগরি ডেটা অবজেক্ট (Lucide Icons সহ)
const categories = [
  {
    id: "sci-fi",
    title: "Science Fiction",
    description: "Explore alternate realities, space exploration, and futuristic technologies.",
    count: 142,
    icon: Atom,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
    hoverBg: "group-hover:bg-blue-500/20",
  },
  {
    id: "fiction",
    title: "Classic Fiction",
    description: "Immerse yourself in timeless stories and legendary literary masterpieces.",
    count: 285,
    icon: BookOpen,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
    hoverBg: "group-hover:bg-emerald-500/20",
  },
  {
    id: "biography",
    title: "Biography & Memoir",
    description: "Step into the lives of extraordinary people who shaped history and culture.",
    count: 98,
    icon: BrainCircuit,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
    hoverBg: "group-hover:bg-amber-500/20",
  },
  {
    id: "adventure",
    title: "Action & Adventure",
    description: "Thrilling journeys, dangerous quests, and epic tales of survival.",
    count: 115,
    icon: Compass,
    color: "from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-400",
    hoverBg: "group-hover:bg-rose-500/20",
  },
  {
    id: "history",
    title: "History & Politics",
    description: "Understand the events, structures, and systems that document mankind.",
    count: 164,
    icon: History,
    color: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 text-purple-400",
    hoverBg: "group-hover:bg-purple-500/20",
  },
  {
    id: "arts",
    title: "Arts & Photography",
    description: "Unlock your creative potentials through visual styles and artistic theories.",
    count: 73,
    icon: Palette,
    color: "from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-400",
    hoverBg: "group-hover:bg-cyan-500/20",
  },
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function CategoriesPage() {
  return (
    <div className="w-full min-h-[80vh] bg-slate-950 text-white py-8 px-4 sm:px-3 lg:px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-400 mx-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Library Archive Core
          </motion.div>
          
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            Browse by Category
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            Select a specialized segment to filter current library assets. Discover curated volumes updated in the storage cluster.
          </motion.p>
        </div>

        <hr className="border-white/5" />

        {/* Categories Grid Cluster */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative bg-linear-to-br ${category.color} border border-white/5 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:border-white/10 shadow-xl overflow-hidden`}
              >
                {/* Background Glow Effect */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-all duration-500" />
                
                <div className="space-y-4">
                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border bg-slate-900/80 transition-all duration-3xl ${category.hoverBg}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tracker / Actions */}
                <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
                  <span className="text-xs font-semibold text-slate-500 bg-white/5 px-2.5 py-1 rounded-md">
                    {category.count} Books Available
                  </span>
                  
                  <Link 
                    href={`/books?category=${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors"
                  >
                    Explore 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
      </div>
    </div>
  );
}