import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
export const pub = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!, { auth: { persistSession: false } });
export const srv = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
export async function requireAdmin() {
  const t = cookies().get("adm")?.value; if (!t) return null;
  const { data } = await srv().auth.getUser(t); if (!data.user) return null;
  const { data: a } = await srv().from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  return a ? data.user : null;
}
