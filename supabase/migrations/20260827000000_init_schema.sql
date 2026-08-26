-- Core schema: user_profiles + food_log_entries.
-- Every table is scoped to auth.uid() via RLS — a user can only ever
-- read/write their own rows. This matters more than usual here since
-- weight/goals/food logs are sensitive personal data.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  goal text not null check (goal in ('lose', 'maintain', 'gain')),
  weight_kg numeric not null check (weight_kg > 0),
  height_cm numeric not null check (height_cm > 0),
  age integer not null check (age > 0),
  sex text not null check (sex in ('male', 'female')),
  activity_level text not null check (
    activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')
  ),
  target_rate_kg_per_week numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "select own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create table if not exists public.food_log_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_at timestamptz not null default now(),
  source text not null check (source in ('manual_text', 'photo_note', 'photo_food')),
  raw_text text,
  name text not null,
  quantity numeric not null,
  unit text not null,
  calories numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  sugar_g numeric not null,
  is_estimate boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists food_log_entries_user_logged_at_idx
  on public.food_log_entries (user_id, logged_at desc);

alter table public.food_log_entries enable row level security;

create policy "select own food log"
  on public.food_log_entries for select
  using (auth.uid() = user_id);

create policy "insert own food log"
  on public.food_log_entries for insert
  with check (auth.uid() = user_id);

create policy "update own food log"
  on public.food_log_entries for update
  using (auth.uid() = user_id);

create policy "delete own food log"
  on public.food_log_entries for delete
  using (auth.uid() = user_id);

-- keep updated_at current on user_profiles
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row
  execute function public.set_updated_at();
