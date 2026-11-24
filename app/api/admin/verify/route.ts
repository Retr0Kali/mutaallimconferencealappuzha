import { NextResponse } from "next/server"; import { srv, requireAdmin } from "@/lib/db";
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = String((await req.json()).reg_id).trim().toUpperCase(); const db = srv();
  const { data: p } = await db.from("participants").select("full_name,institution,checked_in_at").eq("reg_id", id).maybeSingle();
  if (!p) return NextResponse.json({ status: "invalid" });
  if (p.checked_in_at) return NextResponse.json({ status: "already", name: p.full_name, at: p.checked_in_at });
  await db.from("participants").update({ checked_in_at: new Date().toISOString() }).eq("reg_id", id);
  return NextResponse.json({ status: "ok", name: p.full_name, institution: p.institution });
}
