'use client';

import Link from 'next/link';

const navLinks = [
  {
    name: 'Browse Books',
    path: '/books',
  },
  {
    name: 'Categories',
    path: '/categories',
  },
  {
    name: 'About',
    path: '/about',
  },
  {
    name: 'Contact',
    path: '/contact',
  },
];

const NavBar = () => {
  return (
    <header className="w-full bg-linear-to-br from-slate-900 justify-center items-center py-auto via-indigo-950 to-slate-950">
      <nav className="w-full flex justify-center items-center py-4 px-4">
      <div className="w-full max-w-7xl bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-4 flex items-center justify-between shadow-xl">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            L
          </div>

          <h1 className="text-2xl font-bold">
            <span className="text-blue-500">Library</span>
            <span className="text-purple-500"> Nexus</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10 text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="hover:text-white text-lg font-bold transition duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-indigo-700 hover:text-indigo-300 transition duration-300"
          >
            Sign In
          </Link>

          <Link
            href="/auth/signup"
            className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition duration-300 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
    </header>
  );
};

export default NavBar;