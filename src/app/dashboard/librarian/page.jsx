'use client';

import { useState } from 'react';
import {Image} from 'next/image';
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
  Plus,
  ArrowDownLeft,
  CircleExclamation
} from '@gravity-ui/icons';
import { authClient } from '@/lib/auth-client';

export default function LibrarianAdminDashboard() {
  const user = authClient.useSession().data?.user;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog'); // catalog | inventory_requests | telemetry
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Core administrative states
  const [catalog, setCatalog] = useState([
    { id: 9, title: "The Lean Startup", author: "Eric Ries", category: "Business", availableCopies: 0, totalCopies: 3, price: "$4.99", coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300" },
    { id: 10, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", category: "Tech", availableCopies: 5, totalCopies: 8, price: "$8.50", coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300" },
    { id: 11, title: "Compilers: Principles, Techniques, and Tools", author: "Alfred Aho", category: "Tech", availableCopies: 2, totalCopies: 2, price: "$12.00", coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300" }
  ]);

  const [distributionRequests, setDistributionRequests] = useState([
    { id: 1001, title: "The Lean Startup", requester: "Reader #408", date: "2026-06-20", type: "Checkout Request", status: "Awaiting Action" },
    { id: 1002, title: "Designing Data-Intensive Applications", requester: "Reader #112", date: "2026-06-19", type: "Return Processing", status: "In Inspection" }
  ]);

  const telemetryLogs = [
    { id: "LOG-992", event: "Database Cluster Synchronized", component: "PostgreSQL Replica", timestamp: "13:28:44", status: "Success" },
    { id: "LOG-993", event: "Checkout Failure - Zero Available Volume", component: "Pipeline Core", timestamp: "13:30:12", status: "Warning" },
    { id: "LOG-994", event: "Auth Token Rotation Handshake completed", component: "NextAuth Engine", timestamp: "13:31:57", status: "Success" }
  ];

  // Pipeline execution methods
  const updateAvailableStock = (id, delta) => {
    setCatalog(catalog.map(book => {
      if (book.id === id) {
        const nextStock = Math.max(0, Math.min(book.totalCopies, book.availableCopies + delta));
        return { ...book, availableCopies: nextStock };
      }
      return book;
    }));
  };

  const processRequest = (requestId, disposition) => {
    setDistributionRequests(distributionRequests.map(req => 
      req.id === requestId ? { ...req, status: disposition } : req
    ));
  };

  const getStatusBadge = (status) => {
    const schemas = {
      "Awaiting Action": "bg-amber-500/10 text-amber-400 border-amber-500/20",
      "In Inspection": "bg-blue-500/10 text-blue-400 border-blue-500/20",
      "Approved": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      "Rejected": "bg-rose-500/10 text-rose-400 border-rose-500/20",
      "Success": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      "Warning": "bg-amber-500/10 text-amber-400 border-amber-500/20"
    };
    return `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md ${schemas[status] || 'bg-white/5 text-white'}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* ========================================================================= */}
      {/* SIDEBAR BLOCK: Librarian Admin Framework                                 */}
      {/* ========================================================================= */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          {/* Identity Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center font-black text-white shadow-md shadow-violet-600/20">
                Ω
              </div>
              <div>
                <h2 className="font-black tracking-tight text-sm">NEXUS_CORE</h2>
                <p className="text-[10px] font-bold tracking-wider text-violet-400 uppercase">Admin Terminal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
              <Xmark className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
              <Person className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs truncate">{user?.name || "System Admin"}</p>
              <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold uppercase px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                Staff / Librarian
              </span>
            </div>
          </div>

          {/* Navigational Tabs Selector */}
          <nav className="space-y-1">
            {[
              { id: 'catalog', name: 'Master Catalog Ledger', icon: BookOpen },
              { id: 'inventory_requests', name: 'Distribution Pipeline', icon: ShoppingBag },
              { id: 'telemetry', name: 'Core System Telemetry', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/15' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Security Metrics Footprint */}
        <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 text-[10px] font-medium uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Root Access Verified</span>
        </div>
      </aside>

      {/* Mobile Drawer viewport Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden" />
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE AREA FRAMEWORK                                                 */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">
        
        {/* Workspace Top Header Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white">
              <Bars className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">Librarian Operations</h1>
              <p className="text-slate-400 text-xs md:text-sm mt-0.5">Control storage clusters, authorize logistics routing, and evaluate data footprints.</p>
            </div>
          </div>

          <div className="relative hidden md:block w-72">
            <Magnifier className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query master registers..."
              className="w-full pl-11 pr-4 py-1.5 bg-white/5 focus:bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Analytical Metric Matrix Dashboard Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Catalog Entities</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">{catalog.length} Unique Titles</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Pipeline Demands</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">{distributionRequests.filter(r => r.status.includes('Awaiting') || r.status.includes('Inspection')).length} Unsettled</h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aggregated Digital Asset Value</p>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mt-0.5">$314.50</h3>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE MODULE VIEWPORTS                                                  */}
        {/* ========================================================================= */}
        
        {/* TAB 1: MASTER CATALOG ENTRIES CONTROL */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">Storage Core Indexes</h2>
                <button className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-600 hover:bg-violet-500 rounded-md font-bold text-[10px] uppercase tracking-wide transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Initialize New Volume
                </button>
              </div>
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400'}`}>
                  <LayoutCells className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400'}`}>
                  <LayoutList className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catalog.map((book) => (
                  <div key={book.id} className="group relative bg-slate-900/40 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="h-44 w-full relative bg-slate-950 overflow-hidden">
                      <Image src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <span className="absolute bottom-3 left-4 text-[9px] font-black uppercase tracking-widest bg-violet-600 border border-violet-400/30 px-2 py-0.5 rounded-md">
                        {book.category}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight group-hover:text-violet-400 transition-colors">{book.title}</h4>
                        <p className="text-slate-400 text-xs mt-1">{book.author}</p>
                      </div>
                      
                      {/* Inventory Adjustments Pipeline HUD */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Allocated Vault Stock</p>
                          <p className="text-sm font-black tracking-tight text-slate-200 mt-0.5">
                            <span className={book.availableCopies === 0 ? "text-rose-400" : "text-emerald-400"}>{book.availableCopies}</span> / {book.totalCopies} Available
                          </p>
                        </div>
                        <div className="flex gap-1 bg-slate-950/60 p-1 border border-white/5 rounded-lg">
                          <button onClick={() => updateAvailableStock(book.id, -1)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-xs transition-colors" title="Decrement Internal Stock">-</button>
                          <button onClick={() => updateAvailableStock(book.id, 1)} className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center font-bold text-xs transition-colors" title="Increment Internal Stock">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {catalog.map((book) => (
                  <div key={book.id} className="bg-slate-900/30 border border-white/10 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-white truncate">{book.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{book.author} — <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-md">{book.category}</span></p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-300">{book.availableCopies}/{book.totalCopies} Units Available</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Rental Base Fee: {book.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE LEASE AND LEAVE VERIFICATION LOGISTICS */}
        {activeTab === 'inventory_requests' && (
          <div className="bg-slate-900/20 border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-5 border-b border-white/5 bg-slate-900/40">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300">Distribution Queue Pipeline</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                    <th className="p-4">Requested Asset Identifier</th>
                    <th className="p-4">Consumer Target</th>
                    <th className="p-4">Transaction Type</th>
                    <th className="p-4">Pipeline Status Check</th>
                    <th className="p-4 text-right">Administrative Execution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {distributionRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-bold text-white group-hover:text-violet-400 transition-colors">{req.title}</td>
                      <td className="p-4 font-medium text-slate-300">{req.requester}</td>
                      <td className="p-4 text-slate-400 font-mono text-[11px]">{req.type}</td>
                      <td className="p-4"><span className={getStatusBadge(req.status)}>{req.status}</span></td>
                      <td className="p-4 text-right">
                        {(req.status === 'Awaiting Action' || req.status === 'In Inspection') ? (
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => processRequest(req.id, 'Approved')} className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-md transition-colors">
                              Approve
                            </button>
                            <button onClick={() => processRequest(req.id, 'Rejected')} className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-400 font-bold text-[10px] uppercase border border-rose-500/20 rounded-md transition-colors">
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Handshake Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INFRASTRUCTURE CORE TELEMETRY METRICS */}
        {activeTab === 'telemetry' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2">Active Infrastructure Telemetry Registers</h2>
            
            <div className="space-y-3">
              {telemetryLogs.map((log) => (
                <div key={log.id} className="bg-slate-900/40 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {log.status === 'Success' ? (
                      <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <CircleExclamation className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="text-slate-500 font-bold mr-2">[{log.id}]</span>
                      <span className="text-slate-200 font-semibold">{log.event}</span>
                      <span className="text-slate-500 ml-2">({log.component})</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                    <span className={getStatusBadge(log.status)}>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}