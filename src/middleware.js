import { NextResponse } from 'next/server';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (request.headers.get("next-router-prefetch") === "1") {
    return NextResponse.next();
  }

  console.log("🔍 Middleware Hit:", pathname);

  const sessionCookie = 
    request.cookies.get("__Secure-better-auth.session_token")?.value || 
    request.cookies.get("better-auth.session_token")?.value;

  if (!sessionCookie) {
    console.log("No session token found → Redirect to login");
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const origin = request.nextUrl.origin;
    
    const cookieName = request.cookies.get("__Secure-better-auth.session_token") ? "__Secure-better-auth.session_token" : "better-auth.session_token";

    const sessionRes = await fetch(`${origin}/api/auth/get-session`, {
      headers: {
        cookie: `${cookieName}=${sessionCookie}`,
      },
    });

    if (!sessionRes.ok) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const session = await sessionRes.json();
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const userRole = session?.user?.role?.toLowerCase()?.trim() || 'reader';

    if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    if (pathname.startsWith('/dashboard/librarian') && userRole !== 'librarian') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    if (pathname.startsWith('/dashboard/reader') && userRole !== 'reader') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Fetch Error in Middleware:", error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};