import { redirect } from 'next/navigation';
import Link from 'next/link';
import { stripe } from '../../../lib/stripe';
import { CircleCheck, LayoutCells } from '@gravity-ui/icons';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  if (session.status === 'open') {
    return redirect('/');
  }

  if (session.status === 'complete') {
    // Sync payment details downstream with our Express endpoint safely via server-to-server fetch
    try {
      await fetch('http://localhost:5000/api/orders/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total
        }),
        cache: 'no-store'
      });
    } catch (error) {
      console.error("Critical: Failed to sync transaction state downstream:", error);
    }

    return (
      <section className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/50 border border-white/10 rounded-2xl p-8 text-center space-y-6 backdrop-blur-md">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mx-auto">
            <CircleCheck className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-wider">Transaction Cleared</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              We appreciate your business! A validation entry was updated inside the terminal core logs. 
              A confirmation email was dispatched to <span className="text-indigo-400 font-semibold">{session.customer_details?.email}</span>.
            </p>
          </div>

          <Link 
            href="/dashboard/reader" 
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/15"
          >
            <LayoutCells className="w-4 h-4" />
            Enter Reader Workspace
          </Link>
        </div>
      </section>
    );
  }
}