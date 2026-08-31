'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { Lock, ArrowRight, BookOpen, At } from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectBasedOnRole = (authData) => {
    const rawRole = authData?.user?.role || 'reader';
    const role = rawRole.toLowerCase().trim(); 
    
    if (role === 'admin') {
      router.push('/dashboard/admin');
    } else if (role === 'librarian') {
      router.push('/dashboard/librarian');
    } else {
      router.push('/dashboard/reader');
    }
    
    router.refresh();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email,
        password,
        dontRememberSession: !rememberMe, 
      });

      if (authError) throw authError;

      redirectBasedOnRole(data);
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authClient.signIn.social({
        provider: "google",

        callbackURL: '/dashboard', 
      });
    } catch (err) {
      setError(err.message || "Social login failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] items-center justify-center w-full flex flex-col p-6 selection:bg-violet-500 selection:text-white">
      <div className="max-w-md w-full space-y-6">

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
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="p-8 sm:p-10">
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome Back</h2>
              <p className="text-slate-500 text-xs">Access your professional library network dashboard.</p>
            </div>

            {/* Error Notification Alert */}
            {error && (
              <div className="mb-4 p-3 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl">
                {error}
              </div>
            )}

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
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-100 focus:bg-white border border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm disabled:opacity-60"
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
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-2.5 bg-slate-100 focus:bg-white border border-slate-200/60 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-sm disabled:opacity-60"
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
                  disabled={isLoading}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-violet-600"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-500 select-none cursor-pointer">
                  Remember me on this browser
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-violet-600/10 hover:shadow-violet-700/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 group text-sm disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-semibold">Or platform sign up</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors active:scale-[0.99] text-sm shadow-sm disabled:opacity-50"
            >
              <FcGoogle className="w-4 h-4" />
              Continue with Google
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400">
          Do not have an account yet?{' '}
          <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div> 
  );
}