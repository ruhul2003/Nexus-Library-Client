'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";
import { Envelope, Lock, ArrowRight, BookOpen, Person } from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('reader');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Turn on loading state
    setError(null);

    try {
      await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        role: userType,
        redirect: '/auth/login',
      });

      alert(`Signed up successfully with ${email}!`);
    } catch (err) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };



  const handleGoogleSignIn = () => {
    alert("Redirecting to Google Auth... (Demo)");
  };

  return (
    <div className="w-full flex items-center justify-center p-6 selection:bg-violet-500 selection:text-white">
      <div className="max-w-2xl w-full space-y-8">

        {/* Brand Header */}
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
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center sm:text-left mb-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-slate-500 text-sm">Join our professional library network today.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">

              {/* 2-Column Grid for Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* First Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-200 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm hover:border-slate-300"
                    placeholder="John"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-200 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm hover:border-slate-300"
                    placeholder="Doe"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Envelope className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-200 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm hover:border-slate-300"
                      placeholder="you@institution.edu"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-slate-200 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm hover:border-slate-300"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-violet-600 transition-colors focus:outline-none"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

              </div>

              {/* User Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Account Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="reader"
                      checked={userType === 'reader'}
                      onChange={(e) => setUserType(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="h-full border border-slate-200/80 rounded-xl p-4 transition-all duration-200 flex flex-col items-center text-center bg-slate-50 hover:bg-slate-100/70 peer-checked:border-violet-600 peer-checked:bg-violet-50/50">
                      <Person className="w-6 h-6 mb-2 transition-colors" style={{ color: userType === 'reader' ? '#7c3aed' : '#94a3b8' }} />
                      <p className={`font-semibold text-sm ${userType === 'reader' ? 'text-violet-900' : 'text-slate-800'}`}>Reader</p>
                      <p className="text-xs text-slate-500 mt-0.5">Borrow digital materials</p>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="librarian"
                      checked={userType === 'librarian'}
                      onChange={(e) => setUserType(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="h-full border border-[#666] rounded-xl p-4 transition-all duration-200 flex flex-col items-center text-center bg-slate-50 hover:bg-slate-100/70 peer-checked:border-violet-600 peer-checked:bg-violet-50/50">
                      <BookOpen className="w-6 h-6 mb-2 transition-colors" style={{ color: userType === 'librarian' ? '#7c3aed' : '#94a3b8' }} />
                      <p className={`font-semibold text-sm ${userType === 'librarian' ? 'text-violet-900' : 'text-slate-800'}`}>Librarian</p>
                      <p className="text-xs text-slate-500 mt-0.5">Manage library logs</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3.5 px-4 rounded-xl ... flex items-center justify-center gap-2 group text-sm"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-medium">Or platform sign up</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl transition-colors active:scale-[0.99] text-sm shadow-sm"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400">
          Already have an operational account?{' '}
          <a href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold underline underline-offset-4">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}