import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Block any requests carrying Next-Action headers since this application does not use Server Actions.
  // This prevents Next.js App Router from logging scary "Failed to find Server Action"
  // stack traces caused by vulnerability scanners (e.g. Next-Action: x) or stale browser tabs.
  if (request.headers.has('next-action')) {
    return new NextResponse('Server action not found', { status: 404 });
  }

  // Reject POST requests targeting non-API routes (e.g., POST to /)
  if (request.method === 'POST' && !request.nextUrl.pathname.startsWith('/api')) {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap, robots, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
