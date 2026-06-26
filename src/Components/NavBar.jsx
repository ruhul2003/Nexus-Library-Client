'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { authClient } from '@/lib/auth-client';
import { ArrowRightFromSquare, Bars, Xmark } from '@gravity-ui/icons';
import Image from 'next/image';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Browse Books', path: '/books' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const NavBar = () => {
  const pathname = usePathname(); 
  const session = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!session?.data;
  const user = session?.data?.user;

  const getDashboardPath = () => {
    if (!user?.role) return '/dashboard/reader';
    
    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/dashboard/admin';
      case 'librarian':
        return '/dashboard/librarian';
      default:
        return '/dashboard/reader';
    }
  };

  const dashboardPath = getDashboardPath();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <header className="w-full z-50 transition-all sticky top-0">
      <nav className="w-full flex justify-center items-center pt-6 px-4 md:px-8">
        <div className="w-full max-w-7xl bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-indigo-950/20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              L
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Library<span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Nexus</span>
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`transition duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-indigo-500 after:transition-all ${
                    isActive 
                      ? 'text-indigo-400 after:w-full' 
                      : 'text-slate-300 hover:text-white after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 md:gap-4">
                <Link 
                  href={dashboardPath} 
                  className={`flex items-center gap-2 bg-white/5 hover:bg-white/10 border rounded-xl px-3 py-1.5 transition text-sm font-medium max-w-[160px] ${
                    pathname === dashboardPath 
                      ? 'border-indigo-500 text-indigo-400' 
                      : 'border-white/10 text-white'
                  }`}
                >
                  <Image 
                    src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
                    width={20}
                    height={20}
                    alt={user?.name || "Avatar"} 
                    className="w-5 h-5 rounded-full object-cover border border-white/20"
                    unoptimized
                  />
                  <span className="truncate max-w-[90px]">
                    {user?.name || "Account"}
                  </span>
                </Link>

                {/* Logout Action Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 bg-white/0 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition duration-200 active:scale-95"
                  title="Sign Out"
                >
                  <ArrowRightFromSquare className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-5">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-slate-300 hover:text-white transition duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold px-4 py-2.5 rounded-xl active:scale-[0.98] transition duration-200 shadow-md shadow-white/5"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition"
            >
              {mobileMenuOpen ? <Xmark className="w-5 h-5" /> : <Bars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2 max-w-7xl bg-slate-950/95 backdrop-blur-lg border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm py-2 px-3 rounded-lg transition ${
                  pathname === link.path ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!isLoggedIn && (
            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-950 bg-white rounded-xl transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default NavBar;