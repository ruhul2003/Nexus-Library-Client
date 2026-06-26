'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutCells, ArrowLeft, TriangleExclamation } from '@gravity-ui/icons';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Grids & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content Card */}
      <div className="relative z-10 text-center max-w-md w-full space-y-8 bg-slate-900/40 border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl backdrop-blur-md">
        
        {/* Animated Error Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/5 animate-pulse">
            <TriangleExclamation className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-slate-500 selection:bg-indigo-500">
            404
          </h1>
          <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">
            Route Matrix Mismatch
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            The requested document index or directory node does not exist within the active registry registry.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Step Back
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <LayoutCells className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>

      {/* Subtle Terminal Status Footer */}
      <div className="absolute bottom-6 text-[10px] text-slate-600 font-mono tracking-widest uppercase pointer-events-none">
        Error_Code: ERR_NODE_NOT_FOUND // Layer_404
      </div>
    </div>
  );
}