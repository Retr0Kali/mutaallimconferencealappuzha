create table event(id int primary key default 1 check(id=1), title text, subtitle text, tagline text, starts_at timestamptz, venue text);
create table benefits(id serial primary key, icon text, title text, body text, sort int default 0);
create table programmes(id serial primary key, icon text, title text, body text, sort int default 0);
create table posters(id serial primary key, url text not null, sort int default 0);
create table admin_users(user_id uuid primary key references auth.users on delete cascade);
create table participants(
 id uuid primary key default gen_random_uuid(), reg_id text unique not null,
 full_name text not null, age int not null check(age between 5 and 80),
 mobile text unique not null check(mobile ~ '^[6-9][0-9]{9}$'), whatsapp text not null,
 address text not null, zone text not null, institution text not null, course text not null,
 level text not null, teacher text, attend_type text not null, companions int default 0,
 requirements text, checked_in_at timestamptz, created_at timestamptz default now());
alter table event enable row level security; alter table benefits enable row level security;
alter table programmes enable row level security; alter table posters enable row level security;
alter table admin_users enable row level security; alter table participants enable row level security;
create policy pub_event on event for select using(true);
create policy pub_ben on benefits for select using(true);
create policy pub_prog on programmes for select using(true);
create policy pub_post on posters for select using(true);
create function is_admin() returns boolean language sql security definer as $$ select exists(select 1 from admin_users where user_id=auth.uid()) $$;
create policy adm_event on event for all using(is_admin()) with check(is_admin());
create policy adm_ben on benefits for all using(is_admin()) with check(is_admin());
create policy adm_prog on programmes for all using(is_admin()) with check(is_admin());
create policy adm_post on posters for all using(is_admin()) with check(is_admin());
create policy adm_part on participants for all using(is_admin()) with check(is_admin());
-- participants has NO public policy: inserts happen only via the server API (service role).
insert into event values(1,U&'\0D1C\0D3F\0D32\0D4D\0D32\0D3E \0D2E\0D41\0D24\0D4D\0D24\0D05\0D32\0D4D\0D32\0D3F\0D02 \0D38\0D2E\0D4D\0D2E\0D47\0D33\0D28\0D02','SAMASTHA CENTENARY CELEBRATIONS',U&'\0D05\0D31\0D3F\0D35\0D3F\0D28\0D4D\0D31\0D46 \0D35\0D46\0D33\0D3F\0D1A\0D4D\0D1A\0D02, \0D09\0D2E\0D4D\0D2E\0D24\0D4D\0D24\0D3F\0D28\0D4D\0D31\0D46 \0D2D\0D3E\0D35\0D3F','2027-01-10 09:00+05:30',U&'\0D35\0D47\0D26\0D3F (\0D0E\0D21\0D3F\0D31\0D4D\0D31\0D4D \0D1A\0D46\0D2F\0D4D\0D2F\0D3E\0D02), \0D06\0D32\0D2A\0D4D\0D2A\0D41\0D34');
insert into benefits(icon,title,body,sort) values
(U&'\2728',U&'\0D06\0D24\0D4D\0D2E\0D40\0D2F \0D09\0D23\0D7C\0D35\0D4D',U&'\0D39\0D43\0D26\0D2F\0D24\0D4D\0D24\0D46 \0D24\0D4A\0D1F\0D41\0D28\0D4D\0D28 \0D06\0D24\0D4D\0D2E\0D40\0D2F \0D05\0D28\0D41\0D2D\0D35\0D02',1),(U&'\+01F4DA',U&'\0D35\0D3F\0D1C\0D4D\0D1E\0D3E\0D28 \0D38\0D2E\0D4D\0D2A\0D3E\0D26\0D28\0D02',U&'\0D2A\0D41\0D24\0D3F\0D2F \0D05\0D31\0D3F\0D35\0D41\0D15\0D33\0D3F\0D32\0D47\0D15\0D4D\0D15\0D41\0D33\0D4D\0D33 \0D35\0D3E\0D24\0D3F\0D7D',2),
(U&'\+01F54C',U&'\0D2A\0D23\0D4D\0D21\0D3F\0D24\0D30\0D41\0D2E\0D3E\0D2F\0D41\0D33\0D4D\0D33 \0D38\0D02\0D35\0D3E\0D26\0D02',U&'\0D2A\0D23\0D4D\0D21\0D3F\0D24\0D30\0D4B\0D1F\0D4D \0D28\0D47\0D30\0D3F\0D1F\0D4D\0D1F\0D4D \0D38\0D02\0D35\0D26\0D3F\0D15\0D4D\0D15\0D3E\0D02',3),(U&'\+01F4A1',U&'\0D2A\0D41\0D24\0D3F\0D2F \0D2A\0D20\0D28\0D3E\0D28\0D41\0D2D\0D35\0D19\0D4D\0D19\0D7E',U&'\0D2A\0D41\0D24\0D41\0D2E\0D2F\0D41\0D33\0D4D\0D33 \0D2A\0D20\0D28\0D30\0D40\0D24\0D3F\0D15\0D7E',4),
(U&'\+01F331',U&'\0D35\0D4D\0D2F\0D15\0D4D\0D24\0D3F\0D24\0D4D\0D35 \0D35\0D3F\0D15\0D38\0D28\0D02',U&'\0D28\0D3F\0D19\0D4D\0D19\0D33\0D3F\0D32\0D46 \0D15\0D34\0D3F\0D35\0D41\0D15\0D7E \0D35\0D33\0D7C\0D24\0D4D\0D24\0D3E\0D02',5),(U&'\+01F91D',U&'\0D38\0D57\0D39\0D43\0D26\0D19\0D4D\0D19\0D33\0D41\0D1F\0D46 \0D2A\0D41\0D24\0D3F\0D2F \0D32\0D4B\0D15\0D02',U&'\0D38\0D39\0D2F\0D3E\0D24\0D4D\0D30\0D3F\0D15\0D30\0D46 \0D15\0D23\0D4D\0D1F\0D46\0D24\0D4D\0D24\0D3E\0D02',6),
(U&'\+01F9ED',U&'\0D38\0D02\0D18\0D1F\0D28\0D3E \0D2C\0D4B\0D27\0D02',U&'\0D26\0D57\0D24\0D4D\0D2F\0D3E\0D35\0D2C\0D4B\0D27\0D02',7),(U&'\+01F305',U&'\0D2D\0D3E\0D35\0D3F\0D2F\0D3F\0D32\0D47\0D15\0D4D\0D15\0D41\0D33\0D4D\0D33 \0D26\0D3F\0D36\0D3E\0D2C\0D4B\0D27\0D02',U&'\0D28\0D3E\0D33\0D46\0D2F\0D46 \0D30\0D42\0D2A\0D2A\0D4D\0D2A\0D46\0D1F\0D41\0D24\0D4D\0D24\0D3E\0D02',8);
insert into programmes(icon,title,body,sort) values
(U&'\+01F4D6',U&'\0D35\0D3F\0D1C\0D4D\0D1E\0D3E\0D28 \0D38\0D46\0D37\0D28\0D41\0D15\0D7E',U&'\0D35\0D3F\0D36\0D26\0D3E\0D02\0D36\0D19\0D4D\0D19\0D7E \0D09\0D1F\0D7B',1),(U&'\+01F393',U&'\0D2A\0D23\0D4D\0D21\0D3F\0D24 \0D38\0D02\0D17\0D2E\0D02',U&'\0D35\0D3F\0D36\0D26\0D3E\0D02\0D36\0D19\0D4D\0D19\0D7E \0D09\0D1F\0D7B',2),(U&'\+01F5E3\FE0F',U&'\0D38\0D02\0D35\0D3E\0D26 \0D35\0D47\0D26\0D3F\0D15\0D7E',U&'\0D35\0D3F\0D36\0D26\0D3E\0D02\0D36\0D19\0D4D\0D19\0D7E \0D09\0D1F\0D7B',3),
(U&'\+01F319',U&'\0D06\0D24\0D4D\0D2E\0D40\0D2F \0D38\0D26\0D38\0D4D\0D38\0D4D',U&'\0D35\0D3F\0D36\0D26\0D3E\0D02\0D36\0D19\0D4D\0D19\0D7E \0D09\0D1F\0D7B',4),(U&'\+01F465',U&'\0D35\0D3F\0D26\0D4D\0D2F\0D3E\0D7C\0D24\0D4D\0D25\0D3F \0D15\0D42\0D1F\0D4D\0D1F\0D3E\0D2F\0D4D\0D2E',U&'\0D35\0D3F\0D36\0D26\0D3E\0D02\0D36\0D19\0D4D\0D19\0D7E \0D09\0D1F\0D7B',5),(U&'\2B50',U&'\0D2A\0D4D\0D30\0D24\0D4D\0D2F\0D47\0D15 \0D05\0D24\0D3F\0D25\0D3F\0D15\0D7E',U&'\0D35\0D3F\0D36\0D26\0D3E\0D02\0D36\0D19\0D4D\0D19\0D7E \0D09\0D1F\0D7B',6);
-- After creating an admin user in Supabase Auth: insert into admin_users values('<user uuid>');
