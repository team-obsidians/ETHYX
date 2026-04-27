// c:\Obsidian\Ethyx\frontend\app\(public)\login\page.tsx
// ETHYX AI — Login Page

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { BackgroundShell } from "@/components/shared/BackgroundShell"
import { AuthCard } from "@/components/shared/AuthCard"
import { AuthInput } from "@/components/forms/AuthInput"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    try {
      const supabase = createClient()
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (oauthError) setError(oauthError.message)
    } catch {
      setError("Failed to connect to authentication service.")
    }
  }

  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message)
      } else {
        router.push("/dashboard")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <BackgroundShell>
      <AuthCard>
        <div className="text-center mb-6">
          <h1 className="font-dm-sans text-xl font-bold text-text-primary mb-1">
            Welcome back
          </h1>
          <p className="font-dm-sans text-sm text-text-muted">
            Continue your fairness audits
          </p>
        </div>

        {/* Google OAuth */}
        <Button
          variant="outline"
          size="lg"
          className="w-full mb-4"
          onClick={handleGoogleLogin}
          type="button"
        >
          <GoogleIcon />
          <span className="ml-2">Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative flex items-center py-3">
          <div className="flex-grow border-t border-border-subtle" />
          <span className="mx-3 font-dm-mono text-[10px] text-text-faint uppercase tracking-[0.2em]">
            or
          </span>
          <div className="flex-grow border-t border-border-subtle" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <AuthInput
            id="login-email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            autoComplete="email"
            required
          />
          <AuthInput
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="font-dm-sans text-[11px] text-teal hover:text-teal-light transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-danger font-dm-sans bg-danger/10 border border-danger/20 rounded-btn px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6 font-dm-sans">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-teal hover:text-teal-light font-medium transition-colors">
            Sign up →
          </Link>
        </p>
      </AuthCard>
    </BackgroundShell>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09A6.97 6.97 0 015.49 12c0-.72.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
