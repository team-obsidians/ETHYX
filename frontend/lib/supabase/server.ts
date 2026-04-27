// c:\Obsidian\Ethyx\frontend\lib\supabase\server.ts
// Server-side Supabase client for ETHYX AI (App Router)
// Dependencies: @supabase/ssr 0.5.2 EXACT, next/headers

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll is called from Server Components where cookies
            // cannot be set. This is safe to ignore when the middleware
            // handles session refresh.
          }
        },
      },
    }
  )
}
