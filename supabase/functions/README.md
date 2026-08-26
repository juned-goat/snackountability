# Edge functions

Empty for now. First ones to add, matching the provider interfaces in
`packages/shared/src/providers`:

- `parse-food` — OCR (if image) → `FoodParser.parseText`
- `lookup-macros` — `NutritionLookup.find` per parsed item, LLM fallback if no match
- `daily-digest` — cron job (pg_cron) that checks budgets and fires the fun/roast notifications

Needs a real Supabase project (`supabase link`) before any of this can run.
