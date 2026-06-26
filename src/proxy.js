import { NextResponse } from 'next/server';
import { auth } from './lib/auth'; 
import { headers } from 'next/headers';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers()
  });

  console.log("Middleware Session Audit:", session);

  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role?.toLowerCase();

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  
  if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL(`/dashboard/${userRole || 'reader'}`, request.url));
  }

  if (pathname.startsWith('/dashboard/librarian') && userRole !== 'librarian') {
    return NextResponse.redirect(new URL(`/dashboard/${userRole || 'reader'}`, request.url));
  }

  if (pathname.startsWith('/dashboard/reader') && userRole !== 'reader') {
    return NextResponse.redirect(new URL(`/dashboard/${userRole || 'admin'}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};