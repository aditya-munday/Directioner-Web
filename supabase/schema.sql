-- ═══════════════════════════════════════════════════════════════════════════
-- DIRECTIONER — Supabase Schema
-- Run this entire file in your Supabase SQL Editor (dashboard.supabase.com)
-- Project Settings → SQL Editor → New Query → Paste → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  username      text        not null default 'user',
  full_name     text,
  avatar_url    text,
  tier          text        not null default 'free' check (tier in ('free','basic','pro','max')),
  credits_used  int         not null default 0,
  credits_limit int         not null default 500,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profile_select" on public.profiles for select using (auth.uid() = id);
create policy "profile_update" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'user_name',
      split_part(coalesce(new.raw_user_meta_data->>'full_name', new.email, ''), ' ', 1),
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    full_name  = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Servers ───────────────────────────────────────────────────────────────────
create table if not exists public.servers (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references public.profiles(id) on delete cascade,
  server_name        text        not null,
  discord_server_id  text        not null,
  member_count       int         not null default 0,
  channel_count      int         not null default 0,
  status             text        not null default 'online' check (status in ('online','offline','maintenance')),
  tier               text        not null default 'free',
  ai_mode            text        not null default 'chat',
  created_at         timestamptz not null default now(),
  unique(user_id, discord_server_id)
);

alter table public.servers enable row level security;
create policy "servers_all" on public.servers for all using (auth.uid() = user_id);

-- ── Analytics Daily ───────────────────────────────────────────────────────────
create table if not exists public.analytics_daily (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references public.profiles(id) on delete cascade,
  server_id      uuid        references public.servers(id) on delete set null,
  date           date        not null,
  text_messages  int         not null default 0,
  voice_minutes  int         not null default 0,
  credits        int         not null default 0,
  created_at     timestamptz not null default now(),
  unique(user_id, server_id, date)
);

alter table public.analytics_daily enable row level security;
create policy "analytics_all" on public.analytics_daily for all using (auth.uid() = user_id);

-- Enable Realtime for analytics
alter publication supabase_realtime add table public.analytics_daily;

-- ── Memory Nodes ──────────────────────────────────────────────────────────────
create table if not exists public.memory_nodes (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  server_id   uuid        references public.servers(id) on delete cascade,
  content     text        not null,
  scope       text        not null default 'server' check (scope in ('user','server','global')),
  target_user text,
  created_at  timestamptz not null default now()
);

alter table public.memory_nodes enable row level security;
create policy "memory_all" on public.memory_nodes for all using (auth.uid() = user_id);

-- ── Activity Feed ─────────────────────────────────────────────────────────────
create table if not exists public.activity_feed (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  server_id  uuid        references public.servers(id) on delete set null,
  event_type text        not null,
  channel    text,
  actor      text,
  details    text        not null default '',
  created_at timestamptz not null default now()
);

alter table public.activity_feed enable row level security;
create policy "activity_all" on public.activity_feed for all using (auth.uid() = user_id);

-- Enable Realtime for activity
alter publication supabase_realtime add table public.activity_feed;

-- ── Billing History ───────────────────────────────────────────────────────────
create table if not exists public.billing_history (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  amount      numeric(10,2) not null,
  status      text        not null default 'paid' check (status in ('paid','pending','failed','refunded')),
  description text,
  invoice_url text,
  created_at  timestamptz not null default now()
);

alter table public.billing_history enable row level security;
create policy "billing_select" on public.billing_history for select using (auth.uid() = user_id);
create policy "billing_insert" on public.billing_history for insert with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED FUNCTION — called by the app after first login to populate demo data
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function public.seed_demo_data(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  v_server1_id uuid;
  v_server2_id uuid;
  v_server3_id uuid;
  v_day date;
  v_i int;
begin
  -- Only seed if no servers exist
  if exists (select 1 from public.servers where user_id = p_user_id) then
    return;
  end if;

  -- Insert demo servers
  insert into public.servers (user_id, server_name, discord_server_id, member_count, channel_count, status, tier, ai_mode)
  values
    (p_user_id, 'Gaming Hub', '716128431925887017', 342, 12, 'online', 'pro', 'chat'),
    (p_user_id, 'Study Server', '355519669412560906', 128, 5, 'online', 'pro', 'tutor'),
    (p_user_id, 'Dev Community', '799126090757783552', 891, 24, 'offline', 'pro', 'coder')
  returning id into v_server1_id;

  select id into v_server1_id from public.servers where user_id = p_user_id and server_name = 'Gaming Hub';
  select id into v_server2_id from public.servers where user_id = p_user_id and server_name = 'Study Server';
  select id into v_server3_id from public.servers where user_id = p_user_id and server_name = 'Dev Community';

  -- Insert 30 days of analytics
  for v_i in 0..29 loop
    v_day := current_date - v_i;
    insert into public.analytics_daily (user_id, server_id, date, text_messages, voice_minutes, credits)
    values
      (p_user_id, v_server1_id, v_day, 100 + floor(random()*400)::int, 20 + floor(random()*150)::int, 200 + floor(random()*800)::int),
      (p_user_id, v_server2_id, v_day, 50 + floor(random()*200)::int, 10 + floor(random()*60)::int, 100 + floor(random()*400)::int),
      (p_user_id, v_server3_id, v_day, 200 + floor(random()*600)::int, 30 + floor(random()*200)::int, 400 + floor(random()*1200)::int)
    on conflict (user_id, server_id, date) do nothing;
  end loop;

  -- Memory nodes
  insert into public.memory_nodes (user_id, server_id, content, scope, target_user) values
    (p_user_id, v_server1_id, 'User @GamingKing prefers FPS game discussions', 'user', 'GamingKing'),
    (p_user_id, v_server1_id, 'Server hosts weekly tournament on Fridays', 'server', null),
    (p_user_id, v_server2_id, 'Study group focused on Computer Science', 'server', null),
    (p_user_id, v_server2_id, 'User @StudyHero prefers detailed explanations', 'user', 'StudyHero'),
    (p_user_id, v_server3_id, 'Team uses TypeScript and React primarily', 'server', null),
    (p_user_id, v_server3_id, 'Daily standup happens at 9am UTC', 'server', null);

  -- Activity feed
  insert into public.activity_feed (user_id, server_id, event_type, channel, actor, details) values
    (p_user_id, v_server1_id, 'message_sent', '#general', 'GamingKing', 'Asked about Valorant strategy'),
    (p_user_id, v_server1_id, 'voice_joined', 'Game Night', 'Squad_Leader', 'Joined voice channel'),
    (p_user_id, v_server2_id, 'command_executed', '#bot-commands', 'StudyHero', 'Used /tutor for calculus help'),
    (p_user_id, v_server3_id, 'message_sent', '#code-review', 'DevUser42', 'Requested code review for PR #142'),
    (p_user_id, v_server1_id, 'setting_changed', null, 'Admin', 'AI mode changed to /chaos'),
    (p_user_id, v_server2_id, 'memory_saved', '#general', 'Bot', 'Saved new memory node for user'),
    (p_user_id, v_server3_id, 'voice_joined', 'Standup', 'TeamLead', 'Daily standup started'),
    (p_user_id, v_server1_id, 'command_executed', '#bot-commands', 'Player99', 'Used /trivia command');

  -- Billing history
  insert into public.billing_history (user_id, amount, status, description) values
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly'),
    (p_user_id, 14.99, 'paid', 'Pro Plan — Monthly');

  -- Update profile tier to pro
  update public.profiles set tier = 'pro', credits_limit = 25000, credits_used = 12153 where id = p_user_id;
end;
$$;
