"use client";
import { useEffect, useRef, useState } from "react"; import jsQR from "jsqr";
export default function Verify() {
  const [id, setId] = useState(""), [r, setR] = useState<any>(null), [cam, setCam] = useState(false), v = useRef<HTMLVideoElement>(null);
  const go = async (x = id) => setR(await (await fetch("/api/admin/verify", { method: "POST", body: JSON.stringify({ reg_id: x }) })).json());
  useEffect(() => {
    if (!cam) return; let stop = false, stream: MediaStream, t: any; const c = document.createElement("canvas");
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(s => {
      stream = s; v.current!.srcObject = s; v.current!.play();
      t = setInterval(() => { const e = v.current!; if (!e.videoWidth || stop) return; c.width = e.videoWidth; c.height = e.videoHeight;
        const x = c.getContext("2d")!; x.drawImage(e, 0, 0); const q = jsQR(x.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
        if (q?.data) { stop = true; setId(q.data); setCam(false); go(q.data); } }, 300);
    }).catch(() => setCam(false));
    return () => { stop = true; clearInterval(t); stream?.getTracks().forEach(k => k.stop()); };
  }, [cam]);
  const c = r?.status === "ok" ? "bg-green-700" : r?.status === "already" ? "bg-yellow-700" : "bg-red-700";
  return <div className="space-y-2">
    <button onClick={() => setCam(!cam)} className="w-full py-3 rounded-xl bg-gold text-em2 font-bold">{cam ? "ക്യാമറ നിർത്തുക" : "📷 QR സ്കാൻ ചെയ്യുക"}</button>
    {cam && <video ref={v} playsInline muted className="w-full rounded-xl" />}
    <div className="flex gap-2"><input className="inp" placeholder="SSF-AL-XXXXXXXX" value={id} onChange={e => setId(e.target.value)} /><button onClick={() => go()} className="px-5 rounded-xl border border-gold">Verify</button></div>
    {r && <div className={`p-3 rounded-xl text-lg ${c}`}>{r.status === "ok" && `✔ ${r.name} – പ്രവേശനം അനുവദിച്ചു`}{r.status === "already" && `⚠ ${r.name} നേരത്തേ പ്രവേശിച്ചു (${new Date(r.at).toLocaleTimeString()})`}{r.status === "invalid" && "✖ അസാധുവായ ID"}</div>}</div>;
}
