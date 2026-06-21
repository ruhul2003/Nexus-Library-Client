'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Bookmark, LayoutCells, Pencil, TrashBin,      
  Bars, Xmark, CircleCheck, Receipt, Trolley
} from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

export default function UserReaderDashboard() {
  const sessionQuery = authClient.useSession();
  const user = sessionQuery.data?.user;
  const isLoadingSession = sessionQuery.isPending;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [searchQuery, setSearchQuery] = useState('');

  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  const API_BASE_URL = 'http://localhost:5000';

  // 1. Fetch User Orders
  useEffect(() => {
    if (user?.email) {
      setIsLoadingData(true);
      fetch(`${API_BASE_URL}/api/orders/my-orders/${user.email}`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setDeliveryHistory(data))
        .catch((err) => console.error("Error tracking orders:", err))
        .finally(() => setIsLoadingData(false));
    }
  }, [user?.email]);

  // 2. Fetch User Reviews dynamically from backend
  useEffect(() => {
    if (user?.email) {
      fetch(`${API_BASE_URL}/api/reviews/user/${user.email}`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setReviews(data))
        .catch((err) => console.error("Error fetching reviews:", err));
    }
  }, [user?.email, activeTab]);

  const booksReadCount = deliveryHistory.filter(item => item.status === 'Delivered').length;
  const pendingDeliveriesCount = deliveryHistory.filter(item => item.status !== 'Delivered').length;
  const totalFeesSpent = deliveryHistory.reduce((acc, item) => acc + (item.fee || 0), 0);
  
  // Delivered status ashle system dynamic data read korbe
  const readingList = deliveryHistory.filter(item => item.status === 'Delivered');

  const analyticalGraphData = deliveryHistory.map((item) => ({
    id: item._id,
    percentage: Math.min(100, Math.max(20, ((item.fee || 0) / 5) * 100))
  }));

  const filteredDeliveryHistory = deliveryHistory.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const formulas = {
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
    return `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md ${formulas[status] || 'bg-white/5 text-white'}`;
  };

  // Submit Review to Backend
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const payload = {
      bookId: selectedBookForReview.id || selectedBookForReview._id || selectedBookForReview.bookId, 
      bookTitle: selectedBookForReview.title,
      userEmail: user.email,
      userName: user.name || "Anonymous Reader",
      comment: reviewComment,
      rating: 5 
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        // Server array data mapping checking optimization
        const newReview = data.review || data;
        setReviews([...reviews, newReview]);
        setIsModalOpen(false);
        setReviewComment('');
        alert('Review published successfully!');
      } else {
        alert('Failed to publish review. Check backend console logs.');
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.comment);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: editText })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, comment: editText } : r));
        setEditingReviewId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingSession) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs tracking-widest text-slate-500 uppercase">Loading Session Node...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/20">L</div>
              <div>
                <h2 className="font-black tracking-tight text-sm">NEXUS_CORE</h2>
                <p className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">Library Pipeline</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
              <Xmark className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'overview', name: 'Dashboard Terminal', icon: LayoutCells },
              { id: 'delivery', name: 'Delivery History', icon: Receipt },
              { id: 'reading-list', name: 'My Reading List', icon: BookOpen },
              { id: 'reviews', name: 'My Reviews Ledger', icon: Bookmark },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white">
              <Bars className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">Reader Workspace</h1>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <CircleCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Books Read</p>
              <h3 className="text-xl font-black">{booksReadCount} Volumes</h3>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <Trolley className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Pending Deliveries</p>
              <h3 className="text-xl font-black">{pendingDeliveriesCount} Pipelines</h3>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Spent</p>
              <h3 className="text-xl font-black">${totalFeesSpent.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="h-44 bg-white/5 rounded-xl border border-white/5 flex items-end p-4 gap-2">
            {analyticalGraphData.map((node) => (
              <div key={node.id} style={{ height: `${node.percentage}%` }} className="w-full bg-indigo-500/30 rounded-md" />
            ))}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="overflow-x-auto bg-slate-900/20 border border-white/10 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400">
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDeliveryHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-white/5">
                    <td className="p-4 font-bold">{item.title}</td>
                    <td className="p-4">${item.fee?.toFixed(2)}</td>
                    <td className="p-4 text-right"><span className={getStatusBadge(item.status)}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 📚 TAB FEATURE 3: DYNAMIC DOCK SYSTEM */}
        {activeTab === 'reading-list' && (
          <div>
            {isLoadingData ? (
              <div className="text-center text-xs text-slate-500 py-12">Fetching dynamic pipelines...</div>
            ) : readingList.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12 border border-dashed border-white/5 rounded-2xl">
                No active volumes found under your delivery pipeline.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {readingList.map((book) => (
                  <div key={book._id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                    <div className="space-y-4">
                      <div className="w-full aspect-4/5 relative bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden">
                        {book.image || book.coverImage ? (
                          <Image 
                            src={book.image || book.coverImage} 
                            alt={book.title || "Book Cover"} 
                            fill
                            className="object-cover"
                            sizes="(max-w-768px) 100vw, 25vw"
                          />
                        ) : (
                          <BookOpen className="w-12 h-12 text-slate-800" />
                        )}
                        <span className="absolute bottom-3 right-3 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30 backdrop-blur-xs">Delivered</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{book.title}</h4>
                        {book.author && <p className="text-[10px] text-slate-500 mt-0.5">{book.author}</p>}
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedBookForReview(book); setIsModalOpen(true); }}
                      className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg cursor-pointer"
                    >
                      Write Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 📝 TAB FEATURE 4: SHOW SUBMITTED REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="font-bold text-sm uppercase text-slate-300">My Ledger Reviews</h2>
            {reviews.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12 border border-dashed border-white/5 rounded-2xl">
                No submitted logs found inside your review ledger.
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-sm text-white">{review.bookTitle}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{review.date || new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    {editingReviewId === review._id ? (
                      <div className="space-y-2 pt-1">
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-xs text-white focus:outline-hidden" rows={2} />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(review._id)} className="px-3 py-1 bg-indigo-600 text-[10px] rounded font-bold">Save</button>
                          <button onClick={() => setEditingReviewId(null)} className="px-3 py-1 bg-white/5 text-[10px] rounded">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">{review.comment}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* 🧾 MODAL INTERFACE FOR WRITING REVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm uppercase text-indigo-400">Write Critique Review</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><Xmark className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-400">Reviewing: <span className="text-white font-bold">{selectedBookForReview?.title}</span></p>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <textarea 
                placeholder="Share your thoughts about this book..." 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              />
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl transition">
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}