-- Run ONCE in Supabase SQL Editor. Replaces the 6 placeholder programme cards with 4 sessions.
alter table programmes add column if not exists image_url text;
delete from programmes;
insert into programmes(icon,title,body,sort) values
('', U&'\0D38\0D46\0D37\0D7B 1','',1),
('', U&'\0D38\0D46\0D37\0D7B 2','',2),
('', U&'\0D38\0D46\0D37\0D7B 3','',3),
('', U&'\0D38\0D46\0D37\0D7B 4','',4);
