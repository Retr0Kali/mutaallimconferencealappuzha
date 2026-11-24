"use client";
import { useState } from "react"; import { useRouter } from "next/navigation";
const Z = ["അമ്പലപ്പുഴ","ആലപ്പുഴ","ചേർത്തല","ഹരിപ്പാട്","കായംകുളം","ചെങ്ങന്നൂർ","മാവേലിക്കര","കുട്ടനാട്","മറ്റുള്ളവ"];
const LV = ["സെക്കൻഡറി","ഹയർ സെക്കൻഡറി","ഡിഗ്രി","പി.ജി","ദർസ്/കോളേജ്","മറ്റുള്ളവ"];
const steps = ["വ്യക്തിവിവരങ്ങൾ","വിദ്യാഭ്യാസം","പങ്കാളിത്തം"];
const req: string[][] = [["full_name","age","mobile","whatsapp","address","zone"],["institution","course","level"],["attend_type"]];
export default function Register() {
  const r = useRouter(); const [s, setS] = useState(0); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [f, setF] = useState<Record<string, any>>({ attend_type: "individual", companions: 0 });
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const next = () => {
    if (req[s].some(k => !f[k])) return setErr("* ആവശ്യമുള്ള എല്ലാ വിവരങ്ങളും നൽകുക");
    if (s === 0 && (!/^[6-9]\d{9}$/.test(f.mobile) || !/^[6-9]\d{9}$/.test(f.whatsapp))) return setErr("10 അക്ക മൊബൈൽ നമ്പർ നൽകുക");
    setErr(""); setS(s + 1);
  };
  const submit = async () => {
    if (!f.agree) return setErr("നിബന്ധനകൾ അംഗീകരിക്കുക"); setBusy(true);
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const j = await res.json(); setBusy(false);
    if (!res.ok) return setErr(j.error || "പിശക് സംഭവിച്ചു"); r.push(`/success/${j.reg_id}`);
  };
  const inp = (k: string, l: string, t = "text", extra: any = {}) => <label className="block" key={k}><span className="text-sm">{l}{req[s].includes(k) && <b className="text-gold"> *</b>}</span><input className="inp mt-1" type={t} value={f[k] ?? ""} onChange={set(k)} {...extra} /></label>;
  const sel = (k: string, l: string, o: string[]) => <label className="block" key={k}><span className="text-sm">{l}<b className="text-gold"> *</b></span><select className="inp mt-1" value={f[k] ?? ""} onChange={set(k)}><option value="">തിരഞ്ഞെടുക്കുക</option>{o.map(x => <option key={x}>{x}</option>)}</select></label>;
  return <main className="geo min-h-screen px-5 py-10"><div className="max-w-md mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-gold">രജിസ്ട്രേഷൻ</h1>
    <div className="flex gap-2">{steps.map((x, i) => <div key={x} className="flex-1"><div className={`h-1.5 rounded ${i <= s ? "bg-gold" : "bg-white/20"}`} /><p className="text-xs mt-1">{x}</p></div>)}</div>
    {s === 0 && <>{inp("full_name","പൂർണ്ണനാമം")}{inp("age","പ്രായം","number",{inputMode:"numeric"})}{inp("mobile","മൊബൈൽ നമ്പർ","tel",{maxLength:10,inputMode:"numeric"})}{inp("whatsapp","വാട്സ്ആപ്പ് നമ്പർ","tel",{maxLength:10,inputMode:"numeric"})}{inp("address","വിലാസം")}{sel("zone","സോൺ / ഡിസ്ട്രിക്ട്",Z)}</>}
    {s === 1 && <>{inp("institution","സ്ഥാപനം / മദ്രസ / കോളേജ്")}{inp("course","ക്ലാസ് / കോഴ്സ്")}{sel("level","പഠന തലം",LV)}{inp("teacher","ഉസ്താദിന്റെ പേര്")}</>}
    {s === 2 && <>{sel("attend_type","പങ്കാളിത്ത രീതി",["individual","institution"])}{f.attend_type === "institution" && inp("companions","കൂടെ വരുന്നവരുടെ എണ്ണം","number",{min:0,max:200})}{inp("requirements","പ്രത്യേക ആവശ്യങ്ങൾ")}<label className="flex gap-2 text-sm"><input type="checkbox" onChange={set("agree")} /> രജിസ്ട്രേഷൻ നിബന്ധനകൾ ഞാൻ അംഗീകരിക്കുന്നു <b className="text-gold">*</b></label></>}
    {err && <p role="alert" className="text-red-300 text-sm">{err}</p>}
    <div className="flex gap-3">{s > 0 && <button onClick={() => setS(s - 1)} className="px-5 py-3 rounded-full border border-gold">പിന്നോട്ട്</button>}
      {s < 2 ? <button onClick={next} className="flex-1 py-3 rounded-full bg-gold text-em2 font-bold">അടുത്തത്</button> : <button disabled={busy} onClick={submit} className="flex-1 py-3 rounded-full bg-gold text-em2 font-bold disabled:opacity-50">{busy ? "..." : "രജിസ്റ്റർ ചെയ്യുക"}</button>}</div>
  </div></main>;
}
