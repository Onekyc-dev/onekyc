# OneKYC

Verify once, reuse identity verification across any dApp.

## What's real vs. mocked right now

| Piece | Status |
|---|---|
| Google sign-in | Real — works as soon as env vars are set |
| Account creation, sessions | Real |
| Didit document KYC + liveness | **Mocked** — `lib/didit.js`. Auto-passes with a short delay. Replace once `DIDIT_API_KEY` is set and Didit's real API is wired in. |
| Database (users, sessions) | **Mocked** — `lib/db.js`. In-memory, resets on every deploy/restart. Replace once `DATABASE_URL` (Supabase/Neon) is set. |
| dApp verification flow | Real logic, running against the mocks above |

Nothing needs to be "turned on" — the mocks activate automatically whenever
the relevant env var (`DIDIT_API_KEY`, `DATABASE_URL`) is missing, so the
whole flow is clickable and testable today.

## Environment variables

Copy `.env.example` to `.env.local` for local dev, and add the same keys in
**Vercel → Settings → Environment Variables** for production:

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from Google Cloud Console
- `NEXTAUTH_SECRET` — any random string (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — your live URL, e.g. `https://onekyc-zeta.vercel.app`
- `DIDIT_API_KEY` / `DIDIT_WEBHOOK_SECRET` — leave blank for now (mock mode)
- `DATABASE_URL` — leave blank for now (mock mode)

After adding/changing env vars in Vercel, trigger a redeploy for them to
take effect.

## App flow (screens)

1. `/` — Google sign-in
2. `/verify-prompt` — "one more step" after account creation
3. `/kyc-processing` — Didit processing → verified
4. `/dashboard` — verified status + verification history
5. `/verify/[sessionId]` — entry point a dApp redirects users to
6. `/verify/[sessionId]/liveness` — fresh liveness check, every time
7. `/verify/[sessionId]/result` — signed result, redirects back to the dApp

## How a dApp integrates (once live)

1. dApp calls `POST /api/verify/request` with `{ dappName, redirectUri }`
2. Receives `{ redirectUrl }` — redirects its user there
3. User completes login + liveness on OneKYC
4. OneKYC redirects back to the dApp's `redirectUri` with
   `?verified=true&token=...`
5. dApp should verify the token's signature server-side before trusting it
   (see `lib/signResult.js`)

**Before this is safe for real dApps:** add a redirect-URI allowlist so
`/api/verify/request` only accepts requests from pre-registered dApps —
right now it trusts whatever `redirectUri` is posted, which is fine for
testing but not for production (see the TODO comment in that file).

## Next steps

- [ ] Create Supabase or Neon project, add `DATABASE_URL`, swap `lib/db.js`
- [ ] Get Didit API docs, add `DIDIT_API_KEY`, swap `lib/didit.js`
- [ ] Add the dApp allowlist mentioned above
- [ ] Decide blur-retry vs. face-mismatch-retry limits (currently both capped at 3 in the liveness screen)
