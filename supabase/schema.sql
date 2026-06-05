-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free', 'starter', 'pro')),
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- contracts table
create table public.contracts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null,
  jurisdiction text not null,
  content text,
  structured_data jsonb default '{}',
  status text default 'draft' check (status in ('draft', 'final')),
  category text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.contracts enable row level security;

create policy "Users can view their own contracts"
  on public.contracts for select using (auth.uid() = user_id);

create policy "Users can insert their own contracts"
  on public.contracts for insert with check (auth.uid() = user_id);

create policy "Users can update their own contracts"
  on public.contracts for update using (auth.uid() = user_id);

create policy "Users can delete their own contracts"
  on public.contracts for delete using (auth.uid() = user_id);

-- employees table
create table public.employees (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  role text,
  department text,
  contract_id uuid references public.contracts(id) on delete set null,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table public.employees enable row level security;

create policy "Users can manage their own employees"
  on public.employees for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'free'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
