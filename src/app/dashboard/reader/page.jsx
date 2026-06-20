'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Bookmark, LayoutCells, Person, Pencil, TrashBin,      
  Bars, Xmark, ShieldCheck, CircleCheck, Receipt, Trolley, Magnifier
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

  // My Reviews Local State Architecture
  const [reviews, setReviews] = useState([
    { id: 1, title: "The Clean Architecture Guide", date: "2026-05-10", comment: "Absolutely essential reading for structuring decoupled Next.js systems." }
  ]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');

  // 1. Fetch user records using native fetch
  useEffect(() => {
    if (user?.email) {
      setIsLoadingData(true);
      
      fetch(`http://localhost:5000/api/orders/my-orders/${user.email}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP network error: Status ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setDeliveryHistory(data))
        .catch((err) => console.error("Database connection fault tracking orders:", err))
        .finally(() => setIsLoadingData(false));
    }
  }, [user?.email]);

  // 2. Computed Analytics Engine Metrics
  const booksReadCount = deliveryHistory.filter(item => item.status === 'Delivered').length;
  const pendingDeliveriesCount = deliveryHistory.filter(item => item.status !== 'Delivered').length;
  const totalFeesSpent = deliveryHistory.reduce((acc, item) => acc + (item.fee || 0), 0);

  // Derived Reading List (Only item packages successfully delivered)
  const readingList = deliveryHistory.filter(item => item.status === 'Delivered');

  const analyticalGraphData = deliveryHistory.map((item) => ({
    id: item._id,
    percentage: Math.min(100, Math.max(20, ((item.fee || 0) / 5) * 100))
  }));

  const filteredDeliveryHistory = deliveryHistory.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const formulas = {
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
    return `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md ${formulas[status] || 'bg-white/5 text-white'}`;
  };

  // Review Pipeline Handlers
  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditText(review.comment);
  };

  const handleSaveEdit = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, comment: editText } : r));
    setEditingReviewId(null);
    setEditText('');
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* Responsive Sidebar Layout Container */}
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

          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Person className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              {isLoadingSession ? (
                <div className="h-3 w-20 bg-white/10 animate-pulse rounded" />
              ) : (
                <p className="font-bold text-xs truncate">{user?.name || "Anonymous Reader"}</p>
              )}
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                Active Client
              </span>
            </div>
          </div>

          {/* Extended Route Navigation Channels */}
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

      {/* Main Content Dashboard Frame */}
      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">
        
        {/* Mobile Header Toolbar Integration */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white">
              <Bars className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">Reader Workspace</h1>
              
            </div>
          </div>

          {/* Dynamic Data Filter Input Field */}
          {['delivery', 'reading-list'].includes(activeTab) && (
            <div className="relative max-w-xs w-full hidden sm:block">
              <Magnifier className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search catalog titles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-hidden focus:border-indigo-500 text-white placeholder-slate-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Dynamic Aggregated Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CircleCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Books Read</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">{isLoadingData ? "..." : `${booksReadCount} Volumes`}</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trolley className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending Deliveries</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">{isLoadingData ? "..." : `${pendingDeliveriesCount} Pipelines`}</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Spent on Fees</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">${totalFeesSpent.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* TAB FEATURE 1: Overview Analytical Chart Panel */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-900/20 border border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-indigo-400 mb-4">Fee Distribution Analytics</h3>
              {analyticalGraphData.length === 0 ? (
                <p className="text-slate-500 text-xs italic py-4">No structural nodes catalogued to display metrics.</p>
              ) : (
                <div className="h-44 bg-linear-to-b from-white/5 to-transparent rounded-xl border border-white/5 relative flex items-end p-4 gap-2">
                  {analyticalGraphData.map((node) => (
                    <div key={node.id} style={{ height: `${node.percentage}%` }} className="w-full bg-indigo-500/30 rounded-md hover:bg-indigo-500/50 transition-all" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB FEATURE 2: Distribution Ledger Logs Table */}
        {activeTab === 'delivery' && (
          <div className="bg-slate-900/20 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-slate-900/40">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">Distribution Ledger Logs</h2>
            </div>
            {filteredDeliveryHistory.length === 0 ? (
              <p className="text-slate-500 text-xs italic p-6 text-center">No transactions registered.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                      <th className="p-4">Book Title Target</th>
                      <th className="p-4">Delivery Fee</th>
                      <th className="p-4">Date Stamp</th>
                      <th className="p-4 text-right">Routing Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDeliveryHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">{item.title || "Standard Catalog Volume"}</td>
                        <td className="p-4 font-medium text-slate-300">${item.fee?.toFixed(2)}</td>
                        <td className="p-4 text-slate-400">{item.date || "2026-06-21"}</td>
                        <td className="p-4 text-right"><span className={getStatusBadge(item.status)}>{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB FEATURE 3: My Reading List Gallery Matrix View */}
        {activeTab === 'reading-list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">My Settled Reading List</h2>
            </div>
            {isLoadingData ? (
              <p className="text-slate-500 text-xs animate-pulse">Syncing catalog cards...</p>
            ) : readingList.length === 0 ? (
              <div className="bg-slate-900/20 border border-dashed border-white/10 p-10 rounded-2xl text-center">
                <p className="text-slate-500 text-xs italic">No books successfully cleared routing gates to your active reading list yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {readingList.map((book) => (
                  <div key={book._id} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
                    <div className="p-5 space-y-4">
                      <div className="w-full aspect-[4/5] relative bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center text-slate-700">
                        <BookOpen className="w-12 h-12 text-slate-800 group-hover:scale-110 transition-transform duration-300" />
                        <span className="absolute bottom-3 right-3 bg-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border border-emerald-500/30">Cleared</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{book.title || "Decoupled Architecture Volume"}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Asset Reference: #{book._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white/2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Fee: ${(book.fee || 0).toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">Returned/Settled</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB FEATURE 4: My Reviews Editorial Manager Ledger */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">My Book Critic Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-xs italic py-4">No reviews logged into the system databanks.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-slate-900 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-md">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-xs md:text-sm text-white">{review.title}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{review.date}</span>
                      </div>
                      
                      {editingReviewId === review.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea 
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-indigo-500 font-sans"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEdit(review.id)} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 font-bold text-[10px] rounded-md uppercase tracking-wider transition-colors">Save updates</button>
                            <button onClick={() => setEditingReviewId(null)} className="px-3 py-1 bg-white/5 hover:bg-white/10 font-bold text-[10px] rounded-md uppercase tracking-wider transition-colors">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{review.comment}</p>
                      )}
                    </div>

                    {editingReviewId !== review.id && (
                      <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                        <button onClick={() => handleStartEdit(review)} className="p-2 bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-400 rounded-xl transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteReview(review.id)} className="p-2 bg-white/5 hover:bg-rose-600/20 border border-white/5 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 rounded-xl transition-all">
                          <TrashBin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}