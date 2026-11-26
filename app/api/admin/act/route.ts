import { NextResponse } from "next/server"; import { srv, requireAdmin } from "@/lib/db";
const J = (o: any, s = 200) => NextResponse.json(o, { status: s });
const PF = ["full_name","mobile","whatsapp","division","sector","unit","institution","qualification"];
const pick = (o: any, k: string[]) => Object.fromEntries(k.filter(x => x in o).map(x => [x, o[x]]));
export async function POST(req: Request) {
  if (!(await requireAdmin())) return J({ error: "Unauthorized" }, 401);
  const db = srv();
  if ((req.headers.get("content-type") || "").includes("multipart")) {
    const fd = await req.formData(); const f = fd.get("file") as File | null; const pid = Number(fd.get("programme_id") || 0);
    if (!f || !f.type.startsWith("image/") || f.size > 4e6) return J({ error: "Image under 4MB only" }, 400);
    const name = `${Date.now()}-${f.name.replace(/[^\w.-]/g, "_")}`;
    const up = await db.storage.from("posters").upload(name, Buffer.from(await f.arrayBuffer()), { contentType: f.type });
    if (up.error) return J({ error: up.error.message }, 500);
    if (pid) {
      const url = db.storage.from("posters").getPublicUrl(name).data.publicUrl;
      const { data: old } = await db.from("programmes").select("image_url").eq("id", pid).single();
      const r = await db.from("programmes").update({ image_url: url }).eq("id", pid);
      if (!r.error && old?.image_url) await db.storage.from("posters").remove([decodeURIComponent(old.image_url.split("/").pop()!)]);
      return r.error ? J({ error: r.error.message }, 500) : J({ ok: 1 });
    }
    const { data: last } = await db.from("posters").select("sort").order("sort", { ascending: false }).limit(1);
    const { error } = await db.from("posters").insert({ url: db.storage.from("posters").getPublicUrl(name).data.publicUrl, sort: (last?.[0]?.sort ?? 0) + 1 });
    return error ? J({ error: error.message }, 500) : J({ ok: 1 });
  }
  const b = await req.json(); let r: any;
  switch (b.a) {
    case "p.update": r = await db.from("participants").update(pick(b.d, PF)).eq("id", b.id); break;
    case "p.delete": r = await db.from("participants").delete().eq("id", b.id); break;
    case "event": r = await db.from("event").update(pick(b.d, ["title","subtitle","tagline","starts_at","venue"])).eq("id", 1); break;
    case "c.save": if (!["benefits","programmes"].includes(b.t)) return J({ error: "bad" }, 400);
      r = b.id ? await db.from(b.t).update(pick(b.d, ["icon","title","body","sort"])).eq("id", b.id) : await db.from(b.t).insert(pick(b.d, ["icon","title","body","sort"])); break;
    case "c.delete": if (!["benefits","programmes"].includes(b.t)) return J({ error: "bad" }, 400); r = await db.from(b.t).delete().eq("id", b.id); break;
    case "poster.delete": { const { data: p } = await db.from("posters").select("url").eq("id", b.id).single();
      if (p) await db.storage.from("posters").remove([decodeURIComponent(p.url.split("/").pop()!)]); r = await db.from("posters").delete().eq("id", b.id); break; }
    case "poster.order": for (let i = 0; i < b.ids.length; i++) await db.from("posters").update({ sort: i }).eq("id", b.ids[i]); r = {}; break;
    default: return J({ error: "bad action" }, 400);
  }
  return r.error ? J({ error: r.error.message }, 500) : J({ ok: 1 });
}
