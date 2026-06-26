import { NextResponse } from 'next/server';
import { auth } from './lib/auth'; 
import { headers } from 'next/headers';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Success page এবং auth routes কে middleware থেকে বাদ দাও
  if (
    pathname.includes('/books/success') || 
    pathname.includes('/auth/') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("Middleware Session Audit:", {
      hasSession: !!session?.user,
      userId: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.role,
      pathname
    });

    const isLoggedIn = !!session?.user;
    const userRole = session?.user?.role?.toLowerCase() || 'reader';

    if (!isLoggedIn) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(loginUrl);
    }

    // Role protection
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    if (pathname.startsWith('/dashboard/librarian') && userRole !== 'librarian') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    if (pathname.startsWith('/dashboard/reader') && userRole !== 'reader') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/books/success', 
  ]
};