# snackountability 🍟

A calorie tracker that doesn't take itself too seriously. Log food by typing
it, or by snapping a photo of the handwritten notes you scribbled on all day —
we'll figure out the macros so you don't have to.

## Stack (everything open source / free-tier)

| Layer | Choice |
|---|---|
| Mobile app (iOS + Android, one codebase) | React Native + Expo (TypeScript) |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions) |
| Auth | Google + Apple sign-in only — no username/password |
| Image/text → food items | Open-weight LLMs via OpenRouter (free tier) |
| Real macro numbers | USDA FoodData Central (LLM is a fallback estimate, flagged as such) |
| Monorepo tooling | pnpm workspaces + Turborepo |

## Structure

```
apps/
  mobile/          Expo app — the entire iOS + Android client
packages/
  shared/          Types, budget/macro math, and the provider interfaces
                    below — imported by both the app and the edge functions
supabase/
  migrations/      DB schema as code
  functions/       Edge functions (parse-food, lookup-macros, daily-digest, ...)
.github/workflows/ CI: install, typecheck, lint, test
```

## Swappable pieces

Anything that talks to an external vendor is called through an interface
defined in `packages/shared/src/providers`, never called directly from app
or business logic. Swapping a vendor = write one new class implementing the
interface + flip a config value, not a codebase-wide hunt.

| Interface | Current implementation | Swap candidates |
|---|---|---|
| `OCRProvider` | Vision LLM (via OpenRouter), used as a transcriber | Tesseract, another vision model |
| `FoodParser` | Open-weight LLM (via OpenRouter) | Groq, self-hosted Ollama |
| `NutritionLookup` | USDA FoodData Central | Open Food Facts |
| `NotificationSender` | Expo Push | Any other push service |

The actual coding languages (TypeScript, SQL) are the one thing here that's
*not* meant to be swappable.

## Auth providers

Google + Apple sign-in, no username/password. As of now, only a Google Cloud
project is required and it's free — Apple Sign-In needs a paid Apple
Developer Program membership, which doesn't exist yet, so it's stubbed out
behind a flag until that membership exists. Nothing else is blocked on it.

## Local setup

```bash
pnpm install

# one-time: authenticate the Supabase CLI, then link this repo to the
# real Supabase project (created via the dashboard first)
pnpm db:login
pnpm db:link

# apply migrations in supabase/migrations/ to the linked project
pnpm db:push

pnpm --filter mobile start   # Expo dev server — scan the QR with Expo Go
```

Copy `apps/mobile/.env.example` -> `apps/mobile/.env.local` and
`supabase/functions/.env.example` -> `supabase/functions/.env.local`, filling
in real values from the Supabase dashboard. Neither `.env.local` file is
committed.
