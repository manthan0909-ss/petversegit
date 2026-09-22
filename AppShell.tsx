import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Home, PawPrint, Heart, Stethoscope, ShoppingBag, QrCode, MapPin, Siren,
  Bot, Users, Wallet, PartyPopper, Bell, Settings, Search, ChevronDown,
  Sparkles, Menu, X, BookOpen, Radar, User, LogOut, Navigation,
} from "lucide-react";
import { usePetVerse } from "@/lib/petverse";
import { LogoFull } from "@/components/Logo";
import { PetAvatar } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Shared active-route test: exact match or a nested child of the route. */
function useIsActive(to: string) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/pets", label: "My Pets", icon: PawPrint },
  { to: "/health", label: "Health & Wellness", icon: Heart },
  { to: "/services", label: "Services", icon: Stethoscope },
  { to: "/shop", label: "Marketplace", icon: ShoppingBag },
  { to: "/qr", label: "Smart QR Pet ID", icon: QrCode },
  { to: "/lost-found", label: "Lost & Found", icon: MapPin },
  { to: "/nearby", label: "Nearby Places", icon: Navigation },
  { to: "/emergency", label: "Emergency", icon: Siren },
  { to: "/ai", label: "AI Pet Assistant", icon: Bot },
  { to: "/community", label: "Community", icon: Users },
  { to: "/finance", label: "Finance & Insurance", icon: Wallet },
  { to: "/fun", label: "Fun & Engagement", icon: PartyPopper },
  { to: "/passport", label: "Digital Passport", icon: BookOpen },
  { to: "/gps", label: "GPS Collar (demo)", icon: Radar },
  { to: "/future", label: "Future Features", icon: Sparkles },
] as const;

function PetSwitcher() {
  const { pets, selectedPet, selectPet } = usePetVerse();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        data-testid="pet-switcher"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 shadow-soft transition hover:bg-muted"
        aria-label="Switch pet"
      >
        <PetAvatar emoji={selectedPet.emoji} color={selectedPet.color} size="sm" ring />
        <span className="text-sm font-bold">{selectedPet.name}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-border bg-popover p-2 shadow-lift">
            <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Selected pet
            </p>
            {pets.map((p) => (
              <button
                key={p.id}
                data-testid={`pet-option-${p.id}`}
                onClick={() => {
                  selectPet(p.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-muted",
                  p.id === selectedPet.id && "bg-secondary",
                )}
              >
                <PetAvatar emoji={p.emoji} color={p.color} size="sm" ring={p.id === selectedPet.id} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.breed}</span>
                </span>
                {p.id === selectedPet.id && <span className="ml-auto text-primary">✓</span>}
              </button>
            ))}
            <Link to="/onboarding" className="mt-1 block rounded-xl px-2 py-2 text-center text-sm font-semibold text-primary hover:bg-muted" onClick={() => setOpen(false)}>
              + Add Pet
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active && "bg-sidebar-primary font-semibold text-sidebar-primary-foreground shadow-soft",
              to === "/emergency" && !active && "text-red-300 hover:text-red-100",
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

const BOTTOM_NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/pets", label: "Pets", icon: PawPrint },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/ai", label: "AI", icon: Bot },
  { to: "/settings", label: "More", icon: Menu },
] as const;

export default function AppShell() {
  const { unreadCount } = usePetVerse();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const notificationsActive = useIsActive("/notifications");
  const settingsActive = useIsActive("/settings");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-sidebar md:flex lg:w-64">
        <Link to="/" className="flex items-center gap-2 px-4 pb-2 pt-5">
          <LogoFull onDark />
        </Link>
        <SidebarNav />
        <div className="border-t border-sidebar-border p-4 text-[11px] text-sidebar-foreground/50">
          One App. Every Pet. Every Need.
          <br />© PetVerse 2026
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setMobileNav(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-sidebar">
            <div className="flex items-center justify-between px-4 pt-4">
              <LogoFull onDark />
              <button onClick={() => setMobileNav(false)} className="text-sidebar-foreground" aria-label="Close menu">
                <X />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileNav(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button className="md:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-soft sm:flex">
              <Search className="h-4 w-4 shrink-0" />
              <input
                aria-label="Search pets, vets and services"
                placeholder="Search pets, vets, services…"
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => e.key === "Enter" && navigate({ to: "/shop" })}
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <PetSwitcher />
              <Link
                to="/notifications"
                aria-current={notificationsActive ? "page" : undefined}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-soft transition hover:bg-muted",
                  notificationsActive && "border-primary bg-secondary text-primary",
                )}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <AccountMenu active={settingsActive} />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:px-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
          <div className="relative grid grid-cols-6 items-end px-2 pb-2 pt-1">
            {BOTTOM_NAV.slice(0, 2).map(({ to, label, icon: Icon }) => (
              <BottomLink key={to} to={to} label={label} icon={<Icon className="h-5 w-5" />} />
            ))}
            <div className="relative flex justify-center">
              <Link
                to="/emergency"
                aria-label="Emergency SOS"
                className="animate-pulse-ring absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lift"
              >
                <Siren className="h-6 w-6" />
              </Link>
              <span className="pt-7 text-[10px] font-semibold text-destructive">SOS</span>
            </div>
            {BOTTOM_NAV.slice(2).map(({ to, label, icon: Icon }) => (
              <BottomLink key={to} to={to} label={label} icon={<Icon className="h-5 w-5" />} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

function BottomLink({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  const active = useIsActive(to);
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium text-muted-foreground transition",
        active && "font-semibold text-primary",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

/** Profile / Settings menu behind the user avatar. */
function AccountMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden sm:block">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={cn(
          "flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-semibold shadow-soft transition hover:bg-muted",
          active && "border-primary bg-secondary text-primary",
        )}
      >
        <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-pastel-purple text-xs">A</span>
        Abhishek
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-popover p-2 shadow-lift">
            <p className="px-2 pb-1 pt-1 text-xs text-muted-foreground">
              Abhishek Patil · Pet parent
            </p>
            {[
              { to: "/settings", label: "My Profile", icon: User },
              { to: "/settings", label: "Settings & Privacy", icon: Settings },
              { to: "/notifications", label: "Notifications", icon: Bell },
              { to: "/passport", label: "Digital Passport", icon: BookOpen },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </Link>
            ))}
            <Link
              to="/auth"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-destructive transition hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
