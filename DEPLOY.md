# SSF Muta'allim Conference 2026 - Free Hosting (GitHub + Vercel + Supabase)

## A. Supabase (database) - once
1. supabase.com -> New project (free).
2. SQL Editor -> run `supabase/schema.sql`, then `supabase/schema2.sql`.
3. Authentication -> Users -> Add user (admin email+password, Auto Confirm). Copy its UID.
4. SQL Editor -> `insert into admin_users values ('UID');`
5. Settings -> API Keys: copy Project URL, Publishable key, Secret key.
   (Never share/commit the Secret key.)

## B. GitHub
    cd ssf && git init && git add . && git commit -m "SSF site"
    git branch -M main
    git remote add origin https://github.com/<you>/ssf-mutallim-2026.git
    git push -u origin main
(.gitignore already excludes .env files.)

## C. Vercel (free Hobby plan)
1. vercel.com -> Sign up with GitHub -> Add New -> Project -> import the repo.
2. Environment Variables (add all 3):
   - NEXT_PUBLIC_SUPABASE_URL = https://<project>.supabase.co
   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = sb_publishable_...
   - SUPABASE_SERVICE_ROLE_KEY = sb_secret_...   (secret key goes here)
3. Deploy. Every `git push` redeploys automatically.

## D. Test checklist
- Home loads, countdown runs, cards show Malayalam text.
- /register: complete a test registration -> success page + QR.
- Same mobile again -> "already registered" message.
- /admin/login -> dashboard shows the registration.
- Admin -> QR Check-in -> scan (phone, HTTPS) -> green; scan again -> yellow.
- Admin -> Posters: upload an image -> appears on home gallery.
- Delete test registrations before launch.
