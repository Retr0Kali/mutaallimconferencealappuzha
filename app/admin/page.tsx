import { redirect } from "next/navigation"; import { srv, requireAdmin } from "@/lib/db"; import AdminPanel from "@/components/AdminPanel";
export const dynamic = "force-dynamic";
export default async function Admin() {
  if (!(await requireAdmin())) redirect("/admin/login"); const db = srv();
  const [p, e, b, g, s] = await Promise.all([db.from("participants").select("*").order("created_at", { ascending: false }), db.from("event").select("*").single(),
    db.from("benefits").select("*").order("sort"), db.from("programmes").select("*").order("sort"), db.from("posters").select("*").order("sort")]);
  return <main className="p-4 max-w-6xl mx-auto"><h1 className="text-2xl text-gold font-bold mb-4">Admin Dashboard</h1><AdminPanel rows={p.data ?? []} ev={e.data} ben={b.data ?? []} prog={g.data ?? []} posters={s.data ?? []} /></main>;
}
