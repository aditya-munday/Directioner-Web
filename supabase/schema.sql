-- ═══════════════════════════════════════════════════════════════════════════
-- DIRECTIONER — Complete Supabase Schema
-- ─────────────────────────────────────────────────────────────────────────────
-- Paste this entire file into:
--   Supabase Dashboard → SQL Editor → New Query → Run (Ctrl+Enter)
--
-- Safe to re-run: all statements use IF NOT EXISTS / OR REPLACE / ON CONFLICT.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── updated_at auto-trigger helper ───────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: profiles
-- Extends auth.users — created automatically via trigger on signup.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  username      text        not null default 'user' check (char_length(username) between 1 and 64),
  full_name     text        check (char_length(full_name) <= 128),
  avatar_url    text        check (char_length(avatar_url) <= 2048),
  tier          text        not null default 'free'
                            check (tier in ('free', 'basic', 'pro', 'max')),
  credits_used  int         not null default 0 check (credits_used >= 0),
  credits_limit int         not null default 500 check (credits_limit >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
drop policy if exists "profiles: owner select" on public.profiles;
drop policy if exists "profiles: owner update" on public.profiles;
create policy "profiles: owner select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: owner update" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Index
create index if not exists profiles_tier_idx on public.profiles(tier);

-- ── Auto-create profile on Supabase Auth signup ───────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'user_name',
      split_part(coalesce(new.raw_user_meta_data->>'full_name',''), ' ', 1),
      split_part(coalesce(new.email,''), '@', 1),
      'user'
    ),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    full_name  = coalesce(excluded.full_name,  public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: servers
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.servers (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  server_name       text        not null check (char_length(server_name) between 1 and 128),
  discord_server_id text        not null check (char_length(discord_server_id) between 1 and 64),
  member_count      int         not null default 0  check (member_count >= 0),
  channel_count     int         not null default 0  check (channel_count >= 0),
  status            text        not null default 'online'
                                check (status in ('online','offline','maintenance')),
  tier              text        not null default 'free',
  ai_mode           text        not null default 'chat' check (char_length(ai_mode) <= 32),
  created_at        timestamptz not null default now(),
  unique(user_id, discord_server_id)
);

-- RLS
alter table public.servers enable row level security;
drop policy if exists "servers: owner all" on public.servers;
create policy "servers: owner all" on public.servers
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists servers_user_id_idx on public.servers(user_id);
create index if not exists servers_status_idx  on public.servers(status);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: analytics_daily
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.analytics_daily (
  id            uuid  primary key default gen_random_uuid(),
  user_id       uuid  not null references public.profiles(id) on delete cascade,
  server_id     uuid  references public.servers(id) on delete set null,
  date          date  not null,
  text_messages int   not null default 0 check (text_messages >= 0),
  voice_minutes int   not null default 0 check (voice_minutes >= 0),
  credits       int   not null default 0 check (credits >= 0),
  created_at    timestamptz not null default now()
  -- NOTE: no unique constraint here — nulls in server_id break standard unique.
  -- Uniqueness is enforced by the partial indexes below.
);

-- Partial unique indexes handle the NULL serverId case correctly in PostgreSQL.
-- Two rows with the same (user_id, date) but server_id=NULL would violate
-- the NULL-safe index; rows with non-null server_id use the standard index.
create unique index if not exists analytics_daily_with_server_idx
  on public.analytics_daily(user_id, server_id, date)
  where server_id is not null;

create unique index if not exists analytics_daily_null_server_idx
  on public.analytics_daily(user_id, date)
  where server_id is null;

create index if not exists analytics_daily_user_date_idx on public.analytics_daily(user_id, date);

-- RLS
alter table public.analytics_daily enable row level security;
drop policy if exists "analytics: owner all" on public.analytics_daily;
create policy "analytics: owner all" on public.analytics_daily
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── RPC: increment_analytics ──────────────────────────────────────────────────
-- Atomically upsert analytics for a user/server/date.
-- Handles the NULL server_id case correctly via separate code paths.
create or replace function public.increment_analytics(
  p_user_id       uuid,
  p_server_id     uuid,
  p_date          date,
  p_text_messages int  default 0,
  p_voice_minutes int  default 0,
  p_credits       int  default 0
)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_existing_id uuid;
begin
  -- Guard: only allow authenticated user to update their own rows
  if auth.uid() != p_user_id then
    raise exception 'Unauthorized: cannot update analytics for another user';
  end if;

  if p_server_id is null then
    -- Manual upsert for NULL server_id (standard ON CONFLICT can't match NULLs)
    select id into v_existing_id
    from public.analytics_daily
    where user_id = p_user_id and server_id is null and date = p_date
    limit 1;

    if v_existing_id is not null then
      update public.analytics_daily set
        text_messages = text_messages + p_text_messages,
        voice_minutes = voice_minutes + p_voice_minutes,
        credits       = credits       + p_credits
      where id = v_existing_id;
    else
      insert into public.analytics_daily
        (user_id, server_id, date, text_messages, voice_minutes, credits)
      values
        (p_user_id, null, p_date, p_text_messages, p_voice_minutes, p_credits);
    end if;
  else
    -- Standard upsert for non-null server_id
    insert into public.analytics_daily
      (user_id, server_id, date, text_messages, voice_minutes, credits)
    values
      (p_user_id, p_server_id, p_date, p_text_messages, p_voice_minutes, p_credits)
    on conflict on constraint analytics_daily_with_server_idx do update set
      text_messages = analytics_daily.text_messages + excluded.text_messages,
      voice_minutes = analytics_daily.voice_minutes + excluded.voice_minutes,
      credits       = analytics_daily.credits       + excluded.credits;
  end if;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: memory_nodes
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.memory_nodes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  server_id   uuid        references public.servers(id) on delete cascade,
  content     text        not null check (char_length(content) between 1 and 4096),
  scope       text        not null default 'server'
              check (scope in ('user', 'server', 'global')),
  target_user text        check (char_length(target_user) <= 128),
  created_at  timestamptz not null default now()
);

-- RLS
alter table public.memory_nodes enable row level security;
drop policy if exists "memory_nodes: owner all" on public.memory_nodes;
create policy "memory_nodes: owner all" on public.memory_nodes
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists memory_nodes_user_id_idx    on public.memory_nodes(user_id);
create index if not exists memory_nodes_server_id_idx  on public.memory_nodes(server_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: activity_feed
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.activity_feed (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  server_id  uuid        references public.servers(id) on delete set null,
  event_type text        not null check (char_length(event_type) <= 64),
  channel    text        check (char_length(channel) <= 128),
  actor      text        check (char_length(actor) <= 128),
  details    text        not null default '' check (char_length(details) <= 512),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.activity_feed enable row level security;
drop policy if exists "activity_feed: owner all" on public.activity_feed;
create policy "activity_feed: owner all" on public.activity_feed
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists activity_feed_user_id_idx    on public.activity_feed(user_id);
create index if not exists activity_feed_created_at_idx on public.activity_feed(user_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: billing_history
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.billing_history (
  id          uuid         primary key default gen_random_uuid(),
  user_id     uuid         not null references public.profiles(id) on delete cascade,
  amount      numeric(10,2) not null check (amount >= 0),
  status      text         not null default 'paid'
              check (status in ('paid', 'pending', 'failed', 'refunded')),
  description text         check (char_length(description) <= 256),
  invoice_url text         check (char_length(invoice_url) <= 2048),
  -- Razorpay payment details (nullable for free plan changes)
  razorpay_order_id   text check (char_length(razorpay_order_id) <= 64),
  razorpay_payment_id text check (char_length(razorpay_payment_id) <= 64),
  created_at  timestamptz  not null default now()
);

-- RLS
alter table public.billing_history enable row level security;
drop policy if exists "billing_history: owner all" on public.billing_history;
create policy "billing_history: owner all" on public.billing_history
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes
create index if not exists billing_history_user_id_idx on public.billing_history(user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: razorpay_orders
-- Server-side Razorpay order tracking for secure payment verification.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.razorpay_orders (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles(id) on delete cascade,
  razorpay_order_id  text        not null unique check (char_length(razorpay_order_id) <= 64),
  plan_id            text        not null check (plan_id in ('basic', 'pro', 'max')),
  amount_paise       int         not null check (amount_paise > 0),
  currency           text        not null default 'INR',
  coupon_code        text        check (char_length(coupon_code) <= 32),
  status             text        not null default 'created'
                                 check (status in ('created', 'paid', 'failed', 'expired')),
  paid_at            timestamptz,
  created_at         timestamptz not null default now(),
  expires_at         timestamptz not null default (now() + interval '30 minutes')
);

-- RLS
alter table public.razorpay_orders enable row level security;
drop policy if exists "razorpay_orders: owner select" on public.razorpay_orders;
create policy "razorpay_orders: owner select" on public.razorpay_orders
  for select using (auth.uid() = user_id);

-- Index
create index if not exists razorpay_orders_user_id_idx on public.razorpay_orders(user_id);
create index if not exists razorpay_orders_status_idx  on public.razorpay_orders(status, expires_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC: seed_demo_data
-- Called once per user after first sign-in to populate demo content.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.seed_demo_data(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_server1_id uuid;
  v_server2_id uuid;
  v_server3_id uuid;
  v_i          int;
  v_day        date;
  v_existing   int;
begin
  -- Guard: only allow users to seed their own account
  if auth.uid() != p_user_id then
    raise exception 'Unauthorized';
  end if;

  -- Skip if already seeded (any servers exist)
  select count(*) into v_existing from public.servers where user_id = p_user_id;
  if v_existing > 0 then
    return;
  end if;

  -- Demo servers
  insert into public.servers
    (user_id, server_name, discord_server_id, member_count, channel_count, status, tier, ai_mode)
  values
    (p_user_id, 'Gaming Hub',    '716128431925887017', 342, 12, 'online',  'pro', 'chat'),
    (p_user_id, 'Study Server',  '355519669412560906', 128,  5, 'online',  'pro', 'tutor'),
    (p_user_id, 'Dev Community', '799126090757783552', 891, 24, 'offline', 'pro', 'coder');

  select id into v_server1_id from public.servers where user_id = p_user_id and server_name = 'Gaming Hub';
  select id into v_server2_id from public.servers where user_id = p_user_id and server_name = 'Study Server';
  select id into v_server3_id from public.servers where user_id = p_user_id and server_name = 'Dev Community';

  -- 30 days of analytics
  for v_i in 0..29 loop
    v_day := current_date - v_i;
    insert into public.analytics_daily
      (user_id, server_id, date, text_messages, voice_minutes, credits)
    values
      (p_user_id, v_server1_id, v_day, 100+floor(random()*400)::int, 20+floor(random()*150)::int, 200+floor(random()*800)::int),
      (p_user_id, v_server2_id, v_day,  50+floor(random()*200)::int, 10+floor(random()*60)::int,  100+floor(random()*400)::int),
      (p_user_id, v_server3_id, v_day, 200+floor(random()*600)::int, 30+floor(random()*200)::int, 400+floor(random()*1200)::int)
    on conflict do nothing;
  end loop;

  -- Memory nodes
  insert into public.memory_nodes (user_id, server_id, content, scope, target_user) values
    (p_user_id, v_server1_id, 'User @GamingKing prefers FPS game discussions',   'user',   'GamingKing'),
    (p_user_id, v_server1_id, 'Server hosts weekly tournament on Fridays',        'server',  null),
    (p_user_id, v_server2_id, 'Study group focused on Computer Science',          'server',  null),
    (p_user_id, v_server2_id, 'User @StudyHero prefers detailed explanations',   'user',   'StudyHero'),
    (p_user_id, v_server3_id, 'Team uses TypeScript and React primarily',         'server',  null),
    (p_user_id, v_server3_id, 'Daily standup happens at 9am UTC',                 'server',  null);

  -- Activity feed
  insert into public.activity_feed (user_id, server_id, event_type, channel, actor, details) values
    (p_user_id, v_server1_id, 'message_sent',     '#general',      'GamingKing',  'Asked about Valorant strategy'),
    (p_user_id, v_server1_id, 'voice_joined',     'Game Night',    'Squad_Leader','Joined voice channel'),
    (p_user_id, v_server2_id, 'command_executed', '#bot-commands', 'StudyHero',   'Used /tutor for calculus help'),
    (p_user_id, v_server3_id, 'message_sent',     '#code-review',  'DevUser42',   'Requested code review for PR #142'),
    (p_user_id, v_server1_id, 'setting_changed',  null,            'Admin',       'AI mode changed to /chaos'),
    (p_user_id, v_server2_id, 'memory_saved',     '#general',      'Bot',         'Saved new memory node for user'),
    (p_user_id, v_server3_id, 'voice_joined',     'Standup',       'TeamLead',    'Daily standup started'),
    (p_user_id, v_server1_id, 'command_executed', '#bot-commands', 'Player99',    'Used /trivia command');

  -- Billing history
  insert into public.billing_history (user_id, amount, status, description) values
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly (demo)'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly (demo)'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly (demo)');

  -- Bump profile to Pro for demo
  update public.profiles
  set tier = 'pro', credits_limit = 25000, credits_used = 12153
  where id = p_user_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Grant execute on public RPCs to authenticated users
-- ─────────────────────────────────────────────────────────────────────────────
grant execute on function public.seed_demo_data(uuid)       to authenticated;
grant execute on function public.increment_analytics(uuid, uuid, date, int, int, int) to authenticated;
