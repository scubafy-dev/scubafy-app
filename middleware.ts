import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // If user is authenticated and trying to access protected routes
  if (token && token.email) {
    // Check if user is trying to access manager-specific routes
    const path = request.nextUrl.pathname;
    const isManagerRoute = path.startsWith('/') && 
      !path.startsWith('/signin') && 
      !path.startsWith('/api') && 
      !path.startsWith('/_next') &&
      !path.startsWith('/subscription-required') &&
      !path.startsWith('/signin/error');

    if (isManagerRoute && token.role === 'manager') {
      // For manager routes, we'll let the page handle subscription checks
      // The NextAuth signIn callback will handle the main subscription validation
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Only run middleware on dashboard routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 