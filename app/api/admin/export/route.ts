import { srv, requireAdmin } from "@/lib/db";
export async function GET() {
  if (!(await requireAdmin())) return new Response("Unauthorized", { status: 401 });
  const { data } = await srv().from("participants").select("*").order("created_at"); const rows: any[] = data ?? [];
  const cols = ["reg_id","full_name","mobile","whatsapp","division","sector","unit","institution","qualification","created_at","checked_in_at"];
  const esc = (v: any) => { let s = String(v ?? ""); if (/^[=+\-@]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const csv = "\ufeff" + [cols.join(","), ...rows.map(r => cols.map(c => esc(r[c])).join(","))].join("\n");
  return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=participants.csv" } });
}
