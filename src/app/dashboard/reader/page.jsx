'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BookOpen, Bookmark, LayoutCells, Pencil, TrashBin,      
  Bars, Xmark, CircleCheck, Receipt, Trolley,
  Flame, Star, GraduationCap
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

  // Reading Challenge State
  const [readingGoal, setReadingGoal] = useState(10);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(10);

  const API_BASE_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', []);

  // Update goal input when readingGoal changes
  const updateGoal = (newGoal) => {
    setReadingGoal(newGoal);
    setGoalInput(newGoal);
    if (user?.email) {
      localStorage.setItem(`nexus_reading_goal_${user.email}`, newGoal.toString());
    }
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    const newGoal = parseInt(goalInput, 10);
    if (isNaN(newGoal) || newGoal < 1) {
      toast.error('Goal must be at least 1 book.');
      return;
    }
    updateGoal(newGoal);
    setIsEditingGoal(false);
    toast.success(`Annual reading target updated to ${newGoal} books!`);
  };

  useEffect(() => {
    if (!user?.email) return;

    const cleanEmail = user.email.trim().toLowerCase();
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/my-orders/${cleanEmail}`);
        const data = res.ok ? await res.json() : [];
        if (isMounted) {
          setDeliveryHistory(data);
        }
      } catch (err) {
        console.error("Error tracking orders:", err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.email, API_BASE_URL]);

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
  const reviewsCount = reviews.length;

  // Reading Challenge metrics
  const challengeProgress = Math.min(100, Math.round((booksReadCount / (readingGoal || 1)) * 100));
  const booksRemaining = Math.max(0, readingGoal - booksReadCount);

  const getRankInfo = (count) => {
    if (count >= 10) return { title: 'Grandmaster Archivist', level: 'Level 5', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    if (count >= 5) return { title: 'Nexus Scholar', level: 'Level 4', badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    if (count >= 3) return { title: 'Bookworm Specialist', level: 'Level 3', badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
    if (count >= 1) return { title: 'Apprentice Reader', level: 'Level 2', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    return { title: 'Novice Explorer', level: 'Level 1', badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40' };
  };

  const userRank = getRankInfo(booksReadCount);

  const badges = [
    {
      id: 'first_book',
      title: 'First Page Turned',
      description: 'Borrowed & completed your first library volume.',
      icon: '🌟',
      unlocked: booksReadCount >= 1,
      progress: `${Math.min(1, booksReadCount)}/1 Books`,
    },
    {
      id: 'bookworm',
      title: 'Avid Bookworm',
      description: 'Completed 3 or more library volumes.',
      icon: '📚',
      unlocked: booksReadCount >= 3,
      progress: `${Math.min(3, booksReadCount)}/3 Books`,
    },
    {
      id: 'nexus_scholar',
      title: 'Nexus Scholar',
      description: 'Completed 5 or more library volumes.',
      icon: '🏆',
      unlocked: booksReadCount >= 5,
      progress: `${Math.min(5, booksReadCount)}/5 Books`,
    },
    {
      id: 'critique_specialist',
      title: 'Critique Specialist',
      description: 'Published 1 or more book reviews in the ledger.',
      icon: '✍️',
      unlocked: reviewsCount >= 1,
      progress: `${Math.min(1, reviewsCount)}/1 Reviews`,
    },
    {
      id: 'thought_leader',
      title: 'Thought Leader',
      description: 'Published 3 or more book reviews.',
      icon: '💬',
      unlocked: reviewsCount >= 3,
      progress: `${Math.min(3, reviewsCount)}/3 Reviews`,
    },
    {
      id: 'vip_patron',
      title: 'VIP Patron',
      description: 'Invested over $20 in library services & books.',
      icon: '💎',
      unlocked: totalFeesSpent >= 20,
      progress: `$${totalFeesSpent.toFixed(0)}/$20 Spent`,
    },
  ];

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
              { id: 'challenge', name: 'Reading Challenge', icon: Flame },
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

        {/* Loading Spinner for Data Fetch */}
        {isLoadingData && (
          <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Fetching Reader Data...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <CircleCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Books Read</p>
              <h3 className="text-xl font-black">{booksReadCount} Volumes</h3>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md">
            <Flame className="w-5 h-5 text-violet-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Annual Goal</p>
              <h3 className="text-xl font-black">{booksReadCount}/{readingGoal} ({challengeProgress}%)</h3>
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

        {/* READING CHALLENGE TAB VIEW */}
        {activeTab === 'challenge' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* HERO GOAL & RANK BANNER */}
            <div className="bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/70 border border-violet-500/20 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-3 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${userRank.badgeBg}`}>
                      {userRank.level}: {userRank.title}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Annual Challenge</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    2026 Reading Milestone Tracker
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    Set your reading targets, earn prestigious library badges, and elevate your reader rank as you complete digital volumes.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <button
                      onClick={() => setIsEditingGoal(true)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-violet-600/20 flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Adjust Annual Goal ({readingGoal} Books)
                    </button>
                  </div>
                </div>

                {/* CIRCULAR PROGRESS DISPLAY */}
                <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1e1b4b" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="10"
                      strokeDasharray={`${(challengeProgress / 100) * (2 * Math.PI * 42)} ${2 * Math.PI * 42}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-3xl font-black text-white">{challengeProgress}%</p>
                    <p className="text-[10px] text-violet-300 font-mono uppercase tracking-wider mt-0.5">
                      {booksReadCount} / {readingGoal} Books
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">
                      {booksRemaining === 0 ? "🎉 Goal Achieved!" : `${booksRemaining} Remaining`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GAMIFIED BADGES MATRIX */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" /> Achievement Badges Ledger
                  </h3>
                  <p className="text-xs text-slate-400">Unlock dynamic badges as you read, write reviews, and support the library.</p>
                </div>
                <span className="text-xs font-mono text-violet-400 font-bold">
                  {badges.filter(b => b.unlocked).length} / {badges.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`rounded-2xl p-5 border transition-all relative overflow-hidden backdrop-blur-md ${
                      badge.unlocked
                        ? 'bg-gradient-to-b from-violet-950/40 to-slate-900 border-violet-500/40 shadow-lg shadow-violet-950/30'
                        : 'bg-slate-900/30 border-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        badge.unlocked
                          ? 'bg-violet-600/20 border border-violet-500/30 ring-2 ring-violet-500/20'
                          : 'bg-slate-800/60 border border-white/5 grayscale'
                      }`}>
                        {badge.icon}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-white' : 'text-slate-300'}`}>
                            {badge.title}
                          </h4>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            badge.unlocked
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-white/5'
                          }`}>
                            {badge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 leading-snug">
                          {badge.description}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Requirement:</span>
                          <span className={badge.unlocked ? 'text-violet-300 font-bold' : 'text-slate-400'}>
                            {badge.progress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MILESTONE ROADMAP */}
            <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                Reader Rank Progression Pathway
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                {[
                  { level: 'Novice', req: '0 Books', icon: '🌱' },
                  { level: 'Apprentice', req: '1+ Books', icon: '📖' },
                  { level: 'Bookworm', req: '3+ Books', icon: '📚' },
                  { level: 'Scholar', req: '5+ Books', icon: '🎓' },
                  { level: 'Grandmaster', req: '10+ Books', icon: '👑' },
                ].map((tier, idx) => {
                  const isCurrent = (
                    (idx === 0 && booksReadCount === 0) ||
                    (idx === 1 && booksReadCount >= 1 && booksReadCount < 3) ||
                    (idx === 2 && booksReadCount >= 3 && booksReadCount < 5) ||
                    (idx === 3 && booksReadCount >= 5 && booksReadCount < 10) ||
                    (idx === 4 && booksReadCount >= 10)
                  );

                  return (
                    <div
                      key={tier.level}
                      className={`p-3 rounded-xl border text-xs flex flex-col items-center justify-center space-y-1 ${
                        isCurrent
                          ? 'bg-violet-600/20 border-violet-500 text-white font-bold ring-2 ring-violet-500/20'
                          : 'bg-white/5 border-white/5 text-slate-400'
                      }`}
                    >
                      <span className="text-xl">{tier.icon}</span>
                      <p className="font-bold">{tier.level}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{tier.req}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB VIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* READING CHALLENGE COMPACT SUMMARY CARD */}
            <div className="bg-gradient-to-r from-violet-950/40 via-slate-900 to-indigo-950/40 border border-violet-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xl shrink-0">
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">Annual Reading Goal Progress</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${userRank.badgeBg}`}>
                      {userRank.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Completed <strong className="text-white">{booksReadCount}</strong> of <strong className="text-white">{readingGoal}</strong> books ({challengeProgress}% target reached).
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('challenge')}
                className="px-4 py-2 bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white border border-violet-500/40 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
              >
                View Full Challenge Ledger & Badges →
              </button>
            </div>

            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
              Core Investment Activity Node
            </h2>

            {isLoadingData ? (
              <div className="h-96 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-md">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Loading Investment Metrics...</p>
                <p className="text-[10px] text-slate-500 mt-2">Enriching order data</p>
              </div>
            ) : enrichedDeliveryHistory.length === 0 ? (
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
                              key={`chart-${index}`}
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
                            <div key={`legend-${index}`} className="flex items-center gap-4">
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

        {/* DELIVERY TAB VIEW */}
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
                  filteredDeliveryHistory.map((item, idx) => (
                    <tr key={item._id || item.id || `order-${idx}`} className="hover:bg-white/5 transition-colors">
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

        {/* READING LIST TAB VIEW */}
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
                  <div key={book._id || book.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 transition-all backdrop-blur-md">
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

        {/* REVIEWS TAB VIEW */}
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

      {/* EDIT READING GOAL MODAL */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-violet-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm uppercase text-violet-400 flex items-center gap-2">
                <Flame className="w-4 h-4" /> Adjust Annual Reading Target
              </h3>
              <button onClick={() => setIsEditingGoal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <Xmark className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Books for 2026
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-full bg-slate-950 border border-white/15 rounded-xl p-3 text-white text-base focus:outline-none focus:border-violet-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Challenge yourself! Progress and badges update dynamically as you finish books.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-lg shadow-violet-600/20"
                >
                  Save Annual Goal
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
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