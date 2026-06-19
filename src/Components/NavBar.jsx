'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Imported for active route tracking
import { authClient } from '@/lib/auth-client';
import { Person, ArrowRightFromSquare } from '@gravity-ui/icons';
import Image from 'next/image';

const navLinks = [
  { name: 'Browse Books', path: '/books' },
  { name: 'Categories', path: '/categories' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const NavBar = () => {
  const pathname = usePathname(); // Extract the current active URL path
  const session = authClient.useSession();
  const isLoggedIn = !!session?.data;
  const user = session?.data?.user;

  // Handle logout process
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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              // Check if the current link path matches the current active route
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

          {/* Auth/Profile Section */}
          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              /* Authenticated User Layout Section */
              <div className="flex items-center gap-4">
                {/* Profile Link Badge */}
                <Link 
                  href="/readerDashboard" 
                  className={`flex items-center gap-2 bg-white/5 hover:bg-white/10 border rounded-xl px-3 py-1.5 transition text-sm font-medium max-w-[160px] ${
                    pathname === '/readerDashboard' 
                      ? 'border-indigo-500 text-indigo-400' 
                      : 'border-white/10 text-white'
                  }`}
                >
                  {user?.image ? (
                    <Image 
                      src={user.image} 
                      alt={user?.name || "Profile"} 
                      className="w-5 h-5 rounded-full object-cover border border-white/20"
                      width={20}
                      height={20}
                    />
                  ) : (
                    <Image 
                      src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} 
                      width={20}
                      height={20}
                      alt="avatar" 
                      className="w-5 h-5 rounded-full object-cover border border-white/20"
                    />
                  )}
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
              /* Anonymous/Logged Out Layout Section */
              <>
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
              </>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
};

export default NavBar;