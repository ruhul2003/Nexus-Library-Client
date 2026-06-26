import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';

export async function POST(request) {
  try {
    // Force your production app URL as the base origin
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://nexus-library-client.vercel.app';

    console.log('FINAL ORIGIN USED FOR STRIPE:', origin);

    const formData = await request.formData();
    const bookId = formData.get('bookId');
    const userEmail = formData.get('userEmail');

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://nexus-library-server.vercel.app';
    const res = await fetch(`${apiUrl}/api/books/${bookId}`, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const book = await res.json();
    const price = parseFloat(book.price || book.fee || 9.99);

    const validEmail = userEmail && userEmail.trim() !== ''
      ? userEmail.trim().toLowerCase()
      : 'unknown@system.com';

    const session = await stripe.checkout.sessions.create({
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
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/books/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/books/${bookId}`,

      metadata: {
        bookId: String(book._id || bookId),
        bookTitle: book.title || 'Unknown Title',
        userEmail: validEmail,
        librarianEmail: book.librarianEmail || 'System / Direct Upload',
      },
    });

    return NextResponse.redirect(session.url, { status: 303 });

  } catch (err) {
    console.error('Checkout Session Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}