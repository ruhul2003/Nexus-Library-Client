"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Feather, 
  Globe, 
  Layers 
} from "lucide-react";

// প্ল্যাটফর্মের ৩টি মূল পিলার বা স্ট্যাটস
const stats = [
  { id: 1, label: "Curated Volumes", value: "10K+", icon: BookOpen },
  { id: 2, label: "Active Readers", value: "5,000+", icon: Users },
  { id: 3, label: "Global Authors", value: "350+", icon: Globe },
];

// আমাদের কোর ভ্যালু বা বৈশিষ্ট্য
const values = [
  {
    title: "Curated Excellence",
    description: "Every manuscript and modern tech volume in our catalog undergoes rigorous indexing to ensure peak academic and literary value.",
    icon: Sparkles,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  },
  {
    title: "Open Knowledge Sync",
    description: "Seamlessly connect with decentralized reader workspaces and digital core terminals anytime, anywhere.",
    icon: Layers,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
  },
  {
    title: "Secure Verification",
    description: "Your digital transactions, ledger validation, and subscription states are fully guarded under top-tier encrypted validation blocks.",
    icon: ShieldCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  }
];

// Framer Motion অ্যানিমেশন কনফিগারেশন
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" }
  })
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Section 1: Hero Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-400"
          >
            <Feather className="w-3.5 h-3.5" /> Our Manifesto
          </motion.div>

          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            Bridging Minds Through Curated Volumes.
          </motion.h1>

          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-slate-400 text-sm sm:text-base leading-relaxed"
          >
            We are a team of software engineers, creators, and bibliophiles dedicated to crafting the ultimate reading workspace. Our node network archives cross-disciplinary wisdom, providing instantaneous core terminal access to next-gen literature.
          </motion.p>
        </div>

        {/* Section 2: Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md shadow-2xl"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="text-center space-y-2 p-4 relative group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto text-indigo-400 border border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black tracking-tight text-white">{stat.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </motion.div>

        {/* Section 3: Core Values / Why Us */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Our Core Ecosystem</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Architected for deep focus and absolute integrity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, idx) => {
              const ValueIcon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-slate-900/20 border border-white/5 hover:border-white/10 rounded-2xl p-6 space-y-4 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${value.color}`}>
                    <ValueIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-200">{value.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Bottom Call-To-Action Footer area */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-4 pt-10 border-t border-white/5"
        >
        </motion.div>

      </div>
    </div>
  );
}