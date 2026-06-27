import { NextResponse } from 'next/server';

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  if (request.headers.get("next-router-prefetch") === "1") {
    return NextResponse.next();
  }

  console.log("Proxy Hit:", pathname);

  const sessionCookie = 
    request.cookies.get("__Secure-better-auth.session_token")?.value || 
    request.cookies.get("better-auth.session_token")?.value;

  const isBookEditRoute = /^\/books\/[^/]+\/edit$/.test(pathname);

  if (pathname.startsWith('/dashboard') || isBookEditRoute) {
    if (!sessionCookie) {
      console.log("No session token found → Redirect to login");
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const origin = request.nextUrl.origin;
      const cookieName = request.cookies.get("__Secure-better-auth.session_token") 
        ? "__Secure-better-auth.session_token" 
        : "better-auth.session_token";

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

      // Dashboard Role Protection
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

      // Book Edit Protection: Admin + Librarian Only
      if (isBookEditRoute) {
        const allowedRoles = ['admin', 'librarian'];
        if (!allowedRoles.includes(userRole)) {
          console.log(`Access Denied: ${userRole} trying to edit book`);
          return NextResponse.redirect(new URL('/dashboard/reader', request.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Proxy Error:", error);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/books/:id/edit'],
};