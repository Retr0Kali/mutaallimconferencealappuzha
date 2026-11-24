import QRCode from "qrcode"; import { notFound } from "next/navigation"; import { srv } from "@/lib/db"; import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function Success({ params }: { params: { id: string } }) {
  const { data: p } = await srv().from("participants").select("full_name,reg_id").eq("reg_id", params.id).maybeSingle(); if (!p) notFound();
  const { data: ev } = await srv().from("event").select("*").single();
  const qr = await QRCode.toDataURL(p.reg_id, { margin: 1, width: 320, color: { dark: "#022c22" } });
  const msg = encodeURIComponent(`${ev?.title} 2026 – SSF ആലപ്പുഴ\nരജിസ്ട്രേഷൻ ID: ${p.reg_id}\nനിങ്ങളും രജിസ്റ്റർ ചെയ്യൂ!`);
  return <main className="geo min-h-screen grid place-items-center px-5 py-10"><div className="max-w-sm w-full bg-ivory text-em2 rounded-3xl p-6 text-center space-y-3 border-4 border-gold">
    <div className="text-5xl">✅</div><h1 className="font-bold text-lg">അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിജയകരമായി പൂർത്തിയായി.</h1>
    <p className="text-xl font-bold">{p.full_name}</p><p className="font-mono text-lg">{p.reg_id}</p>
    <img src={qr} alt="QR" className="mx-auto w-52 h-52" /><p className="text-sm">{ev?.title} · {ev && new Date(ev.starts_at).toLocaleDateString("ml-IN", { dateStyle: "long" })} · {ev?.venue}</p>
    <p className="text-xs">പ്രവേശന സമയത്ത് ഈ QR കാണിക്കുക</p>
    <a href={qr} download={`${p.reg_id}.png`} className="block py-3 rounded-full bg-em text-gold font-bold">QR ഡൗൺലോഡ്</a>
    <a href={`https://wa.me/?text=${msg}`} target="_blank" className="block py-3 rounded-full bg-green-600 text-white font-bold">WhatsApp-ൽ പങ്കിടുക</a>
    <Link href="/" className="text-sm underline">ഹോം</Link></div></main>;
}
