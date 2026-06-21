import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const formData = await request.formData();
    const bookId = formData.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Fetch book from backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/books/${bookId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const book = await res.json();
    const price = parseFloat(book.price || book.fee || 9.99);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: book.title || 'Library Book',
              description: book.description ? book.description.substring(0, 150) : '',
              images: book.coverImage ? [book.coverImage] : [],
            },
            unit_amount: Math.round(price * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/books/${bookId}`,
      metadata: {
        bookId: String(book._id || bookId),
        bookTitle: book.title,
      },
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error('Checkout Session Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}