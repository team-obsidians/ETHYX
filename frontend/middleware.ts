// c:\Obsidian\Ethyx\frontend\middleware.ts
// Route protection middleware for ETHYX AI
// Dependencies: @supabase/ssr 0.5.2, next/server

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/** Paths that require authentication */
const PROTECTED_PATHS = [
  "/upload",
  "/dashboard",
  "/explain",
  "/mitigate",
  "/report",
  "/profile",
]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Use getUser() — never the session-cache method (insecure)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup"

  // No authenticated user on a protected path → redirect to /login
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Authenticated user on auth page → redirect to /dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
