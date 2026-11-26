-- Run ONCE in Supabase SQL Editor BEFORE deploying the new form (safe to re-run)
alter table participants add column if not exists division text;
alter table participants add column if not exists sector text;
alter table participants add column if not exists unit text;
alter table participants add column if not exists qualification text;
alter table participants alter column age drop not null;
alter table participants alter column address drop not null;
alter table participants alter column zone drop not null;
alter table participants alter column course drop not null;
alter table participants alter column level drop not null;
alter table participants alter column attend_type drop not null;
