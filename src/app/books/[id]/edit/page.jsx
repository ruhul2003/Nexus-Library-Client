'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from '@gravity-ui/icons';

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    price: '',
    availableCopies: '',
    totalCopies: '',
    imageUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // 🔒 SECURITY GUARDRAIL: Client-Side Session Check for Librarian & Admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/get-session'); 
        if (res.ok) {
          const session = await res.json();
          const userRole = session?.user?.role?.toLowerCase();

          // 🌟 লজিক আপডেট: ইউজার যদি librarian বা admin কোনোটিই না হয়, তবেই রিডাইরেক্ট হবে
          if (userRole !== 'librarian' && userRole !== 'admin') {
            router.replace(`/books/${id}`); 
            return;
          }
        } else {
          // সেশন রেসপন্স ওকে না হলে (লগইন না থাকলে) লগইন পেজে পাঠান
          router.replace('/login');
          return;
        }
      } catch (err) {
        console.error("Security check failed:", err);
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [id, router]);

  // পেজ লোড হওয়ার সাথে সাথে বইয়ের ডাটাবেজ রেকর্ড ফেচ করা
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (authChecking) return;
      try {
        const res = await fetch(`${apiUrl}/api/books/${id}`);
        if (!res.ok) throw new Error('Requested library volume asset data could not be retrieved.');
        const data = await res.json();
        
        setFormData({
          title: data.title || '',
          author: data.author || '',
          category: data.category || '',
          description: data.description || '',
          price: data.price || data.fee || '', 
          availableCopies: data.availableCopies ?? 1,
          totalCopies: data.totalCopies ?? 1,
          imageUrl: data.imageUrl || data.coverImage || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, apiUrl, authChecking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          availableCopies: parseInt(formData.availableCopies),
          totalCopies: parseInt(formData.totalCopies),
        }),
      });

      if (!res.ok) throw new Error('Failed to update the volume asset metadata.');

      router.push(`/books/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong while synchronizing storage ledger.');
      setIsUpdating(false);
    }
  };

  if (authChecking || isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400 font-semibold tracking-wide animate-pulse">
        Authenticating Permissions & Fetching Asset Metadata...
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 text-white">
      <Link 
        href={`/books/${id}`} 
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-6 transition segment-back-btn"
      >
        <ArrowLeft className="w-4 h-4" /> Abort Configuration & Return
      </Link>

      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl font-black tracking-tight mb-1">Edit Library Asset</h1>
        <p className="text-slate-400 text-sm mb-6">Modify the centralized parameters and total distribution copies of this catalog entry.</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Book Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Author Name</label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category</label>
              <input
                type="text"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Price / Access Fee ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                required
                value={formData.availableCopies}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Total Copies</label>
              <input
                type="number"
                name="totalCopies"
                required
                value={formData.totalCopies}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cover Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition"
              placeholder="https://i.ibb.co/..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Synopsis / Description</label>
            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl transition shadow-lg text-sm cursor-pointer"
          >
            {isUpdating ? 'Committing Modifications...' : 'Update Volume Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}