'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from '@gravity-ui/icons';
import { motion } from 'framer-motion';

export default function TopLibrariansSection() {
  const topLibrarians = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Senior Archivist & Systems Manager",
      deliveries: 1420,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
      bio: "Spearheading distributed repository optimization and indexing automation for premium global digital data infrastructures."
    },
    {
      id: 2,
      name: "Marcus Vance",
      role: "Principal Data Curator",
      deliveries: 1285,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      bio: "Specializing in multi-subnet asset recovery pipelines and cryptographic configuration management ecosystems."
    },
    {
      id: 3,
      name: "Elena Rostova",
      role: "Core Network Systems Librarian",
      deliveries: 940,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
      bio: "Overseeing automated validation streams and terminal-level routing frameworks for high-throughput library protocols."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  return (
    <section className="w-full space-y-8 py-10">
      {/* Expanded Title Metrics Header Block */}
      <div className="border-b border-white/5 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">
          Distribution Architecture
        </span>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white mt-3">
          Top Providers
        </h2>
        <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
          Meet the top performing architects executing high-availability distribution protocols across global indexes.
        </p>
      </div>

      {/* 60vh High-Impact Profile Matrix Layout */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[60vh] items-stretch"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topLibrarians.map((librarian) => (
          <motion.div
            key={librarian.id}
            variants={cardVariants}
            whileHover={{ y: -12, transition: { duration: 0.3 } }}
            className="group relative flex flex-col justify-between bg-slate-900/15 hover:bg-slate-900/35 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-2xl backdrop-blur-md overflow-hidden"
          >
            {/* Immersive Background Radial Ambient Light Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 group-hover:bg-indigo-500/15 transition-all duration-500 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              {/* Massive Profile Frame Container */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-xl group-hover:border-indigo-400/30 transition-colors duration-300">
                <Image
                  src={librarian.avatar}
                  alt={librarian.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 112px, 96px"
                  className="object-cover scale-102 group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Identity & Technical Domain Context Stack */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-white text-xl tracking-tight group-hover:text-indigo-300 transition-colors duration-200">
                    {librarian.name}
                  </h3>
                  <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" title="Verified Pipeline Authority" />
                </div>
                <p className="text-xs md:text-sm font-semibold text-indigo-400/90 tracking-wide uppercase">
                  {librarian.role}
                </p>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-normal pt-2 border-t border-white/5">
                  {librarian.bio}
                </p>
              </div>
            </div>

            {/* Sub-Footer Metric Matrices */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Performance Status</span>
                <span className="text-xs font-bold text-emerald-400 mt-0.5 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Elite Provider
                </span>
              </div>
              
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Transfers</span>
                <span className="text-base font-black text-white bg-white/5 border border-white/10 px-3 py-1 rounded-xl mt-1 inline-block">
                  {librarian.deliveries.toLocaleString()}
                </span>
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}