'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Bookmark, 
  Clock, 
  Magnifier, 
  ArrowRight, 
  LayoutCells,    
  LayoutList, 
  ArrowUpRight,  
  Person,
  Pencil,
  TrashBin,       
  Bars,          
  Xmark,          
  ShieldCheck, 
  CircleCheck, 
  ShoppingBag,    
  Receipt,
  Trolley
} from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';

export default function UserReaderDashboard() {

    const user = authClient.useSession().data?.user;
    console.log(user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('overview'); // overview | delivery | gallery | reviews
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const [reviews, setReviews] = useState([
    { id: 1, title: "The Clean Architecture Guide", rating: 5, date: "2026-05-10", comment: "Absolutely essential reading for structuring decoupled Next.js systems." },
    { id: 2, title: "Refactoring UI", rating: 4, date: "2026-04-18", comment: "Practical visual advice. Completely reshaped how I think about dark-mode layout spacing." }
  ]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');

  const deliveryHistory = [
    { id: 401, title: "Designing Data-Intensive Applications", fee: "$2.50", date: "2026-06-15", status: "Delivered" },
    { id: 402, title: "Compilers: Principles, Techniques, and Tools", fee: "$4.00", date: "2026-06-19", status: "Dispatched" },
    { id: 403, title: "Microservices Architecture Patterns", fee: "$1.75", date: "2026-06-20", status: "Pending" }
  ];

  const readingListGallery = [
    { id: 501, title: "Design Systems in Production", author: "Alla Kholmatova", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300", category: "Design" },
    { id: 502, title: "Don't Make Me Think", author: "Steve Krug", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300", category: "UX Research" },
    { id: 503, title: "The Clean Architecture Guide", author: "Robert C. Martin", image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300", category: "Tech" }
  ];

  // Inline functional components mapping status tokens to styled badges
  const getStatusBadge = (status) => {
    const formulas = {
      Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Dispatched: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
    return `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md ${formulas[status] || 'bg-white/5 text-white'}`;
  };

  // Review Edit/Mutation Pipeline functions
  const startEdit = (id, currentText) => {
    setEditingReviewId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, comment: editText } : r));
    setEditingReviewId(null);
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* ========================================================================= */}
      {/* SIDEBAR BLOCK: Fixed layout architecture matching multi-role platforms     */}
      {/* ========================================================================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          {/* Platform Identity Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-indigo-600/20">
                L
              </div>
              <div>
                <h2 className="font-black tracking-tight text-sm">NEXUS_CORE</h2>
                <p className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">Library Pipeline</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
              <Xmark className="w-5 h-5" />
            </button>
          </div>

          {/* User Account Persona Information Card */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Person className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs truncate">{user?.name}</p>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                Reader Tier 1
              </span>
            </div>
          </div>

          {/* Navigational Tab Selectors Matrix */}
          <nav className="space-y-1">
            {[
              { id: 'overview', name: 'Dashboard Terminal', icon: LayoutCells },
              { id: 'delivery', name: 'Delivery History', icon: Receipt },
              { id: 'gallery', name: 'My Reading List', icon: BookOpen },
              { id: 'reviews', name: 'My Review Logs', icon: Bookmark },
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

        {/* Global Operational Security Footprints */}
        <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 text-[10px] font-medium uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Terminal Sec_Verified</span>
        </div>
      </aside>

      {/* Backdrop for structural off-canvas mobile drawer viewports */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden" />
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE AREA FRAMEWORK: Flex-1 container handling tabs and stats        */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">
        
        {/* Header Block with Mobile Menu Trigger toggle bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white">
              <Bars className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">Reader Workspace</h1>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">Manage digital checkout pipelines, routing states, and data ledgers.</p>
            </div>
          </div>

          <div className="relative hidden md:block w-72">
            <Magnifier className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query structural logs..."
              className="w-full pl-11 pr-4 py-1.5 bg-white/5 focus:bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Analytical Metric Matrix Dashboard Cards Block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CircleCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Books Read</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">18 Volumes</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trolley className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending Deliveries</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">1 Pipeline</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Spent on Fees</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">$14.25</h3>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEWPORTS TAB PORT: Condition-based panel engine rendering active states */}
        {/* ========================================================================= */}
        
        {/* TAB 1: OVERVIEW TERMINAL */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900/20 border border-white/10 rounded-2xl p-6">
              <h3 className="text-base font-bold uppercase tracking-wider text-indigo-400 mb-4">Total Volumes Catalogued Graph Mock</h3>
              <div className="h-44 bg-linear-to-b from-white/5 to-transparent rounded-xl border border-white/5 relative overflow-hidden flex items-end p-4 gap-2">
                {/* Embedded Analytical Graph nodes leveraging pure CSS structures */}
                <div className="w-full bg-indigo-500/30 h-[40%] rounded-md hover:bg-indigo-500/50 transition-all" />
                <div className="w-full bg-indigo-500/30 h-[65%] rounded-md hover:bg-indigo-500/50 transition-all" />
                <div className="w-full bg-indigo-500/40 h-[50%] rounded-md hover:bg-indigo-500/50 transition-all" />
                <div className="w-full bg-indigo-500/60 h-[85%] rounded-md hover:bg-indigo-500/50 transition-all" />
                <div className="w-full bg-indigo-600 h-[70%] rounded-md relative shadow-lg shadow-indigo-600/20">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELIVERY REGISTRATION HISTORY TABLE */}
        {activeTab === 'delivery' && (
          <div className="bg-slate-900/20 border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-5 border-b border-white/5 bg-slate-900/40">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">Distribution Ledger Logs</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                    <th className="p-4">Book Title Identifier</th>
                    <th className="p-4">Delivery Fee</th>
                    <th className="p-4">Request Date Stamp</th>
                    <th className="p-4 text-right">Routing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {deliveryHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</td>
                      <td className="p-4 font-medium text-slate-300">{item.fee}</td>
                      <td className="p-4 text-slate-400">{item.date}</td>
                      <td className="p-4 text-right"><span className={getStatusBadge(item.status)}>{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: READING LIST GALLERY MATRIX */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">Fulfilled Asset Gallery</h2>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                  <LayoutCells className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                  <LayoutCells className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {readingListGallery.map((book) => (
                  <div key={book.id} className="group relative bg-slate-900/40 border border-white/10 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="h-44 w-full relative bg-slate-950 overflow-hidden">
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <span className="absolute bottom-3 left-4 text-[9px] font-black uppercase tracking-widest bg-indigo-600 border border-indigo-400/30 px-2 py-0.5 rounded-md">
                        {book.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight group-hover:text-indigo-400 transition-colors">{book.title}</h4>
                        <p className="text-slate-400 text-xs mt-1">{book.author}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md inline-flex items-center gap-1.5 w-max">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" /> Settled / Returned
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {readingListGallery.map((book) => (
                  <div key={book.id} className="bg-slate-900/30 border border-white/10 p-3 rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate">{book.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{book.author}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md shrink-0">
                      {book.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY REVIEWS CRITICAL OPERATIONS INTERFACE */}
        {activeTab === 'reviews' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2">Personal Review Audit Registers</h2>
            
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-xs italic py-4">No validation text instances found inside catalog nodes.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 space-y-3 shadow-xl backdrop-blur-xs relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div>
                        <h4 className="font-bold text-white text-sm">{rev.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Logs committed on {rev.date}</p>
                      </div>
                      
                      {/* Operational Crud Command triggers */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        {editingReviewId === rev.id ? (
                          <button onClick={() => saveEdit(rev.id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-md transition-colors">
                            Commit Save
                          </button>
                        ) : (
                          <button onClick={() => startEdit(rev.id, rev.comment)} className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-md border border-white/5 transition-colors" title="Edit Log">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => deleteReview(rev.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-md border border-rose-500/20 transition-colors" title="Purge Record">
                          <TrashBin className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Operational Dynamic Editable Text Segment Block */}
                    {editingReviewId === rev.id ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-3 bg-slate-950 border border-indigo-500 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-slate-300 leading-relaxed font-normal bg-white/2 p-3 rounded-xl border border-white/5">
                        `{rev.comment}`
                      </p>
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