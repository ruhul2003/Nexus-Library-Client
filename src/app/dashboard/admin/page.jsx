'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  LayoutCells, ShieldCheck, BookOpen, TrashBin, 
  Bars, Xmark, Persons, CirclePlus, PersonXmark,
  CircleCheck 
} from '@gravity-ui/icons';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [allBooks, setAllBooks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  const [adminUser, setAdminUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const verifyDatabaseRole = async () => {
      try {
        const activeAuthEmail = "admin@gmail.com"; 

        if (!activeAuthEmail) {
          setAdminUser(null);
          return;
        }
        const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiURL}/api/users/${activeAuthEmail}`);
        if (res.ok) {
          const dbUserData = await res.json();
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

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const booksRes = await fetch(`${apiURL}/api/Books`);
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setAllBooks(booksData);
      }

      const usersRes = await fetch(`${apiURL}/api/users`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(usersData);
      }
      const txRes = await fetch(`${apiURL}/api/admin/transactions`);
      if (txRes.ok) {
        const txData = await txRes.json();
        setAllTransactions(txData);
      }
    } catch (err) {
      console.error("System asset sync error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser && adminUser.role === 'admin') {
      fetchAdminData();
    }
  }, [adminUser]);

  const handleApprovePublish = async (bookId) => {
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiURL}/api/admin/books/${bookId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Published' })
      });
      if (!res.ok) throw new Error("Approval mutator failure");
      toast.success("Book approved and published successfully!");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm("Are you absolutely sure you want to purge this book volume ledger from database?")) return;
    try {
            const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiURL}/api/admin/books/${bookId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Delete book action failed");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
            const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiURL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
      });
      if (!res.ok) throw new Error("Role mutation failed");
      toast.success("User account successfully promoted to Admin authority!");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to permanently delete this account registry from the system?")) return;
    try {
      const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiURL}/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Account drop failed");
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalBooks = allBooks.length;
  const pendingApprovals = allBooks.filter(b => b.status === 'Pending Approval').length;
  const totalLibrarians = allUsers.filter(u => u.role === 'librarian').length;
  const totalReaders = allUsers.filter(u => u.role === 'reader' || !u.role).length;

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
                <p className="text-xs text-slate-400">Welcome, {adminUser.name}</p>
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
              { id: 'transactions', name: 'View All Transactions', icon: CircleCheck },
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

      <main className="flex-1 w-full min-w-0 p-6 md:p-10 space-y-8 overflow-y-auto max-w-[1600px] mx-auto">
        
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400">
            <Bars className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">Root Node Control System</h1>
          </div>
        </div>

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

        {activeTab === 'overview' && (
  <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
      System Overview Matrix
    </h3>

    {isLoading ? (
      <div className="h-80 flex items-center justify-center">
        <p className="text-slate-500 font-mono">Loading system telemetry...</p>
      </div>
    ) : (
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Clean Donut Chart */}
        <div className="relative w-80 h-80 flex-shrink-0 mx-auto lg:mx-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="#1f2937" 
              strokeWidth="16"
            />
            
            {(() => {
              const admins = allUsers.filter(u => u.role === 'admin').length;
              const librarians = allUsers.filter(u => u.role === 'librarian').length;
              const readers = allUsers.filter(u => !u.role || u.role === 'reader').length;
              
              const totalUsers = allUsers.length || 1;
              let offset = -90;
              const colors = ["#ef4444", "#a855f7", "#22d3ee"]; // Red, Purple, Cyan

              const segments = [
                { name: "Admins", value: admins, color: colors[0] },
                { name: "Librarians", value: librarians, color: colors[1] },
                { name: "Readers", value: readers, color: colors[2] }
              ].filter(s => s.value > 0);

              return segments.map((seg, index) => {
                const perc = (seg.value / totalUsers) * 100;
                const circumference = 2 * Math.PI * 42;
                const dash = `${(perc / 100) * circumference} ${circumference}`;
                const currentOffset = offset;
                offset += perc * 3.6;

                return (
                  <circle
                    key={index}
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="16"
                    strokeDasharray={dash}
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
            <p className="text-red-400 text-xs font-mono tracking-widest">TOTAL USERS</p>
            <p className="text-5xl font-black text-white mt-1">
              {allUsers.length}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Active Accounts
            </p>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="flex-1 pt-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-6 font-mono">
            User Role Distribution
          </p>

          {(() => {
            const admins = allUsers.filter(u => u.role === 'admin').length;
            const librarians = allUsers.filter(u => u.role === 'librarian').length;
            const readers = allUsers.filter(u => !u.role || u.role === 'reader').length;
            const colors = ["#ef4444", "#a855f7", "#22d3ee"];

            const items = [
              { name: "Administrators", value: admins, color: colors[0] },
              { name: "Librarians", value: librarians, color: colors[1] },
              { name: "Readers", value: readers, color: colors[2] }
            ].filter(item => item.value > 0);

            return items.map((item, index) => (
              <div key={index} className="flex items-center gap-5 mb-7 last:mb-0">
                <div 
                  className="w-6 h-6 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <p className="text-white text-base font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500 font-mono">System Access Level</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-xs text-slate-500">
                    {allUsers.length > 0 ? Math.round((item.value / allUsers.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            ));
          })()}

          {/* Extra Stats */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-amber-400">{pendingApprovals}</p>
              <p className="text-xs text-slate-500 mt-1">Pending Book Approvals</p>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-400">
                ${allTransactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0).toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total Revenue Generated</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)}

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

        {activeTab === 'transactions' && (
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-slate-900">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-300">Central System Financial Ledger</h2>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold bg-white/5">
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">User Email</th>
                    <th className="p-4">Librarian Email</th>
                    <th className="p-4">Amount ($)</th>
                    <th className="p-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan="5" className="p-4 text-center font-mono text-slate-500">Retrieving secure transaction history...</td></tr>
                  ) : allTransactions.length === 0 ? (
                    <tr><td colSpan="5" className="p-4 text-center font-mono text-slate-500">No transaction logs captured in the registry.</td></tr>
                  ) : (
                    allTransactions.map((tx) => (
                      <tr key={tx._id || tx.transactionId} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-mono text-indigo-400 font-semibold">{tx.transactionId || tx._id}</td>
                        <td className="p-4 text-white font-mono">{tx.userEmail || 'N/A'}</td>
                        <td className="p-4 text-slate-400 font-mono">{tx.librarianEmail || 'System / None'}</td>
                        <td className="p-4 text-emerald-400 font-bold">
                          ${parseFloat(tx.amount).toFixed(2)}
                        </td>
                        <td className="p-4 text-slate-400">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'Recent'}
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