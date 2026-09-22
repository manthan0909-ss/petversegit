import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogoFull } from "@/components/Logo";
import { btn } from "@/components/ui";
import { pvHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  staticData: { sitemap: false },
  head: pvHead("Login & Sign Up", "Securely sign in to PetVerse — One App. Every Pet. Every Need.", { path: "/auth", noindex: true }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const input =
    "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring";

  return (
    <div className="flex min-h-screen items-center justify-center bg-pastel-teal/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/"><LogoFull /></Link>
        </div>
        <div className="rounded-3xl border border-border bg-card p-7 shadow-lift">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full py-2 text-sm font-semibold text-muted-foreground transition",
                  mode === m && "bg-card text-foreground shadow-soft",
                )}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {mode === "forgot" ? (
            sent ? (
              <div className="text-center">
                <p className="text-4xl">📬</p>
                <h2 className="mt-3 font-display text-xl font-bold">Check your email</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We sent a password reset link. Follow it to set a new password.
                </p>
                <button className={cn(btn.ghost, "mt-4")} onClick={() => { setMode("login"); setSent(false); }}>
                  ← Back to login
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="space-y-4"
              >
                <h2 className="font-display text-xl font-bold">Reset your password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your account email and we'll send a secure reset link.
                </p>
                <input type="email" required placeholder="Email address" className={input} />
                <button className={cn(btn.primary, "w-full")}>Send reset link</button>
                <button type="button" className={cn(btn.ghost, "w-full")} onClick={() => setMode("login")}>
                  ← Back to login
                </button>
              </form>
            )
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); navigate({ to: mode === "signup" ? "/onboarding" : "/home" }); }}
              className="space-y-4"
            >
              <h2 className="font-display text-xl font-bold">
                {mode === "login" ? "Welcome back, Pet Parent 🐾" : "Create your PetVerse account"}
              </h2>
              {mode === "signup" && <input required placeholder="Your name" className={input} />}
              <input type="email" required placeholder="Email address" className={input} />
              <input type="password" required minLength={6} placeholder="Password (min 6 characters)" className={input} />
              <button className={cn(btn.primary, "w-full")}>
                {mode === "login" ? "Log in" : "Create account"}
              </button>
              {mode === "login" && (
                <button type="button" onClick={() => setMode("forgot")} className="w-full text-center text-sm font-semibold text-primary hover:underline">
                  Forgot password?
                </button>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <button type="button" onClick={() => navigate({ to: "/home" })} className={cn(btn.outline, "w-full")}>
                Continue with Google
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Secured by PetVerse Auth · demo build, Firebase-ready
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
