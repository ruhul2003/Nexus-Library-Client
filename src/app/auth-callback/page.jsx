'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Initializing verification matrix...");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        setStatusMessage("Fetching authenticated session...");
        const { data: session, error } = await authClient.getSession();

        if (error || !session) {
          console.error("Auth session sync error:", error);
          setStatusMessage("Authentication failed. Redirecting to login...");
          setTimeout(() => router.push('/login'), 1500);
          return;
        }

        setStatusMessage("Parsing security roles...");
        const rawRole = session?.user?.role || 'reader';
        const role = rawRole.toLowerCase().trim();

        // রোল অনুযায়ী ড্যাশবোর্ডে পাঠানো হচ্ছে
        if (role === 'admin') {
          router.push('/dashboard/admin');
        } else if (role === 'librarian') {
          router.push('/dashboard/librarian');
        } else {
          router.push('/dashboard/reader');
        }
        
        router.refresh();
      } catch (err) {
        console.error("Callback runtime exception:", err);
        router.push('/login');
      }
    };

    verifyAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="space-y-3 text-center">
        {/* একটি সিম্পল অ্যানিমেটেড লোডার */}
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-mono tracking-widest text-violet-400 uppercase animate-pulse">
          {statusMessage}
        </p>
      </div>
    </div>
  );
}