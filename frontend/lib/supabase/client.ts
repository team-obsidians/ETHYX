// c:\Obsidian\Ethyx\frontend\lib\supabase\client.ts
// Browser-side Supabase client for ETHYX AI
// Dependencies: @supabase/ssr 0.5.2 EXACT

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
