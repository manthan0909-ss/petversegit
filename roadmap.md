# PetVerse roadmap

## Done
- [x] Environment variables for API base + site URLs (`.env.example`, `src/lib/seo.ts`)
- [x] Analytics: page views + key events (onboarding, booking) — `src/lib/analytics.tsx`
- [x] Cookie consent banner + privacy controls in Settings
- [x] E2E tests for onboarding / pet selection / booking, wired into CI
- [x] Center hero logo on landing page
- [x] Accessibility pass: skip link, focus states, ARIA labels

## Final polish pass (in progress)
- [x] Shared lost-pet safety store (`src/lib/lost-flow.ts`) — works across app + public scan page
- [x] Toast notifications (sonner) mounted app-wide
- [x] Empty state / skeleton / confirm-dialog primitives
- [x] Public QR scan page: lost banner, privacy-safe info, voluntary location share
- [x] QR Pet ID page: tag status, tag ID, Mark as Lost / Mark Recovered, replace / deactivate
- [ ] Notification centre driven by live scan + location events (Open Map, Contact Finder, Mark Recovered)
- [ ] Dashboard: today's care + live safety status for the selected pet
- [ ] Avatar menu for Profile / Settings
- [ ] Lost & Found filters (pet type, distance, date)

## New tasks
- [ ] GPS Smart Collar page with demo-mode live location tracking, linked from `/future`
- [ ] Persistence: replace in-memory demo data with a real backend for onboarding, pet
      records, bookings and QR tags (Firebase is not available on this stack — use
      Lovable Cloud; awaiting user go-ahead)

- [x] QR tag store inside Marketplace: variants (Basic / Premium / Custom), demo order +
      order tracking, register existing tag. Real payments need a paid plan; shipping needs a
      courier partner — kept clearly labelled as a demo order.
- [~] Services: real vet/provider bookings (bookings already create real appointments in-app). No live booking network available and the current
      clinics are invented sample data — awaiting real partner details from the user.
