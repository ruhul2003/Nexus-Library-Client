import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '../../../lib/stripe';
import { CircleCheck, LayoutCells } from '@gravity-ui/icons';

export const revalidate = 0;

export default async function SuccessPage({ searchParams }) {
  const params = await searchParams;
  const session_id = params?.session_id;

  if (!session_id || typeof session_id !== 'string') {
    return redirect('/');
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch (stripeErr) {
    console.error("Stripe session retrieval failed:", stripeErr);
    return redirect('/');
  }

  if (session.status === 'open') {
    return redirect('/');
  }

  if (session.status === 'complete') {
    // লগইন করা ইউজারের ইমেইল ট্র্যাক করার জন্য মেটাডেটাকে ফার্স্ট প্রায়োরিটি দেওয়া হলো
    const finalCustomerEmail = 
      session.metadata?.userEmail || 
      session.customer_details?.email || 
      session.customer_email;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const confirmRes = await fetch(`${apiUrl}/api/orders/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          customerEmail: finalCustomerEmail ? finalCustomerEmail.toLowerCase().trim() : 'unknown@system.com',
          amountTotal: session.amount_total,
          bookId: session.metadata?.bookId,        
          bookTitle: session.metadata?.bookTitle,
        }),
        cache: 'no-store'
      });

      if (!confirmRes.ok) {
        const errData = await confirmRes.json();
        console.warn("Backend order submission response warning:", errData.message);
      }
    } catch (error) {
      console.error("Critical: Failed to sync transaction state downstream:", error.message);
    }

    // ৪. সাকসেসফুল ট্রানজেকশন UI
    return (
      <section className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center space-y-6 backdrop-blur-md">

          {/* সাকসেস আইকন গ্রিড */}
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mx-auto">
            <CircleCheck className="w-7 h-7" />
          </div>

          {/* টেক্সট মেসেজ */}
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wider text-emerald-400">
              Transaction Cleared
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              We appreciate your business! A validation entry was updated inside the terminal core logs.
              A confirmation email was dispatched to:{' '}
              <span className="text-indigo-400 font-semibold block mt-1 break-all">
                {finalCustomerEmail || 'your registered email'}
              </span>.
            </p>
          </div>

          {/* ড্যাশবোর্ড অ্যাকশন বাটন */}
          <Link
            href="/dashboard/reader"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            <LayoutCells className="w-4 h-4" />
            Enter Reader Workspace
          </Link>

        </div>
      </section>
    );
  }

  return redirect('/');
}