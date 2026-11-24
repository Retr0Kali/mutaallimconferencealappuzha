import { NextResponse } from "next/server"; import { pub, srv } from "@/lib/db";
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const { data, error } = await pub().auth.signInWithPassword({ email, password });
  if (error || !data.session) return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  const { data: a } = await srv().from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!a) return NextResponse.json({ error: "Not an admin" }, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("adm", data.session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 3600 });
  return res;
}
