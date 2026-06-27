'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, Bookmark, LayoutCells, Pencil, TrashBin,      
  Bars, Xmark, CircleCheck, Receipt, Trolley
} from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function UserReaderDashboard() {
  const sessionQuery = authClient.useSession();
  const user = sessionQuery.data?.user;
  const isLoadingSession = sessionQuery.isPending;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [searchQuery, setSearchQuery] = useState('');

  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [enrichedDeliveryHistory, setEnrichedDeliveryHistory] = useState([]);
  const [enrichedReadingList, setEnrichedReadingList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchUserOrders = useCallback((isBackground = false) => {
    if (!user?.email) return;
    if (!isBackground) {
      setIsLoadingData(true);
    }

    const cleanEmail = user.email.trim().toLowerCase();

    fetch(`${API_BASE_URL}/api/orders/my-orders/${cleanEmail}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setDeliveryHistory(data))
      .catch((err) => console.error("Error tracking orders:", err))
      .finally(() => {
        if (!isBackground) setIsLoadingData(false);
      });
  }, [user?.email, API_BASE_URL]);

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders(false);
    }
  }, [fetchUserOrders, user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    const interval = setInterval(() => {
      fetchUserOrders(true); 
    }, 8000);
    return () => clearInterval(interval);
  }, [user?.email, fetchUserOrders]);

  useEffect(() => {
    let isMounted = true;
    
    const enrichOrders = async () => {
      if (deliveryHistory.length === 0) {
        if (isMounted) {
          setEnrichedDeliveryHistory([]);
          setEnrichedReadingList([]);
        }
        return;
      }

      const enriched = await Promise.all(
        deliveryHistory.map(async (order) => {
          try {
            const targetBookId = order.bookId || order.id || order._id;
            if (!targetBookId || targetBookId === 'null') return order;

            const res = await fetch(`${API_BASE_URL}/api/books/${targetBookId}`);
            if (res.ok) {
              const bookData = await res.json();
              return { 
                ...bookData,          
                ...order,             
                title: bookData.title || order.title || "Unknown Book Node", 
                status: order.status || 'Paid'
              };
            }
            return order;
          } catch (err) {
            console.error("Failed to enrich book payload:", err);
            return order;
          }
        })
      );

      if (isMounted) {
        setEnrichedDeliveryHistory(enriched);
        const delivered = enriched.filter(item => item.status === 'Delivered');
        setEnrichedReadingList(delivered);
      }
    };

    enrichOrders();
    return () => {
      isMounted = false;
    };
  }, [deliveryHistory, API_BASE_URL]);

  useEffect(() => {
    if (user?.email) {
      const cleanEmail = user.email.trim().toLowerCase();
      fetch(`${API_BASE_URL}/api/reviews/user/${cleanEmail}`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setReviews(data))
        .catch((err) => console.error("Error fetching reviews:", err));
    }
  }, [user?.email, API_BASE_URL]);

  const booksReadCount = enrichedReadingList.length;
  const pendingDeliveriesCount = enrichedDeliveryHistory.filter(item => item.status !== 'Delivered').length;
  const totalFeesSpent = enrichedDeliveryHistory.reduce((acc, item) => acc + (Number(item.fee) || 0), 0);

  const analyticalGraphData = enrichedDeliveryHistory.map((item) => ({
    id: item._id || Math.random().toString(),
    percentage: Math.min(100, Math.max(20, ((Number(item.fee) || 0) / 5) * 100))
  }));

  const filteredDeliveryHistory = enrichedDeliveryHistory.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const formulas = {
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
    return `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md ${formulas[status] || 'bg-white/5 text-white/60 border-white/10'}`;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim() || !selectedBookForReview || !user?.email) return;

    const payload = {
      bookId: selectedBookForReview.bookId || selectedBookForReview._id,
      bookTitle: selectedBookForReview.title,
      userEmail: user.email.toLowerCase().trim(),
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
        const newReview = data.review || data;
        setReviews([...reviews, newReview]);
        setIsModalOpen(false);
        setReviewComment('');
        toast.success('Review published successfully!');
      } else {
        toast.error('Failed to publish review.');
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error('Terminal runtime error during publication.');
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);
    setEditText(review.comment);
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: editText })
      });
      if (res.ok) {
        setReviews(reviews.map(r => r._id === id ? { ...r, comment: editText } : r));
        setEditingReviewId(null);
        toast.success('Review registry updated.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm("Delete this review from ledger logs?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== id));
        toast.success('Review removed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs font-mono tracking-widest text-slate-500 uppercase animate-pulse">
        Loading Session Node...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs font-mono tracking-wider text-slate-400 uppercase">
        Access Denied. Missing Authorization Instance.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex selection:bg-indigo-500/30">
      
      {/* SIDEBAR COMPONENT */}
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
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white cursor-pointer">
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
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer">
              <Bars className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">Reader Workspace</h1>
          </div>
          <div className="flex items-center gap-2">
             <input type="text" placeholder="Search parameters..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="bg-slate-900 border border-white/15 px-3 py-1.5 text-xs rounded-lg focus:outline-hidden focus:border-indigo-500 w-44 md:w-60"/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <CircleCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Books Read</p>
              <h3 className="text-xl font-black">{booksReadCount} Volumes</h3>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <Trolley className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Pending Deliveries</p>
              <h3 className="text-xl font-black">{pendingDeliveriesCount} Pipelines</h3>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Spent</p>
              <h3 className="text-xl font-black">${totalFeesSpent.toFixed(2)}</h3>
            </div>
          </div>
        </div>

{activeTab === 'overview' && (
  <div className="space-y-6">
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
      Core Investment Activity Node
    </h2>

    {enrichedDeliveryHistory.length === 0 ? (
      <div className="h-64 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-xs text-slate-600 font-mono uppercase">
        No telemetry metrics logged.
      </div>
    ) : (
      <div className="bg-slate-900/20 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
          
          {/* Main Donut Chart - Merged by Title */}
          <div className="relative w-64 h-64 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#1f2937" 
                strokeWidth="8"
              />
              
              {(() => {
                // Group by title and sum fees
                const grouped = enrichedDeliveryHistory.reduce((acc, order) => {
                  const title = order.title?.trim() || "Unknown";
                  if (!acc[title]) {
                    acc[title] = { title, fee: 0 };
                  }
                  acc[title].fee += Number(order.fee) || 0;
                  return acc;
                }, {});

                const groupedArray = Object.values(grouped);
                const colorMap = new Map();
                const colors = ["#6366f1", "#a855f7", "#22d3ee", "#ec4899", "#eab308"];
                let colorIndex = 0;

                groupedArray.forEach(item => {
                  if (!colorMap.has(item.title)) {
                    colorMap.set(item.title, colors[colorIndex % colors.length]);
                    colorIndex++;
                  }
                });

                const total = totalFeesSpent || 1;
                let offset = 0;

                return groupedArray.map((item, index) => {
                  const percentage = (item.fee / total) * 100;
                  const circumference = 2 * Math.PI * 45;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  
                  const strokeColor = colorMap.get(item.title);
                  const currentOffset = offset;
                  offset += percentage * 3.6;

                  return (
                    <circle
                      key={index}
                      cx="50" cy="50" r="45"
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={currentOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  );
                });
              })()}
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-slate-500 font-mono">TOTAL SPENT</p>
              <p className="text-4xl font-black text-white mt-1">
                ${totalFeesSpent.toFixed(2)}
              </p>
              <p className="text-emerald-400 text-sm font-medium mt-1">
                {enrichedDeliveryHistory.length} Orders
              </p>
            </div>
          </div>

          {/* Legend - Grouped by Title */}
          <div className="flex-1 max-w-md">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-mono">Spending Breakdown</p>
            
            <div className="space-y-5">
              {(() => {
                const grouped = enrichedDeliveryHistory.reduce((acc, order) => {
                  const title = order.title?.trim() || "Unknown";
                  if (!acc[title]) {
                    acc[title] = { title, fee: 0, status: order.status };
                  }
                  acc[title].fee += Number(order.fee) || 0;
                  return acc;
                }, {});

                const groupedArray = Object.values(grouped)
                  .sort((a, b) => b.fee - a.fee)
                  .slice(0, 6);

                const colorMap = new Map();
                const colors = ["#6366f1", "#a855f7", "#22d3ee", "#ec4899", "#eab308"];
                let colorIndex = 0;

                groupedArray.forEach(item => {
                  if (!colorMap.has(item.title)) {
                    colorMap.set(item.title, colors[colorIndex % colors.length]);
                    colorIndex++;
                  }
                });

                return groupedArray.map((item, index) => {
                  const total = totalFeesSpent || 1;
                  const percent = Math.round((item.fee / total) * 100);
                  const strokeColor = colorMap.get(item.title);

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-11 h-11 flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="3"/>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={strokeColor} strokeWidth="3" strokeDasharray={`${percent}, 100`} strokeLinecap="round"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                          {percent}%
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          ${item.fee.toFixed(2)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-slate-400">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        {activeTab === 'delivery' && (
          <div className="overflow-x-auto bg-slate-900/20 border border-white/10 rounded-2xl backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-slate-300">
                {filteredDeliveryHistory.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-600 uppercase tracking-wide font-sans">No records mapped to criteria.</td>
                  </tr>
                ) : (
                  filteredDeliveryHistory.map((item) => (
                    <tr key={item._id || Math.random().toString()} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold font-sans text-slate-200">{item.title}</td>
                      <td className="p-4 text-slate-400">${(Number(item.fee) || 0).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <span className={getStatusBadge(item.status)}>{item.status || 'Paid'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reading-list' && (
          <div>
            {isLoadingData ? (
              <div className="text-center text-xs text-slate-500 py-12 font-mono animate-pulse">Fetching dynamic pipelines...</div>
            ) : enrichedReadingList.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12 border border-dashed border-white/10 rounded-2xl font-mono uppercase">
                No active volumes found under your delivery pipeline.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {enrichedReadingList.map((book) => (
                  <div key={book._id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-all backdrop-blur-md">
                    <div className="space-y-4">
                      <div className="w-full aspect-4/5 relative bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                        {book.imageUrl || book.image || book.coverImage ? (
                          <Image 
                            src={book.imageUrl || book.image || book.coverImage} 
                            alt={book.title || "Book Cover"} 
                            fill
                            className="object-cover"
                            sizes="(max-w-768px) 100vw, 25vw"
                          />
                        ) : (
                          <BookOpen className="w-12 h-12 text-slate-800" />
                        )}
                        <span className="absolute bottom-3 right-3 bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-500/30 backdrop-blur-md">Delivered</span>
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

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <h2 className="font-bold text-sm uppercase text-slate-300">My Ledger Reviews</h2>
            </div>
            {reviews.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12 border border-dashed border-white/10 rounded-2xl font-mono uppercase">
                No submitted logs found inside your review ledger.
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex justify-between items-start gap-4 backdrop-blur-md">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-sm text-white">{review.bookTitle}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                         <button onClick={()=>handleStartEdit(review)} className="p-1 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5"/></button>
                         <button onClick={()=>handleDeleteReview(review._id)} className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"><TrashBin className="w-3.5 h-3.5"/></button>
                      </div>
                    </div>
                    {editingReviewId === review._id ? (
                      <div className="space-y-2 pt-1">
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-xs text-white focus:outline-hidden" rows={2} />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(review._id)} className="px-3 py-1 bg-indigo-600 text-[10px] rounded font-bold cursor-pointer">Save</button>
                          <button onClick={() => setEditingReviewId(null)} className="px-3 py-1 bg-white/5 text-[10px] rounded cursor-pointer">Cancel</button>
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

      {/* MODAL ARCHITECTURE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm uppercase text-indigo-400">Write Critique Review</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><Xmark className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-400">Reviewing: <span className="text-white font-bold">{selectedBookForReview?.title}</span></p>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <textarea 
                placeholder="Share your thoughts about this book..." 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-indigo-500 resize-none"
              />
              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/10">
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}