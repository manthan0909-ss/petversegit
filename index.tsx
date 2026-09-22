import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoFull } from "@/components/Logo";
import { Badge, Card, btn } from "@/components/ui";
import { FUTURE_FEATURES, SURVEY_STATS } from "@/lib/petverse";
import { pvHead } from "@/lib/seo";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: pvHead(
    "India's All-in-One Pet Care Ecosystem",
    "PetVerse brings healthcare, trusted services, shopping, safety, AI guidance and community together — One App. Every Pet. Every Need.", { path: "/" }),
  component: Landing,
});

const WHY = [
  { icon: "🔗", title: "One Connected Platform", desc: "Health, services, shopping & safety — one login." },
  { icon: "🐾", title: "Personalized Pet Profiles", desc: "Every pet, every record, beautifully organized." },
  { icon: "❤️", title: "Digital Health Records", desc: "Vaccines, prescriptions & reports always with you." },
  { icon: "🔔", title: "Smart Reminders", desc: "Never miss a vaccine, medicine or groom again." },
  { icon: "🩺", title: "Trusted Pet Services", desc: "Vets, groomers, walkers & trainers — verified." },
  { icon: "🏷", title: "Smart QR Pet ID", desc: "A physical collar tag that brings lost pets home." },
  { icon: "🤖", title: "AI Pet Assistance", desc: "Food, care & symptom guidance, 24×7." },
  { icon: "📍", title: "Lost & Found Network", desc: "Community-powered reunions with location sharing." },
  { icon: "👥", title: "Community Support", desc: "Adoption, events, tips & pet-friendly places." },
  { icon: "💰", title: "Expense Tracking", desc: "Understand and plan your pet spending." },
];

const DASHBOARD_TILES = [
  { icon: "❤️", label: "Health", color: "pastel-rose" },
  { icon: "🔔", label: "Reminders", color: "pastel-yellow" },
  { icon: "🩺", label: "Vet", color: "pastel-blue" },
  { icon: "🛒", label: "Shop", color: "pastel-peach" },
  { icon: "🏷", label: "QR Pet ID", color: "pastel-purple" },
  { icon: "📍", label: "Lost & Found", color: "pastel-teal" },
  { icon: "🤖", label: "AI Assistant", color: "pastel-green" },
  { icon: "🚨", label: "Emergency", color: "pastel-rose" },
];

const PROBLEMS = [
  "Managing health records", "Remembering vaccinations", "Remembering medicines",
  "Finding trusted vets", "Grooming", "Training", "Finding lost pets", "Pet boarding",
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <LogoFull />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#why" className="hover:text-foreground">Why PetVerse</a>
            <a href="#qr" className="hover:text-foreground">QR Pet ID</a>
            <a href="#survey" className="hover:text-foreground">Insights</a>
            <a href="#future" className="hover:text-foreground">Future</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className={btn.ghost}>Log in</Link>
            <Link to="/auth" className={btn.primary}>Get Started</Link>
          </div>
        </div>
      </header>

      <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-pastel-purple blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-pastel-teal blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl justify-center px-4 pt-12 lg:pt-16">
          <LogoFull size="hero" className="!px-0 animate-float" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 lg:grid-cols-2 lg:pb-24">
          <div>
            <Badge tone="green" className="mb-4">🇮🇳 India's All-in-One Pet Care Ecosystem</Badge>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Everything Your Pet Needs. <span className="text-gradient-brand">All in One Place.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">
              PetVerse brings healthcare, trusted services, shopping, safety, AI guidance and community
              together to make pet ownership simpler.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/auth" className={btn.primary}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/home" className={btn.outline}>Explore PetVerse</Link>
            </div>
            <p className="mt-6 text-sm font-semibold text-muted-foreground">
              One App. Every Pet. Every Need. · Care Smarter. Live Happier. Together.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="animate-float">
            <div className="rounded-3xl border border-border bg-card p-4 shadow-lift">
              <div className="mb-3 flex items-center justify-between rounded-2xl gradient-navy px-4 py-3 text-navy-foreground">
                <div>
                  <p className="text-xs opacity-70">Good morning, Abhishek 👋</p>
                  <p className="font-display font-bold">How is Bruno doing today?</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pastel-green text-xl">🐶</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {DASHBOARD_TILES.map((t) => (
                  <div
                    key={t.label}
                    className="flex flex-col items-center gap-1 rounded-2xl border border-border p-3 text-center"
                    style={{ backgroundColor: `var(--color-${t.color})` }}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-xs font-semibold">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm">
                <span>💉 Rabies booster — <strong>tomorrow</strong></span>
                <span className="font-semibold text-primary">View</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why PetVerse */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">More Than an App. A Complete Pet Ecosystem.</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold">Why PetVerse?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Instead of using different platforms for different pet needs, PetVerse connects the entire
          pet-care journey in one place.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WHY.map((w) => (
            <Card key={w.title} hover className="text-left">
              <span className="text-2xl">{w.icon}</span>
              <h3 className="mt-2 font-display text-sm font-bold">{w.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* QR feature */}
      <section id="qr" className="gradient-navy py-16 text-navy-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <Badge tone="peach">🏷 Smart QR Pet ID</Badge>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Lost Today. Found Tomorrow.</h2>
            <p className="mt-3 max-w-md text-navy-foreground/75">
              A physical QR tag on your pet's collar. Anyone who finds your pet scans it to see a safe
              public profile and contact you — without exposing your private details.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Safe public pet profile", "Instant scan alerts to the owner", "Finder location sharing on map", "Privacy controls & deactivation"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Link to="/qr" className={btn.primary}>Order Your Smart QR Pet ID</Link>
              <Link to="/scan/$petId" params={{ petId: "bruno" }} className={btn.outline + " !bg-white/10 !text-white !border-white/30"}>
                Preview scan page
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm rounded-3xl bg-card p-6 text-card-foreground shadow-lift">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pastel-green text-3xl">🐶</span>
              <div>
                <p className="font-display text-xl font-bold">Bruno</p>
                <p className="text-sm text-muted-foreground">Golden Retriever · Pet ID PV-10245</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl bg-muted p-4">
              <div className="grid h-20 w-20 grid-cols-5 gap-0.5 rounded-lg bg-foreground p-1.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className={(i * 7 + 3) % 3 ? "bg-background" : "bg-transparent"} />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">Physical collar tag</p>
                <p className="text-muted-foreground">Scan opens a safe public PetVerse page — "Help Bruno Get Home".</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Survey */}
      <section id="survey" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-center text-sm font-bold uppercase tracking-widest text-grape">What Pet Owners Told Us</p>
        <h2 className="mt-2 text-center font-display text-3xl font-bold">Built From 46 Real Survey Responses</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SURVEY_STATS.map((s) => (
            <Card key={s.value} hover tint="purple">
              <p className="font-display text-4xl font-extrabold text-grape">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <h3 className="text-center font-display text-lg font-bold">Problems pet owners face every day</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {PROBLEMS.map((p) => (
              <Badge key={p} tone="blue">{p}</Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Future */}
      <section id="future" className="bg-pastel-blue/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-skyblue">The Future of Pet Care Starts Here</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold">Coming Soon to PetVerse</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FUTURE_FEATURES.slice(0, 8).map((f) => (
              <Card key={f.name} hover>
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-2 font-display text-sm font-bold">{f.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                <Badge tone="peach" className="mt-2">Coming Soon</Badge>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link to="/future" className="text-sm font-semibold text-primary hover:underline">
              See all 19 future features →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="gradient-brand py-20 text-center text-white">
        <h2 className="mx-auto max-w-2xl px-4 font-display text-3xl font-extrabold sm:text-4xl">
          Your Pet Deserves More Than Care. They Deserve PetVerse.
        </h2>
        <p className="mt-3 text-white/85">Your Pet's Health, Safety & Happiness — Connected.</p>
        <Link to="/auth" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-display font-bold text-navy shadow-lift transition hover:scale-[1.02]">
          Get Started Free <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-muted-foreground">
          <LogoFull className="!px-0" />
          <p>More Than an App. A Complete Pet Ecosystem.</p>
          <p>© 2026 PetVerse · Made with ❤️ for every pet</p>
        </div>
      </footer>
    </div>
  );
}
