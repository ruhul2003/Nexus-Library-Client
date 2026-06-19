'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {  LogoGithub, LogoTelegram, Envelope } from '@gravity-ui/icons';
import { FaXTwitter } from "react-icons/fa6";


const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Frontend placeholder interaction
    alert(`Thank you! ${email} has been registered to the Nexus Intel feed.`);
    setEmail('');
  };

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        
        {/* Top Grid Matrix Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand/Slogan Column (4 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/10">
                L
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Library<span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Nexus</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Where intellect meets innovation. Access a pristine, distributed matrix of curated technical assets and engineering intelligence.
            </p>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition duration-200">About Framework</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition duration-200">Contact Terminal</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition duration-200">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup Area (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Nexus Intel Wire</h4>
            <p className="text-slate-400 text-xs md:text-sm">Subscribe to receive system patch notes and raw repository drops.</p>
            
            <form onSubmit={handleNewsletterSubmit} className="relative w-full max-w-md">
              <input
                type="email"
                required
                placeholder="Enter core mail vector..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 bg-slate-900/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition active:scale-95"
                title="Subscribe Feed"
              >
                <Envelope className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Metadata Ledger Area */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          
          {/* Copyright Info */}
          <div>
            &copy; {new Date().getFullYear()} Library Nexus Inc. All rights reserved. Built for elite technical literacy.
          </div>

          {/* Social Icons Row (Using Gravity UI brand icons) */}
          <div className="flex items-center gap-4">
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl text-slate-400 hover:text-white transition"
              aria-label="Follow on X"
            >
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl text-slate-400 hover:text-white transition"
              aria-label="View Github Infrastructure"
            >
              <LogoGithub className="w-4 h-4" />
            </a>
            <a 
              href="https://telegram.org" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl text-slate-400 hover:text-white transition"
              aria-label="Join Community Pipeline"
            >
              <LogoTelegram className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;