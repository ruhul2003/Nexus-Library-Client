'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { Lock, ArrowRight, BookOpen, At } from '@gravity-ui/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logged in successfully with ${email}! (Demo)`);
  };

  const handleGoogleSignIn = () => {
    alert("Redirecting to Google Auth... (Demo)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 selection:bg-violet-500 selection:text-white">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header (Matching the capsule at the top of Screenshot 2026-06-18 144639.jpg) */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
            <BookOpen className="w-8 h-8 text-violet-400" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1">Library Nexus</h1>
              <p className="text-xs text-violet-300 font-medium tracking-wide uppercase">Management System</p>
            </div>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="p-8 sm:p-10">
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome Back</h2>
              <p className="text-slate-500 text-xs">Access your professional library network dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <At className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-[#eef2f6] border border-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:bg-white transition-all text-sm"
                    placeholder="you@institution.edu"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-2.5 bg-white border border-transparent rounded-xl text-slate-900 placeholder-slate-400 transition-all text-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-violet-600 transition-colors "
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 "
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-500 select-none cursor-pointer">
                  Remember me on this browser
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-violet-600/10 hover:shadow-violet-700/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group text-sm"
              >
                Sign In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-semibold">Or platform sign in</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors active:scale-[0.99] text-sm shadow-sm"
            >
              <FcGoogle className="w-4 h-4" />
              Continue with Google
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400">
          Don't have an account yet?{' '}
          <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}