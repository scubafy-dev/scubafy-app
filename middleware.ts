import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // The middleware just ensures that the dive center context is accessible
  // throughout the application, but doesn't modify the response
  return NextResponse.next();
}

// Only run middleware on dashboard routes
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 