import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Bookmark, PencilToSquare, TrashBin, EyeSlash } from '@gravity-ui/icons';
import { redirect } from 'next/navigation';
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export const revalidate = 0;

const BookDetailsPage = async ({ params }) => {
  const { id } = await params;
  let book = null;
  let reviews = [];
  let error = null;

  let hasPrivilegedAccess = false; // Librarian অথবা Admin উভয়ের জন্য ফ্ল্যাগ
  
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userRole = session?.user?.role?.toLowerCase();
    
    // 🌟 Admin অথবা Librarian হলে প্রিভিলেজড অ্যাক্সেস ট্রু হবে
    if (userRole === 'librarian' || userRole === 'admin') {
      hasPrivilegedAccess = true;
    }
  } catch (authErr) {
    console.error("Auth session fetch failed:", authErr);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch Book Info and Book Reviews concurrently
  try {
    const [bookRes, reviewsRes] = await Promise.all([
      fetch(`${apiUrl}/api/books/${id}`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/reviews/book/${id}`, { cache: 'no-store' }).catch(() => null)
    ]);

    if (!bookRes.ok) {
      if (bookRes.status === 404) throw new Error('Book not found');
      throw new Error('Failed to fetch book details');
    }

    book = await bookRes.json();
    if (reviewsRes && reviewsRes.ok) {
      reviews = await reviewsRes.json();
    }
  } catch (err) {
    error = err.message;
  }

  async function handleCheckout() {
    'use server';
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect('/auth/login');

    const targetUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const finalPrice = book?.price || book?.fee || 0;
    let redirectUrl = null;

    try {
      const response = await fetch(`${targetUrl}/api/checkout_sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: [{ id: String(book._id), title: book.title, price: finalPrice, quantity: 1 }]
        }),
      });

      const sessionData = await response.json();
      if (sessionData?.success && sessionData?.url) {
        redirectUrl = sessionData.url; 
      }
    } catch (err) {
      console.error("Server Action Fetch Error:", err);
    }

    if (redirectUrl) redirect(redirectUrl);
  }

  // Handle Unpublish & Delete Server Actions...
  async function handleUnpublish() {
    'use server';
    const targetUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${targetUrl}/api/books/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Unpublished' }), 
      });
      if (response.ok) redirect('/books'); 
    } catch (err) { console.error(err); }
  }

  async function handleDelete() {
    'use server';
    const targetUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${targetUrl}/api/books/${id}`, { method: 'DELETE' });
      if (response.ok) redirect('/books');
    } catch (err) { console.error(err); }
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto space-y-4">
          <div className="text-rose-500 font-bold text-xl">Lookup Exception</div>
          <p className="text-slate-400 bg-rose-500/5 border border-rose-500/10 rounded-2xl p-6">{error || 'Book not found'}</p>
          <Link href="/books" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium"><ArrowLeft className="w-4 h-4" /> Return to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] max-w-6xl mx-auto pb-16 space-y-12 px-4">
      <Link href="/books" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Universal Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="md:col-span-5 lg:col-span-4">
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
            {/* MongoDB এর image অথবা imageUrl প্যারামিটার ডাইনামিকলি ক্যাচ করার হ্যান্ডলার */}
            <Image src={book.image || book.imageUrl || book.coverImage || '/images/book-placeholder.jpg'} alt={book.title} fill priority sizes="(max-width: 768px) 100vw, 400px" className="object-cover" unoptimized />
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">{book.category}</span>
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-xs font-semibold text-amber-400"><Star className="w-4 h-4" /> {book.rating?.toFixed(1) || "5.0"} Rating</div>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">{book.title}</h1>
            <p className="text-slate-400 text-lg mt-2">by <span className="text-white font-semibold">{book.author}</span></p>
          </div>

          <hr className="border-white/10" />
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Synopsis</h3>
            <p className="text-slate-300 leading-relaxed">{book.description}</p>
          </div>

          <hr className="border-white/10" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs uppercase text-slate-500">Price</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">${book.price || book.fee || "0.00"}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs uppercase text-slate-500">Available</p>
              <p className={`text-3xl font-black mt-1 ${book.availableCopies > 0 || book.availableCopies === undefined ? 'text-emerald-400' : 'text-rose-400'}`}>{book.availableCopies ?? 1} / {book.totalCopies ?? 1}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs uppercase text-slate-500">Status</p>
              <p className={`mt-2 font-medium flex items-center gap-2 ${(book.availableCopies > 0 || book.availableCopies === undefined) ? 'text-emerald-400' : 'text-orange-400'}`}>
                {(book.availableCopies > 0 || book.availableCopies === undefined) ? <>Available Now</> : <>On Waiting List</>}
              </p>
            </div>
          </div>

          <div className="pt-6">
            {/* 🌟 এখানে কন্ডিশন পরিবর্তন করা হয়েছে: Admin অথবা Librarian হলে ম্যানেজমেন্ট বাটনগুলো দেখতে পাবেন */}
            {hasPrivilegedAccess ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <Link href={`/books/${book._id}/edit`} className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl text-sm shadow-lg"><PencilToSquare className="w-4 h-4" /> Edit Asset</Link>
                <form action={handleUnpublish} className="w-full"><button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-amber-600/20 border border-amber-500/30 text-amber-400 font-bold py-4 rounded-2xl text-sm"><EyeSlash className="w-4 h-4" /> Unpublish</button></form>
                <form action={handleDelete} className="w-full"><button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl text-sm shadow-lg"><TrashBin className="w-4 h-4" /> Delete Volume</button></form>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <form action={handleCheckout} className="flex-1"><button type="submit" className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-4 rounded-2xl transition shadow-lg text-sm">Order Now</button></form>
                <button type="button" className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-300"><Bookmark className="w-6 h-6" /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 💬 REVIEWS BOTTOM DISPLAY SECTION */}
      <div className="pt-8 border-t border-white/10 space-y-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Reader Reviews ({reviews.length})</h2>
          <p className="text-xs text-slate-500">Authentic insights from clients who explored this volume.</p>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/15 p-8 rounded-2xl text-center">
            <p className="text-slate-500 text-xs italic">No commentary logs active for this catalog node yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-400">
                      {rev.userName ? rev.userName[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{rev.userName || "Anonymous"}</h4>
                      <p className="text-[10px] text-slate-500">{rev.userEmail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{rev.date || "2026-06-21"}</span>
                </div>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed pl-9 font-sans">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;