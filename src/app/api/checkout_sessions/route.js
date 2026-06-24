import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // ১. ফর্ম ডাটা থেকে বুক আইডি এবং ইউজার ইমেইল রিসিভ করা
    const formData = await request.formData();
    const bookId = formData.get('bookId');
    const userEmail = formData.get('userEmail') || 'unknown@system.com'; // ফ্রন্টএন্ড থেকে পাস করা ইমেইল

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // ২. সেন্ট্রাল ব্যাকএন্ড এপিআই থেকে বইয়ের বিবরণ নিয়ে আসা
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/books/${bookId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const book = await res.json();
    
    // ৩. বইয়ের দাম নির্ধারণ (যদি প্রাইস ফিল্ড না থাকে তবে ডিফল্ট বা ফি কাউন্ট করা)
    const price = parseFloat(book.price || book.fee || 9.99);

    // ৪. স্ট্রাইপ চেকআউট সেশন অবজেক্ট তৈরি করা
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail !== 'unknown@system.com' ? userEmail : undefined, // সেশন ইমেইল ট্র্যাকিং
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title || 'Library Book',
              description: book.description ? book.description.substring(0, 150) : 'Central Asset Catalog Entry',
              images: book.imageUrl || book.coverImage ? [book.imageUrl || book.coverImage] : [],
            },
            unit_amount: Math.round(price * 100), // সেন্টে কনভার্ট করা (যেমন: 9.99 ডলার = 999 সেন্ট)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/books/${bookId}`,
      
      // 🌟 মেটাডেটা: এটি স্টাইপ ড্যাশবোর্ড এবং আপনার ট্রানজেকশন এপিআইতে ডেটা পাঠাতে সাহায্য করবে
      metadata: {
        bookId: String(book._id || bookId),
        bookTitle: book.title || 'Unknown Title',
        userEmail: userEmail,
        librarianEmail: book.librarianEmail || 'System / Direct Upload', // বইয়ের ওনার/লাইব্রেরিয়ানের ইমেইল
      },
    });

    // ৫. সাকসেসফুলি স্ট্রাইপ পেমেন্ট গেটওয়ে ইউআরএল-এ রিডাইরেক্ট করা
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error('Checkout Session Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}