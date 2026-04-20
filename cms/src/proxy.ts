import { NextResponse, type NextRequest } from 'next/server'

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:4321'

export function proxy(request: NextRequest) {
  const target = new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    FRONTEND_URL,
  )
  return NextResponse.redirect(target)
}

export const config = {
  matcher: [
    '/((?!admin|api|media|next/|_next/|favicon\\.ico|robots\\.txt|.*\\.(?:xml|txt|ico|png|jpg|jpeg|svg|webp|avif|woff2?|ttf|otf|css|js|map)).*)',
  ],
}
