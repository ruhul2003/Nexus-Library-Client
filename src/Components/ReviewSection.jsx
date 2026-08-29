'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, Trash2, Edit3, Lock, Check, X, Sparkles } from 'lucide-react';

export default function ReviewSection({ bookId, bookTitle, initialReviews = [] }) {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment before submitting.');
      return;
    }
    if (!currentUser?.email) {
      toast.error('You must be signed in to post a review.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      bookId: String(bookId),
      bookTitle: bookTitle || 'Library Asset',
      userEmail: currentUser.email.toLowerCase().trim(),
      userName: currentUser.name || currentUser.email.split('@')[0] || 'Anonymous',
      comment: comment.trim(),
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
    };

    try {
      // First attempt Next.js API route
      let res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Fallback to direct external API if Next.js route fails
      if (!res.ok) {
        const externalApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        res = await fetch(`${externalApi}/api/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        const createdReview = data.review || data.data || { ...payload, _id: data._id || Date.now().toString() };
        setReviews([createdReview, ...reviews]);
        setComment('');
        setRating(5);
        toast.success('Your review has been published successfully!');
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Network error during review submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditComment(review.comment || '');
    setEditRating(Number(review.rating) || 5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditComment('');
    setEditRating(5);
  };

  const handleUpdate = async (id) => {
    if (!editComment.trim()) {
      toast.error('Review text cannot be empty.');
      return;
    }
    setIsUpdating(true);
    try {
      let res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: editComment.trim(), rating: editRating }),
      });

      if (!res.ok) {
        const externalApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        res = await fetch(`${externalApi}/api/reviews/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: editComment.trim(), rating: editRating }),
        });
      }

      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, comment: editComment.trim(), rating: editRating } : r));
        setEditingId(null);
        toast.success('Review updated successfully.');
      } else {
        toast.error('Could not update review.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving review update.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      let res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const externalApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        res = await fetch(`${externalApi}/api/reviews/${id}`, { method: 'DELETE' });
      }

      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== id));
        toast.success('Review deleted.');
      } else {
        toast.error('Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error removing review.');
    }
  };

  return (
    <section className="pt-10 border-t border-white/10 space-y-8 animate-in fade-in duration-500">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
            Reader Reviews & Ratings
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Community ratings and honest reviews for <span className="text-indigo-300 font-semibold">{bookTitle}</span>.
          </p>
        </div>

        {/* Aggregate Score Pill */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 px-4 py-2 rounded-2xl shadow-inner">
          <div className="flex items-center gap-1 font-black text-2xl text-amber-400">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            {avgRating}
          </div>
          <div className="text-left border-l border-white/10 pl-3">
            <div className="text-xs font-bold text-slate-200">{totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}</div>
            <div className="text-[10px] text-slate-400">Verified Readers</div>
          </div>
        </div>
      </div>

      {/* Ratings Analytics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
          <div className="text-5xl font-black text-white">{avgRating}</div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">Based on {totalReviews} rating{totalReviews === 1 ? '' : 's'}</span>
        </div>

        <div className="md:col-span-8 space-y-2.5 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 flex items-center gap-1 font-semibold text-slate-300">
                  {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-slate-400">{count} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Card / Auth CTA */}
      {currentUser ? (
        <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900/60 to-slate-950/80 border border-indigo-500/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Write a Reader Review
            </h3>
            <span className="text-xs text-slate-400">
              Logged in as <strong className="text-white">{currentUser.name || currentUser.email}</strong>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Star Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
              <label className="text-xs font-semibold text-slate-300">Select Rating:</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-400 ml-2">
                {hoverRating || rating} / 5 Stars
              </span>
            </div>

            {/* Comment Area */}
            <div className="relative">
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={800}
                placeholder="Share your thoughts on this volume, readability, target audience, or technical insights..."
                className="w-full bg-slate-950/70 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <div className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-500">
                {comment.length} / 800
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition text-xs uppercase tracking-wider active:scale-95"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-dashed border-white/10 rounded-3xl p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Sign in to leave a review</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You must be an authenticated member to publish reader reviews and rate items in the Universal Catalog.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          All Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/10 p-10 rounded-3xl text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-xs font-medium">No reviews posted yet.</p>
            <p className="text-slate-500 text-[11px]">Be the first reader to share feedback on this book!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {reviews.map((rev) => {
                const isOwner = currentUser?.email && rev.userEmail && 
                  currentUser.email.toLowerCase().trim() === rev.userEmail.toLowerCase().trim();
                const isEditingThis = editingId === rev._id;

                return (
                  <motion.div
                    key={rev._id || `${rev.userEmail}-${rev.date}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 space-y-3 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-sm text-indigo-300">
                          {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-200">{rev.userName || 'Anonymous Reader'}</h4>
                            {isOwner && (
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono">{rev.userEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Rating Display */}
                        <div className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rev.rating || 5}
                        </div>

                        {/* Owner Actions */}
                        {isOwner && !isEditingThis && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(rev)}
                              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition"
                              title="Edit Review"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(rev._id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Body or Edit Form */}
                    {isEditingThis ? (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-300">Edit Rating:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditRating(star)}
                                onMouseEnter={() => setEditHoverRating(star)}
                                onMouseLeave={() => setEditHoverRating(0)}
                                className="p-0.5"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= (editHoverRating || editRating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          rows={3}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-lg transition"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdate(rev._id)}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                          >
                            <Check className="w-3.5 h-3.5" /> {isUpdating ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans pl-1">
                        {rev.comment}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5">
                      <span>{rev.date || 'Recent review'}</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

    </section>
  );
}
