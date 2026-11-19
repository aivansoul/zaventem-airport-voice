create schema if not exists zaventem_voicebot;

comment on schema zaventem_voicebot is
  'Private operational registry for the independent Brussels Airport voicebot prototype.';

revoke all on schema zaventem_voicebot from public, anon, authenticated;
grant usage on schema zaventem_voicebot to service_role;

create table zaventem_voicebot.voicebot_instances (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'elevenlabs'
    check (provider in ('elevenlabs')),
  provider_agent_id text,
  label text not null,
  enabled boolean not null default false,
  is_test boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint voicebot_instances_provider_agent_unique
    unique nulls not distinct (provider, provider_agent_id)
);

create table zaventem_voicebot.knowledge_sources (
  id text primary key,
  title text not null,
  canonical_url text not null unique,
  topic text not null,
  language_code text not null default 'en'
    check (language_code in ('fr', 'nl', 'en', 'multi')),
  freshness_class text not null
    check (freshness_class in ('stable', 'semi_dynamic', 'live')),
  status text not null default 'active'
    check (status in ('active', 'needs_review', 'conflict', 'retired')),
  last_verified_at timestamptz not null,
  next_review_at timestamptz not null,
  last_http_status smallint
    check (last_http_status is null or last_http_status between 100 and 599),
  etag text,
  last_modified text,
  content_sha256 text
    check (content_sha256 is null or content_sha256 ~ '^[0-9a-f]{64}$'),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_sources_review_order
    check (next_review_at >= last_verified_at)
);

create table zaventem_voicebot.refresh_runs (
  id uuid primary key default gen_random_uuid(),
  trigger_kind text not null
    check (trigger_kind in ('manual', 'n8n_schedule', 'release_check')),
  status text not null default 'running'
    check (status in ('running', 'succeeded', 'partial', 'failed', 'cancelled')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  source_count integer not null default 0 check (source_count >= 0),
  changed_count integer not null default 0 check (changed_count >= 0),
  conflict_count integer not null default 0 check (conflict_count >= 0),
  error_summary jsonb not null default '[]'::jsonb,
  constraint refresh_runs_finish_order
    check (finished_at is null or finished_at >= started_at),
  constraint refresh_runs_error_summary_array
    check (jsonb_typeof(error_summary) = 'array')
);

create table zaventem_voicebot.source_versions (
  id bigint generated always as identity primary key,
  source_id text not null
    references zaventem_voicebot.knowledge_sources(id)
    on update cascade on delete restrict,
  refresh_run_id uuid not null
    references zaventem_voicebot.refresh_runs(id)
    on update cascade on delete restrict,
  retrieved_at timestamptz not null default now(),
  http_status smallint not null check (http_status between 100 and 599),
  normalized_sha256 text
    check (normalized_sha256 is null or normalized_sha256 ~ '^[0-9a-f]{64}$'),
  changed boolean not null default false,
  review_required boolean not null default false,
  summary text,
  response_metadata jsonb not null default '{}'::jsonb,
  constraint source_versions_metadata_object
    check (jsonb_typeof(response_metadata) = 'object')
);

create index knowledge_sources_review_queue_idx
  on zaventem_voicebot.knowledge_sources (next_review_at, freshness_class)
  where status in ('active', 'needs_review', 'conflict');

create index source_versions_source_retrieved_idx
  on zaventem_voicebot.source_versions (source_id, retrieved_at desc);

create index source_versions_refresh_run_idx
  on zaventem_voicebot.source_versions (refresh_run_id);

create index refresh_runs_status_started_idx
  on zaventem_voicebot.refresh_runs (status, started_at desc);

alter table zaventem_voicebot.voicebot_instances enable row level security;
alter table zaventem_voicebot.knowledge_sources enable row level security;
alter table zaventem_voicebot.refresh_runs enable row level security;
alter table zaventem_voicebot.source_versions enable row level security;

revoke all on all tables in schema zaventem_voicebot from public, anon, authenticated;
revoke all on all sequences in schema zaventem_voicebot from public, anon, authenticated;

grant select, insert, update, delete
  on all tables in schema zaventem_voicebot
  to service_role;
grant usage, select
  on all sequences in schema zaventem_voicebot
  to service_role;

alter default privileges in schema zaventem_voicebot
  revoke all on tables from public, anon, authenticated;
alter default privileges in schema zaventem_voicebot
  revoke all on sequences from public, anon, authenticated;
alter default privileges in schema zaventem_voicebot
  grant select, insert, update, delete on tables to service_role;
alter default privileges in schema zaventem_voicebot
  grant usage, select on sequences to service_role;

comment on table zaventem_voicebot.knowledge_sources is
  'Source provenance and review cadence. It stores metadata only, never copied airport pages.';
comment on table zaventem_voicebot.source_versions is
  'Immutable refresh observations and hashes; no raw copyrighted page content.';
comment on table zaventem_voicebot.refresh_runs is
  'Audit trail for authorized manual or n8n-assisted freshness checks.';
