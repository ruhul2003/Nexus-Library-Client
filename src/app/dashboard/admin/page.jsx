'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutCells, ShieldCheck, BookOpen, TrashBin, 
  Bars, Xmark, Persons, CirclePlus, PersonXmark 
} from '@gravity-ui/icons';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core Matrix States
  const [allBooks, setAllBooks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Live DB Authorization States
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 1. Live Database Authorization Pipeline
  useEffect(() => {
    const verifyDatabaseRole = async () => {
      try {
        // Change this email string dynamically if tying into an external 
        // global Auth state context later, or keep as your seed admin email.
        const activeAuthEmail = "admin@gmail.com"; 

        if (!activeAuthEmail) {
          setAdminUser(null);
          return;
        }

        // Fetch live validation parameter options straight from MongoDB user schema
        const res = await fetch(`http://localhost:5000/api/users/${activeAuthEmail}`);
        if (res.ok) {
          const dbUserData = await res.json();
          console.log("Database Verified Core Credentials:", dbUserData);
          setAdminUser(dbUserData);
        } else {
          setAdminUser(null);
        }
      } catch (err) {
        console.error("Database auth validation bridge failed:", err);
        setAdminUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    verifyDatabaseRole();
  }, []);

  // 2. Core Operational Data Sync Panel Fetcher
  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const booksRes = await fetch('http://localhost:5000/api/Books');
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setAllBooks(booksData);
      }

      const usersRes = await fetch('http://localhost:5000/api/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(usersData);
      }
    } catch (err) {
      console.error("System asset sync error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger metrics reload only if the authenticated account matches the required role
  useEffect(() => {
    if (adminUser && adminUser.role === 'admin') {
      fetchAdminData();
    }
  }, [adminUser]);

  // 3. Control Pipeline Actions (Books Mutators)
  const handleApprovePublish = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/books/${bookId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Published' })
      });
      if (!res.ok) throw new Error("Approval mutator failure");
      alert("Book approved and published successfully!");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm("Are you absolutely sure you want to purge this book volume ledger from database?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/books/${bookId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Delete book action failed");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Control Pipeline Actions (User Management Mutators)
  const handleMakeAdmin = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
      });
      if (!res.ok) throw new Error("Role mutation failed");
      alert("User account successfully promoted to Admin authority!");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this account registry from the system?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Account drop failed");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Derived Metrics Calculations
  const totalBooks = allBooks.length;
  const pendingApprovals = allBooks.filter(b => b.status === 'Pending Approval').length;
  const totalLibrarians = allUsers.filter(u => u.role === 'librarian').length;
  const totalReaders = allUsers.filter(u => u.role === 'reader' || !u.role).length;

  // Render Gatekeepers
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xs font-mono animate-pulse tracking-widest text-red-500">QUERYING DATABASE AUTH PERMISSIONS...</p>
      </div>
    );
  }

  if (!adminUser || adminUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-4 font-black">403</div>
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Unauthorized Core Entry</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">Your live database document does not have admin permissions.</p>
        
        <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl text-left max-w-xs font-mono text-[10px] text-slate-400">
          <p>Detected Role: <span className="text-amber-400">{adminUser?.role || 'undefined/none'}</span></p>
          <p>Logged Email: <span>{adminUser?.email || 'none'}</span></p>
        </div>

        <button onClick={() => router.push('/')} className="px-4 py-2 bg-red-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-400 transition-all">
          Exit Base Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* Sidebar Layout Navigation Grid */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center font-black text-black shadow-md">A</div>
              <div>
                <h2 className="font-black tracking-tight text-sm uppercase">Admin Panel</h2>
                <p className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Live DB Verified</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white">
              <Xmark className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', name: 'Overview Console', icon: LayoutCells },
              { id: 'manage-books', name: 'Manage Book Logs', icon: BookOpen },
              { id: 'manage-users', name: 'User Management', icon: Persons },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-red-500 text-black shadow-lg shadow-red-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Workspace Terminal */}
      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">
        
        {/* Dynamic Header */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400">
            <Bars className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">Root Node Control System</h1>
          </div>
        </div>

        {/* Global Overview Information Metrics Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><BookOpen className="w-5 h-5"/></div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total System Volumes</p>
              <h3 className="text-xl font-black">{isLoading ? "..." : totalBooks}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><CirclePlus className="w-5 h-5"/></div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Approval Queues</p>
              <h3 className="text-xl font-black text-amber-400">{isLoading ? "..." : pendingApprovals}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><Persons className="w-5 h-5"/></div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Librarians</p>
              <h3 className="text-xl font-black">{isLoading ? "..." : totalLibrarians}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Persons className="w-5 h-5"/></div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Readers</p>
              <h3 className="text-xl font-black">{isLoading ? "..." : totalReaders}</h3>
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW METRIC DECORATION */}
        {activeTab === 'overview' && (
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 text-center py-12">
            <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1">System Core Status: Secure</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">All system routes, inventory data segments, and client accounts are functioning normally within operating baseline guidelines.</p>
          </div>
        )}

        {/* TAB 2: MANAGE BOOKS MATRIX (APPROVAL, EDIT, DELETE) */}
        {activeTab === 'manage-books' && (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-slate-900">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-300">Global Book Asset Ledger Ingestions</h2>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                    <th className="p-4">Volume Book Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Administrative Interventions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan="5" className="p-4 text-center font-mono text-slate-500">Syncing matrix inventory lines...</td></tr>
                  ) : allBooks.length === 0 ? (
                    <tr><td colSpan="5" className="p-4 text-center font-mono text-slate-500">No logs returned from catalog document mapping.</td></tr>
                  ) : (
                    allBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-white">{book.title}</td>
                        <td className="p-4 text-slate-400">{book.author}</td>
                        <td className="p-4 text-slate-400">{book.category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] border font-bold uppercase tracking-wider rounded-md ${
                            book.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>{book.status}</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {book.status === 'Pending Approval' && (
                            <button onClick={() => handleApprovePublish(book._id)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                              Approve & Publish
                            </button>
                          )}
                          <button onClick={() => handleDeleteBook(book._id)} className="px-2.5 py-1 bg-white/5 border border-white/5 hover:border-red-500 text-red-400 font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                            <TrashBin className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USER ACCOUNT MATRIX (ROLE PROMOTION & ACCOUNT PURGE) */}
        {activeTab === 'manage-users' && (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-slate-900">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-300">User Account Authentication Directory</h2>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                    <th className="p-4">User Account Address</th>
                    <th className="p-4">Access Permission Level (Role)</th>
                    <th className="p-4 text-right">Root Actions Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan="3" className="p-4 text-center font-mono text-slate-500">Querying live authorization registry values...</td></tr>
                  ) : allUsers.length === 0 ? (
                    <tr><td colSpan="3" className="p-4 text-center font-mono text-slate-500">No profile signatures found in data collection index.</td></tr>
                  ) : (
                    allUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-mono text-white">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] border font-bold uppercase tracking-wider rounded-md ${
                            user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            user.role === 'librarian' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>{user.role || 'reader'}</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {user.role !== 'admin' && (
                            <button onClick={() => handleMakeAdmin(user._id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                              Make Admin
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(user._id)} className="px-2.5 py-1 bg-white/5 border border-white/5 hover:border-red-500 text-red-500 font-bold text-[10px] uppercase tracking-wider rounded-md transition-all">
                            <PersonXmark className="w-3.5 h-3.5 inline" /> Purge Account
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}