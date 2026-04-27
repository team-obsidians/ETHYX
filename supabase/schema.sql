-- ETHYX AI Schema Definition

-- Enable necessary extensions
create extension if not exists "pgcrypto";

-- ====================================================================================
-- TABLE: audits
-- ====================================================================================
create table if not exists public.audits (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    file_name text not null,
    file_size bigint not null,
    blob_path text not null,
    row_count integer,
    column_count integer,
    target_column text not null,
    prediction_column text,
    protected_attributes jsonb not null,
    positive_label text,
    task_type text not null default 'binary_classification',
    domain text not null default 'general',
    strictness text not null default 'standard',
    status text not null default 'uploaded',
    risk_score integer,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_audits_user_id on public.audits(user_id);
create index if not exists idx_audits_status on public.audits(status);
create index if not exists idx_audits_created_at on public.audits(created_at);

-- RLS Policies
alter table public.audits enable row level security;

create policy "Users can insert their own audits" 
    on public.audits for insert 
    with check (auth.uid() = user_id);

create policy "Users can view their own audits" 
    on public.audits for select 
    using (auth.uid() = user_id);

create policy "Users can update their own audits" 
    on public.audits for update 
    using (auth.uid() = user_id);

create policy "Users can delete their own audits" 
    on public.audits for delete 
    using (auth.uid() = user_id);

-- ====================================================================================
-- TABLE: fairness_results
-- ====================================================================================
create table if not exists public.fairness_results (
    id uuid primary key default gen_random_uuid(),
    audit_id uuid not null references public.audits(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    overall_risk_score integer,
    risk_level text,
    metrics jsonb not null,
    group_results jsonb,
    warnings jsonb,
    recommendations jsonb,
    created_at timestamptz default now()
);

create index if not exists idx_fairness_results_audit_id on public.fairness_results(audit_id);
create index if not exists idx_fairness_results_user_id on public.fairness_results(user_id);

-- RLS Policies
alter table public.fairness_results enable row level security;

create policy "Users can view their own fairness results" 
    on public.fairness_results for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own fairness results" 
    on public.fairness_results for insert 
    with check (auth.uid() = user_id);

-- ====================================================================================
-- TABLE: audit_events
-- ====================================================================================
create table if not exists public.audit_events (
    id uuid primary key default gen_random_uuid(),
    audit_id uuid not null references public.audits(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    event_type text not null,
    message text not null,
    metadata jsonb,
    created_at timestamptz default now()
);

create index if not exists idx_audit_events_audit_id on public.audit_events(audit_id);
create index if not exists idx_audit_events_user_id on public.audit_events(user_id);

-- RLS Policies
alter table public.audit_events enable row level security;

create policy "Users can view their own audit events" 
    on public.audit_events for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own audit events" 
    on public.audit_events for insert 
    with check (auth.uid() = user_id);
