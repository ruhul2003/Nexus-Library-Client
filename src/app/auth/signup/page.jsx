'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { Envelope, Lock, ArrowRight, BookOpen, Person, Camera, ShieldCheck } from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('reader');
  const [adminCode, setAdminCode] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.error?.message || 'Failed to upload avatar.');
    return payload.data.url;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate Admin Secret Code if Admin is selected
    if (userType === 'admin') {
      const validCode = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'NEXUS-ADMIN-2026';
      if (!adminCode || adminCode.trim() !== validCode) {
        setError("Invalid Admin Security Passcode. Access denied for administrative registration.");
        setIsLoading(false);
        return;
      }
    }

    try {
      let avatarUrl = '';
      if (imageFile) {
        avatarUrl = await uploadToImgBB(imageFile);
      }

      await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        role: userType,
        image: avatarUrl || undefined,
        callbackURL: '/auth/login',
      });

      toast.success(`Account created as ${userType.toUpperCase()}! Please sign in.`);
      router.push('/auth/login');
    } catch (err) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate Admin Secret Code if Admin is selected for Google OAuth
      if (userType === 'admin') {
        const validCode = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'NEXUS-ADMIN-2026';
        if (!adminCode || adminCode.trim() !== validCode) {
          setError("Invalid Admin Security Passcode. Access denied for administrative registration.");
          setIsLoading(false);
          return;
        }
      }

      await authClient.signIn.social({
        provider: "google",
        callbackURL: '/auth-callback',
        newUserOptions: {
          data: {
            role: userType
          }
        }
      });
    } catch (err) {
      setError(err.message || "Social login failed.");
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'reader',
      title: 'Reader',
      badge: 'Public Member',
      icon: Person,
      description: 'Browse, borrow digital books & post reviews',
    },
    {
      id: 'librarian',
      title: 'Librarian',
      badge: 'Staff Member',
      icon: BookOpen,
      description: 'Manage book inventory, issues & returns',
    },
    {
      id: 'admin',
      title: 'Administrator',
      badge: 'Security Pass required',
      icon: ShieldCheck,
      description: 'Full system management & role oversight',
    },
  ];

  return (
    <div className="w-full flex items-center justify-center p-6 selection:bg-violet-500 selection:text-white my-10">
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
              <p className="text-slate-500 text-sm">Join our professional library network today with role-based access.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              
              {/* 1. ROLE SELECTOR */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Account Role</label>
                  <span className="text-xs text-violet-600 font-semibold uppercase tracking-wider">
                    Role: {userType}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const RoleIcon = role.icon;
                    const isSelected = userType === role.id;
                    return (
                      <label key={role.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="userType"
                          value={role.id}
                          checked={isSelected}
                          onChange={(e) => setUserType(e.target.value)}
                          className="peer sr-only"
                        />
                        <div className={`h-full border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between text-left ${
                          isSelected
                            ? 'border-violet-600 bg-violet-50/60 ring-2 ring-violet-600/20 shadow-md'
                            : 'border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/70 hover:border-slate-300'
                        }`}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <RoleIcon className={`w-5 h-5 ${isSelected ? 'text-violet-600' : 'text-slate-400'}`} />
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-violet-200/70 text-violet-900' : 'bg-slate-200/60 text-slate-500'
                              }`}>
                                {role.badge}
                              </span>
                            </div>
                            <p className={`font-bold text-sm ${isSelected ? 'text-violet-950' : 'text-slate-800'}`}>
                              {role.title}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-snug mt-1">
                              {role.description}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* CONDITIONAL ADMIN PASSCODE FIELD */}
              {userType === 'admin' && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Admin Security Passcode <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Verification Code Required
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-300 rounded-xl text-slate-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all text-sm font-mono shadow-xs"
                      placeholder="Enter admin passcode (e.g. NEXUS-ADMIN-2026)"
                    />
                  </div>
                  <p className="text-[11px] text-amber-700 font-medium">
                    Contact your system administrator if you do not have an authorization code.
                  </p>
                </div>
              )}

              {/* 2. NAME FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm"
                    placeholder="John"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* 3. EMAIL FIELD */}
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
                    className="w-full pl-11 pr-4 py-3 bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm"
                    placeholder="you@institution.edu"
                  />
                </div>
              </div>

              {/* 4. PASSWORD FIELD */}
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
                    className="w-full pl-11 pr-12 py-3 bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all text-sm shadow-sm"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-violet-600 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Profile Image Uploader */}
              <div className="flex flex-col items-center sm:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="relative w-16 h-16 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview ? (
                    <Image src={imagePreview} width={100} height={100} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Profile Avatar</label>
                  <p className="text-xs text-slate-400 mb-2">JPG, PNG parameters supported.</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. EMAIL SIGNUP BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group text-sm shadow-md cursor-pointer"
              >
                {isLoading ? "Processing Registration..." : `Register as ${userType.toUpperCase()}`}
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

            {/* 6. GOOGLE SIGNUP BUTTON */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors active:scale-[0.99] text-sm shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>

          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-400">
          Already have an operational account?{' '}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}