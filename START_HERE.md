# START HERE (clean start)
1. Supabase: new project -> SQL Editor: run supabase/schema.sql, then supabase/schema2.sql
2. Authentication -> Users -> Add user (Auto Confirm) -> copy UID -> SQL Editor:
   insert into admin_users values ('UID');
3. Settings -> API Keys: copy Project URL, Publishable key, Secret key (never paste in chat)
4. Local test: ./run.sh   (asks for the 3 values)  -> http://localhost:3000
5. GitHub: ./push.sh  (creates private repo + pushes)
6. Vercel: Import repo -> add the 3 env variables (names in .env.example) -> Deploy
7. After env change on Vercel: Deployments -> Redeploy (untick build cache)
