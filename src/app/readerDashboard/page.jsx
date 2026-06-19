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
  ArrowLeftBox,
  TriangleUpFill
} from '@gravity-ui/icons';

// Dummy data for a professional library layout
const activeLoans = [
  { id: 1, title: "The Clean Architecture Guide", author: "Robert C. Martin", dueDate: "2026-07-10", progress: 65, category: "Tech" },
  { id: 2, title: "Design Systems in Production", author: "Alla Kholmatova", dueDate: "2026-06-28", progress: 12, category: "Design" },
];

const readingHistory = [
  { id: 101, title: "Refactoring UI", author: "Adam Wathan", returnDate: "2026-05-14", status: "Completed" },
  { id: 102, title: "Don't Make Me Think", author: "Steve Krug", returnDate: "2026-04-02", status: "Completed" },
];

export default function ReaderDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  return (
    <div className="bg-transparent w-10/12 mx-auto mt-16 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Dashboard Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Reader</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your digital checkout ledger and active learning tracks.</p>
        </div>
        
        {/* Dynamic Quick Search Bar inside Dashboard */}
        <div className="relative w-full md:w-80">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Magnifier className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog or authors..."
            className="w-full pl-11 pr-4 py-2 bg-white/5 focus:bg-white/10 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* 2. Analytical Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Loans</p>
            <h3 className="text-2xl font-bold mt-0.5">2</h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TriangleUpFill className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Completion Rate</p>
            <h3 className="text-2xl font-bold mt-0.5">88%</h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Days Till Overdue</p>
            <h3 className="text-2xl font-bold mt-0.5">9 Days</h3>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Saved Items</p>
            <h3 className="text-2xl font-bold mt-0.5">14 Books</h3>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Active Materials Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Currently Reading</h2>
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutCells className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            /* Grid View Presentation */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {activeLoans.map((book) => (
                <div key={book.id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-all rounded-2xl p-5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                        {book.category}
                      </span>
                      <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {book.dueDate}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-white leading-tight mb-1 group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                    <p className="text-xs text-slate-400 mb-6">{book.author}</p>
                  </div>
                  
                  {/* Digital Progress Slider Visualization */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Reading Progress</span>
                      <span className="text-white">{book.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${book.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View Presentation */
            <div className="space-y-3">
              {activeLoans.map((book) => (
                <div key={book.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">{book.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{book.author}</p>
                  </div>
                  <div className="w-32 hidden sm:block">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${book.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right text-xs shrink-0">
                    <p className="text-white font-medium">Due {book.dueDate}</p>
                    <p className="text-slate-400 text-[10px]">{book.progress}% done</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Column: History logs and quick links */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight">Recent Returns</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            {readingHistory.map((history) => (
              <div key={history.id} className="flex items-start justify-between gap-3 border-b border-white/5 last:border-0 pb-3 last:pb-0">
                <div>
                  <h4 className="font-semibold text-sm text-white leading-tight">{history.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{history.author}</p>
                  <p className="text-[10px] text-slate-500 mt-2">Returned on {history.returnDate}</p>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                  {history.status}
                </span>
              </div>
            ))}

            <button className="w-full mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5 group py-2 border border-dashed border-white/10 rounded-xl hover:bg-white/5">
              View Complete History
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}