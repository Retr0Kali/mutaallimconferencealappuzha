-- Run AFTER schema.sql : public storage bucket for posters (uploads go through the server API only)
insert into storage.buckets(id,name,public) values('posters','posters',true) on conflict do nothing;
