// c:\Obsidian\Ethyx\frontend\app\(public)\signup\page.tsx
// ETHYX AI — Signup Page

"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Mail, User, Building2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { BackgroundShell } from "@/components/shared/BackgroundShell"
import { AuthCard } from "@/components/shared/AuthCard"
import { AuthInput } from "@/components/forms/AuthInput"
import { Button } from "@/components/ui/button"

function getPasswordStrength(pw: string): number {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong", "Very Strong"] as const
const STRENGTH_COLORS = ["bg-border-base", "bg-danger", "bg-warning", "bg-warning", "bg-teal"] as const

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [organization, setOrganization] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  async function handleGoogleSignup() {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) { setError("Password must be at least 8 characters."); return }
    if (password !== confirmPassword) { setError("Passwords do not match."); return }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: fullName, organization },
        },
      })
      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <BackgroundShell>
        <AuthCard maxWidth="max-w-[460px]">
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto mb-5">
              <Mail className="h-6 w-6 text-teal" />
            </div>
            <h2 className="font-dm-sans text-xl font-bold text-text-primary mb-2">Check your email</h2>
            <p className="font-dm-sans text-sm text-text-muted max-w-xs mx-auto">
              Check your email to confirm your ETHYX account. Then return here to sign in.
            </p>
            <Button variant="ghost" className="mt-6" asChild>
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </div>
        </AuthCard>
      </BackgroundShell>
    )
  }

  return (
    <BackgroundShell>
      <AuthCard maxWidth="max-w-[460px]">
        <div className="text-center mb-6">
          <h1 className="font-dm-sans text-xl font-bold text-text-primary mb-1">Create your ETHYX account</h1>
          <p className="font-dm-sans text-sm text-text-muted">Start auditing AI bias for free.</p>
        </div>

        <Button variant="outline" size="lg" className="w-full mb-4" onClick={handleGoogleSignup} type="button">
          <GoogleIcon /><span className="ml-2">Continue with Google</span>
        </Button>

        <div className="relative flex items-center py-3">
          <div className="flex-grow border-t border-border-subtle" />
          <span className="mx-3 font-dm-mono text-[10px] text-text-faint uppercase tracking-[0.2em]">or</span>
          <div className="flex-grow border-t border-border-subtle" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <AuthInput id="signup-name" label="Full Name" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} icon={User} autoComplete="name" required />
          <AuthInput id="signup-org" label="Organization" placeholder="Acme Corp" value={organization} onChange={(e) => setOrganization(e.target.value)} icon={Building2} autoComplete="organization" />
          <AuthInput id="signup-email" label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} autoComplete="email" required />
          <AuthInput id="signup-password" label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />

          {/* Password strength bar */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? STRENGTH_COLORS[strength] : "bg-border-base"}`} />
                ))}
              </div>
              <p className="font-dm-mono text-[10px] text-text-muted">{STRENGTH_LABELS[strength]}</p>
            </div>
          )}

          <AuthInput id="signup-confirm" label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required />

          {error && (
            <p className="text-sm text-danger font-dm-sans bg-danger/10 border border-danger/20 rounded-btn px-3 py-2">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-5 font-dm-sans">
          Already have an account?{" "}
          <Link href="/login" className="text-teal hover:text-teal-light font-medium transition-colors">Sign in →</Link>
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
