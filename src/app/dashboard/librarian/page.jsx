'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutCells, CircleCheck, Trolley, Receipt, ShieldCheck,
  BookOpen, Plus, CirclePlus, TrashBin, Pencil, Bars, Xmark, Picture
} from '@gravity-ui/icons';
import Image from 'next/image';
export default function LibrarianDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Book Form State Matrix
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', fee: '', category: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmittingBook, setIsSubmittingBook] = useState(false);

  // 1. Core Fetch Systems
  const fetchLibrarianLogs = () => {
    setIsLoading(true);
    // Fetch order delivery pipelines
    fetch('http://localhost:5000/api/librarian/orders')
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setAllOrders(data))
      .catch((err) => console.error("Could not fetch log lines:", err));

    // Fetch librarian personal inventory matrix
    fetch('http://localhost:5000/api/librarian/books')
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => setInventory(data))
      .catch((err) => console.error("Could not fetch inventory:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLibrarianLogs();
  }, []);

  // 2. Mutate Order Deliveries State Pipeline
  const mutateOrderStatus = async (id, targetStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!res.ok) throw new Error(`Mutation failed: ${res.status}`);
      fetchLibrarianLogs();
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Toggle Inventory Visibility (Published / Unpublished)
  const toggleBookStatus = async (bookId, currentStatus) => {
    if (currentStatus === 'Pending Approval') return; // Enforced constraint protection
    const nextStatus = currentStatus === 'Published' ? 'Unpublished' : 'Published';

    try {
      const res = await fetch(`http://localhost:5000/api/books/${bookId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Visibility mutation error");
      fetchLibrarianLogs();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Handle Book Form Submission with external imgBB API upload
// 4. Handle Book Form Submission with external imgBB API upload
  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check: Validate the binary asset file is ready
    if (!selectedFile) {
      return alert("Please select a book cover thumbnail asset file.");
    }

    setIsSubmittingBook(true);
    try {
      // Step A: Upload file asset binary to imgBB API engine
      const imgFormData = new FormData();
      imgFormData.append('image', selectedFile);

      const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'e7136009a2b53733c373a00b0ad8cdba';
      const imgBBRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imgFormData
      });
      
      const imgBBData = await imgBBRes.json();
      
      // Safety check: Check if imgBB hosted the URL successfully 
      if (!imgBBData.success || !imgBBData.data?.url) {
        throw new Error("Asset hosting pipeline verification failure - Image URL missing.");
      }

      const uploadedImageUrl = imgBBData.data.url;

      // Step B: Explicitly assemble payload fields to prevent empty string overrides
      const bookPayload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        fee: parseFloat(formData.fee) || 0,
        image: uploadedImageUrl, // Explicit assignment
        status: 'Pending Approval'
      };

      // Safety check: Final firewall verification against empty string src injection
      if (!bookPayload.image || bookPayload.image === "") {
        throw new Error("Payload aborted: Image field resolved to an empty string.");
      }

      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookPayload)
      });

      if (!res.ok) {
        throw new Error(`Database rejected ledger ingestion. Status: ${res.status}`);
      }

      alert("Book logged into approval queue pipeline!");
      
      setFormData({ title: '', author: '', description: '', fee: '', category: '' });
      setSelectedFile(null);
      
      fetchLibrarianLogs();
      setActiveTab('inventory');
      
    } catch (err) {
      console.error("Operational pipeline error:", err);
      alert(`Add book error: ${err.message || "Internal system channel failure."}`);
    } finally {
      setIsSubmittingBook(false);
    }
  };
  const totalBooksListed = inventory.length;
  const totalEarnings = allOrders.reduce((acc, item) => acc + (item.fee || 0), 0);
  const activePendingRequests = allOrders.filter(o => o.status === 'Pending').length;

  const analyticalChartBars = allOrders.map((item) => ({
    id: item._id,
    height: Math.min(100, Math.max(15, ((item.fee || 0) / 10) * 100))
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-black shadow-md">L</div>
              <div>
                <h2 className="font-black tracking-tight text-sm">LIBRARIAN</h2>
                <p className="text-[10px] font-bold tracking-wider text-amber-500 uppercase">System Panel</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
              <Xmark className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', name: 'Overview Terminal', icon: LayoutCells },
              { id: 'add-book', name: 'Add Book Ingest', icon: CirclePlus },
              { id: 'inventory', name: 'Manage Inventory', icon: BookOpen },
              { id: 'deliveries', name: 'Manage Deliveries', icon: Trolley },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">

        {/* Dynamic Mobile Navbar Header Area */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white">
            <Bars className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">System Control Core</h1>
          </div>
        </div>

        {/* Global Dashboard Metrics Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Books Listed</p>
              <h3 className="text-xl font-black">{totalBooksListed} Volumes</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Gross Cumulative Earnings</p>
              <h3 className="text-xl font-black">${totalEarnings.toFixed(2)} USD</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trolley className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Pending Request Loops</p>
              <h3 className="text-xl font-black">{activePendingRequests} Nodes</h3>
            </div>
          </div>
        </div>

        {/* VIEW TAB 1: Overview Analytics Graphics Panel */}
        {activeTab === 'overview' && (
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Distribution Ledger Matrix</h3>
            {analyticalChartBars.length === 0 ? (
              <p className="text-slate-500 text-xs italic py-4">No data logged metrics present.</p>
            ) : (
              <div className="h-40 bg-linear-to-b from-white/5 to-transparent rounded-xl border border-white/5 relative flex items-end p-4 gap-2">
                {analyticalChartBars.map((node) => (
                  <div key={node.id} style={{ height: `${node.height}%` }} className="w-full bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/10 transition-all rounded" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW TAB 2: Ingest New Volume Forms System */}
        {activeTab === 'add-book' && (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 max-w-2xl shadow-xl">
            <div className="mb-6">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-200">Catalog Registry Form Ingestion</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Newly logged items enter the database defaulted as 'Pending Approval'.</p>
            </div>
            <form onSubmit={handleAddBookSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Book Title Target</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-500" placeholder="e.g. Clean Architecture Core" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Author Authority Name</label>
                  <input type="text" required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-500" placeholder="e.g. Robert C. Martin" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">System Delivery Access Fee (USD)</label>
                  <input type="number" step="0.01" required value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-500" placeholder="5.00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-semibold">Category Segment Class</label>
                  <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-500" placeholder="e.g. Software Engineering" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Narrative Description Analysis</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-hidden focus:border-amber-500" rows={4} placeholder="Summarize text parameters..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Cover Thumbnail Binary File Asset</label>
                <div className="border border-dashed border-white/10 rounded-xl bg-slate-950 p-4 text-center relative flex flex-col items-center justify-center gap-2 hover:bg-slate-900/50 transition-colors">
                  <input type="file" accept="image/*" required onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Picture className="w-6 h-6 text-slate-500" />
                  <span className="text-slate-400 font-mono tracking-tight">{selectedFile ? selectedFile.name : "Choose network file asset image package..."}</span>
                </div>
              </div>

              <button type="submit" disabled={isSubmittingBook} className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-black font-black uppercase tracking-wider rounded-xl transition-all">
                {isSubmittingBook ? "Uploading to imgBB hosting databases..." : "Commit Asset to System Ledger"}
              </button>
            </form>
          </div>
        )}

        {/* VIEW TAB 3: Manage Inventory Matrix Table */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-slate-900">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-300">Registered Volumes Ingestion Log</h2>
            </div>
            {inventory.length === 0 ? (
              <p className="p-6 text-xs text-slate-500 text-center italic">No book volumes found linked to your credentials.</p>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                      <th className="p-4">Volume Book Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status Flag Node</th>
                      <th className="p-4 text-right">Ledger Processing Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventory.map((book) => (
                      <tr key={book._id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{book.title}</td>
                        <td className="p-4 text-slate-400">{book.category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] border font-bold uppercase tracking-wider rounded-md ${book.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              book.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                'bg-slate-800 text-slate-400 border-white/5'
                            }`}>
                            {book.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            disabled={book.status === 'Pending Approval'}
                            onClick={() => toggleBookStatus(book._id, book.status)}
                            className="px-3 py-1 bg-white/5 border border-white/5 hover:border-amber-500/30 font-bold text-[10px] uppercase tracking-wider rounded-md disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          >
                            {book.status === 'Published' ? "Unpublish" : "Publish Toggle"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW TAB 4: Manage Deliveries Inbound Channels Table */}
        {activeTab === 'deliveries' && (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-slate-900">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-300">Active Request Fulfillment Pipeline Queue</h2>
            </div>
            {allOrders.length === 0 ? (
              <p className="p-6 text-xs text-slate-500 text-center italic">No active fulfillment pipeline elements logged inside database lines.</p>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                      <th className="p-4">Client Target Account</th>
                      <th className="p-4">Book Title Anchor</th>
                      <th className="p-4">Pipeline Node Status</th>
                      <th className="p-4 text-right">Routing Gate Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{order.userEmail}</td>
                        <td className="p-4 text-slate-400">
                          {order.bookTitle || order.title || "Catalog Volume Package"}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] border font-bold uppercase tracking-wider rounded-md ${order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              order.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {order.status === 'Pending' && (
                            <button onClick={() => mutateOrderStatus(order._id, 'Dispatched')} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                              Approve & Dispatch
                            </button>
                          )}
                          {order.status === 'Dispatched' && (
                            <button onClick={() => mutateOrderStatus(order._id, 'Delivered')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                              Mark Delivered
                            </button>
                          )}
                          {order.status === 'Delivered' && (
                            <span className="text-slate-500 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Settled Node
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}