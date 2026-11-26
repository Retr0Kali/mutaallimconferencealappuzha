"use client";
import { useState } from "react"; import { useRouter } from "next/navigation"; import { QUAL } from "@/lib/options";
const M = /^[6-9]\d{9}$/; const steps = ["വ്യക്തിവിവരങ്ങൾ", "സംഘടനയും പഠനവും"];
export default function Register() {
  const r = useRouter(); const [s, setS] = useState(0), [err, setErr] = useState(""), [busy, setBusy] = useState(false), [same, setSame] = useState(false);
  const [f, setF] = useState<Record<string, any>>({});
  const set = (k: string, digits = false) => (e: any) => setF({ ...f, [k]: digits ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value });
  const wa = same ? f.mobile : f.whatsapp;
  const next = () => {
    if (!f.full_name?.trim()) return setErr("പേര് നൽകുക");
    if (!M.test(f.mobile || "")) return setErr("ശരിയായ 10 അക്ക ഫോൺ നമ്പർ നൽകുക");
    if (!M.test(wa || "")) return setErr("ശരിയായ 10 അക്ക വാട്സ്ആപ്പ് നമ്പർ നൽകുക");
    setErr(""); setS(1);
  };
  const submit = async () => {
    for (const k of ["division", "sector", "unit", "institution", "qualification"]) if (!f[k]?.trim()) return setErr("* എല്ലാ വിവരങ്ങളും നൽകുക");
    if (!f.agree) return setErr("നിബന്ധനകൾ അംഗീകരിക്കുക");
    setBusy(true); setErr("");
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, whatsapp: wa }) });
    const j = await res.json().catch(() => ({})); setBusy(false);
    if (!res.ok) return setErr(j.error || "പിശക് സംഭവിച്ചു"); r.push(`/success/${j.reg_id}`);
  };
  const L = (t: string) => <span className="text-sm">{t}<b className="text-gold"> *</b></span>;
  const txt = (k: string, l: string, extra: any = {}) => <label className="block" key={k}>{L(l)}<input className="inp mt-1" value={f[k] ?? ""} onChange={set(k)} {...extra} /></label>;
  return <main className="geo min-h-screen px-5 py-10"><div className="max-w-md mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-gold">രജിസ്ട്രേഷൻ</h1>
    <div className="flex gap-2">{steps.map((x, i) => <div key={x} className="flex-1"><div className={`h-1.5 rounded ${i <= s ? "bg-gold" : "bg-white/20"}`} /><p className="text-xs mt-1">{x}</p></div>)}</div>
    {s === 0 && <>
      {txt("full_name", "പേര്")}
      <label className="block">{L("ഫോൺ")}<input className="inp mt-1" type="tel" inputMode="numeric" maxLength={10} value={f.mobile ?? ""} onChange={set("mobile", true)} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={same} onChange={e => setSame(e.target.checked)} className="w-5 h-5" /> വാട്സ്ആപ്പ് നമ്പർ ഇതേ നമ്പർ തന്നെ</label>
      {!same && <label className="block">{L("വാട്സ്ആപ്പ് നമ്പർ")}<input className="inp mt-1" type="tel" inputMode="numeric" maxLength={10} value={f.whatsapp ?? ""} onChange={set("whatsapp", true)} /></label>}
    </>}
    {s === 1 && <>
      {txt("division", "ഡിവിഷൻ")}{txt("sector", "സെക്ടർ")}{txt("unit", "യൂണിറ്റ്")}{txt("institution", "പഠിക്കുന്ന സ്ഥാപനം")}
      <label className="block">{L("ഭൗതിക വിദ്യാഭ്യാസ യോഗ്യത")}<select className="inp mt-1" value={f.qualification ?? ""} onChange={set("qualification")}><option value="">തിരഞ്ഞെടുക്കുക</option>{QUAL.map(q => <option key={q}>{q}</option>)}</select></label>
      <label className="flex gap-2 text-sm"><input type="checkbox" onChange={e => setF({ ...f, agree: e.target.checked })} /> രജിസ്ട്രേഷൻ നിബന്ധനകൾ ഞാൻ അംഗീകരിക്കുന്നു <b className="text-gold">*</b></label>
    </>}
    {err && <p role="alert" className="text-red-300 text-sm">{err}</p>}
    <div className="flex gap-3">{s > 0 && <button onClick={() => setS(0)} className="px-5 py-3 rounded-full border border-gold">പിന്നോട്ട്</button>}
      {s === 0 ? <button onClick={next} className="flex-1 py-3 rounded-full bg-gold text-em2 font-bold">അടുത്തത്</button>
        : <button disabled={busy} onClick={submit} className="flex-1 py-3 rounded-full bg-gold text-em2 font-bold disabled:opacity-50">{busy ? "..." : "രജിസ്റ്റർ ചെയ്യുക"}</button>}</div>
  </div></main>;
}
