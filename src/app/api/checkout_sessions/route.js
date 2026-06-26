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
    const userEmail = formData.get('userEmail'); // fallback 'unknown' এখানে দিব না, পরে চেক করব

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // ২. সেন্ট্রাল ব্যাকএন্ড এপিআই থেকে বইয়ের বিবরণ নিয়ে আসা
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/books/${bookId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const book = await res.json();
    
    // ৩. বইয়ের দাম নির্ধারণ
    const price = parseFloat(book.price || book.fee || 9.99);

    // ৪. ইমেইল ফিল্টার ও স্যানিটাইজ করা (যাতে ডাটাবেজে সঠিক মেইল যায়)
    const validEmail = userEmail && userEmail.trim() !== '' ? userEmail.trim().toLowerCase() : 'unknown@system.com';

    // ৫. স্ট্রাইপ চেকআউট সেশন অবজেক্ট তৈরি করা
    const session = await stripe.checkout.sessions.create({
      // যদি ভ্যালিড ইমেইল থাকে তবেই স্ট্রাইপকে পাস করো, নয়তো স্ট্রাইপ পেমেন্ট পেজে ইউজারকে টাইপ করতে দেবে
      customer_email: validEmail !== 'unknown@system.com' ? validEmail : undefined, 
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title || 'Library Book',
              description: book.description ? book.description.substring(0, 150) : 'Central Asset Catalog Entry',
              images: book.imageUrl || book.coverImage ? [book.imageUrl || book.coverImage] : [],
            },
            unit_amount: Math.round(price * 100), // সেন্টে কনভার্ট করা
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/books/${bookId}`,
      
      // 🌟 মেটাডেটা: এটি সাকসেস পেজ এবং ডাটাবেজে হুবহু পাস হবে
      metadata: {
        bookId: String(book._id || bookId),
        bookTitle: book.title || 'Unknown Title',
        userEmail: validEmail, // এখানে নিখুঁত ট্রিমড ইমেইলটি যাচ্ছে
        librarianEmail: book.librarianEmail || 'System / Direct Upload',
      },
    });

    // ৬. সাকসেসফুলি স্ট্রাইপ পেমেন্ট গেটওয়ে ইউআরএল-এ রিডাইরেক্ট করা
    // Next.js App Router-এ NextResponse.redirect ব্যবহারের সময় absolute URL পাঠানো নিরাপদ
    return NextResponse.redirect(session.url, { status: 303 });

  } catch (err) {
    console.error('Checkout Session Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );  
  }
}