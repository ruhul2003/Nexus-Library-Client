import { NextResponse } from 'next/server'
import { auth } from './lib/auth' 
import { headers } from 'next/headers'

export async function proxy(request) {
  
  const session = await auth.api.getSession({
    headers: await headers()
  });

  console.log("Middlewayre Session Audit:", session);

  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/auth/login', request.url));
}

export const config = {
  matcher: [ '/dashboard/:path*']
}