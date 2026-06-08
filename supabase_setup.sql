-- DA-40 Weight and Balance Supabase setup
-- Paste this whole file into Supabase SQL Editor and click Run.

create table if not exists public.aircraft (
  tail_number text primary key,
  empty_weight numeric(7,2) not null,
  empty_arm numeric(6,2) not null,
  empty_moment numeric(10,2) not null,
  extended_baggage boolean not null default false,
  active boolean not null default true,
  notes text,
  updated_at timestamptz not null default now()
);

alter table public.aircraft enable row level security;

drop policy if exists "Public can read active aircraft" on public.aircraft;

create policy "Public can read active aircraft"
on public.aircraft
for select
to anon
using (active = true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_aircraft_updated_at on public.aircraft;

create trigger set_aircraft_updated_at
before update on public.aircraft
for each row
execute function public.set_updated_at();

insert into public.aircraft
  (tail_number, empty_weight, empty_arm, empty_moment, extended_baggage, active, notes)
values
  ('N607MT', 1814.00, 96.97, 175903.58, true, true, 'Extended Baggage'),
  ('N623MT', 1811.00, 97.59, 176735.49, true, true, 'Extended Baggage'),
  ('N950MT', 1801.00, 97.48, 175561.48, true, true, 'Extended Baggage'),
  ('N951MT', 1805.50, 97.58, 176180.69, true, true, 'Extended Baggage'),
  ('N953MT', 1802.94, 97.24, 175318.74, true, true, 'Extended Baggage'),
  ('N954MT', 1798.97, 97.20, 174866.54, true, true, 'Extended Baggage'),
  ('N955MT', 1800.96, 97.28, 175163.38, true, true, 'Extended Baggage'),
  ('N956MT', 1802.06, 97.40, 175521.84, true, true, 'Extended Baggage'),
  ('N957MT', 1797.00, 97.36, 174955.92, true, true, 'Extended Baggage'),
  ('N958MT', 1860.00, 97.40, 181164.00, true, true, 'Extended Baggage'),
  ('N661MT', 1827.00, 97.37, 177894.99, true, true, 'Extended Baggage'),
  ('N662MT', 1822.00, 97.85, 178282.70, true, true, 'Extended Baggage'),
  ('N563MT', 1823.00, 97.69, 178088.87, true, true, 'Extended Baggage'),
  ('N570MT', 1754.00, 97.27, 170611.58, false, true, null),
  ('N571MT', 1808.00, 96.64, 174725.12, false, true, null),
  ('N572MT', 1768.00, 97.10, 171672.80, false, true, null),
  ('N581MT', 1771.00, 96.80, 171432.80, false, true, null),
  ('N582MT', 1764.00, 96.34, 169935.75, false, true, null),
  ('N583MT', 1763.00, 96.56, 170228.77, false, true, null),
  ('N584MT', 1788.00, 97.06, 173543.28, false, true, null),
  ('N585MT', 1745.00, 98.18, 171324.10, false, true, null),
  ('N586MT', 1757.00, 96.53, 169603.21, false, true, null),
  ('N587MT', 1792.00, 97.26, 174289.92, false, true, null),
  ('N588MT', 1796.00, 97.22, 174607.12, false, true, null),
  ('N589MT', 1787.00, 97.33, 173928.71, false, true, null),
  ('N590MT', 1807.00, 98.45, 177899.15, false, true, null),
  ('N592MT', 1800.00, 97.77, 175986.00, false, true, null),
  ('N593MT', 1823.00, 98.17, 178963.91, true, true, 'Extended Baggage'),
  ('N594MT', 1789.50, 97.48, 174440.46, false, true, null),
  ('N595MT', 1788.66, 97.59, 174555.33, false, true, null),
  ('N596MT', 1797.88, 97.37, 175059.58, false, true, null),
  ('N597MT', 1787.68, 97.15, 173673.11, false, true, null),
  ('N598MT', 1786.88, 97.05, 173416.70, false, true, null),
  ('N599MT', 1789.16, 97.27, 174031.59, false, true, null)
on conflict (tail_number) do update set
  empty_weight = excluded.empty_weight,
  empty_arm = excluded.empty_arm,
  empty_moment = excluded.empty_moment,
  extended_baggage = excluded.extended_baggage,
  active = excluded.active,
  notes = excluded.notes;

-- Quick verification queries:
-- select count(*) as active_aircraft from public.aircraft where active = true;
-- select * from public.aircraft order by tail_number;
