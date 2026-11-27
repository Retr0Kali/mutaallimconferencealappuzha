"use client";
import { useState } from "react";
type S = { id: number; title: string; body: string | null; speaker?: string | null; topic?: string | null; image_url: string | null };
export default function Sessions({ items }: { items: S[] }) {
  const withImg = items.filter(x => x.image_url); const [i, setI] = useState<number | null>(null); const [z, setZ] = useState(1);
  const close = () => { setI(null); setZ(1); }; const cur = i !== null ? withImg[i] : null;
  const dl = async (u: string) => { const b = await (await fetch(u)).blob(); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "session-" + u.split("/").pop(); a.click(); };
  const share = (u: string) => navigator.share ? navigator.share({ title: "SSF മുത്തഅല്ലിം സമ്മേളനം", url: u }).catch(() => {}) : window.open("https://wa.me/?text=" + encodeURIComponent(u));
  return <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{items.map(it => <div key={it.id} className="rounded-2xl bg-em border border-gold/30 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2"><span className="font-bold text-gold text-lg">{it.title}</span>
        {it.body && <span className="text-xs px-3 py-1 rounded-full border border-gold/50 text-gold">{it.body}</span>}</div>
      {it.topic && <h3 className="font-bold text-xl leading-snug">{it.topic}</h3>}
      {it.speaker && <p className="text-gold/90 leading-relaxed">{it.speaker}</p>}
      {it.image_url && <button onClick={() => { setI(withImg.findIndex(x => x.id === it.id)); setZ(1); }} className="block w-full overflow-hidden rounded-xl border border-gold/30 mt-1"><img src={it.image_url} alt={it.title} loading="lazy" className="aspect-[4/5] object-cover w-full hover:scale-105 transition" /></button>}</div>)}</div>
    {cur && i !== null && <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" role="dialog">
      <div className="flex gap-2 p-3 justify-between items-center text-sm"><b className="text-gold">{cur.title}</b><div className="flex gap-2">
        <button onClick={() => setZ(Math.max(1, z - .5))} className="px-3 py-2 border border-gold rounded-full">−</button><button onClick={() => setZ(Math.min(4, z + .5))} className="px-3 py-2 border border-gold rounded-full">+</button>
        <button onClick={() => dl(cur.image_url!)} className="px-3 py-2 bg-gold text-em2 rounded-full">ഡൗൺലോഡ്</button><button onClick={() => share(cur.image_url!)} className="px-3 py-2 bg-green-600 rounded-full">ഷെയർ</button><button onClick={close} className="px-3 py-2 border border-gold rounded-full">✕</button></div></div>
      <div className="flex-1 overflow-auto grid place-items-center" onClick={e => e.target === e.currentTarget && close()}>
        <img src={cur.image_url!} alt={cur.title} onDoubleClick={() => setZ(z > 1 ? 1 : 2.5)} style={{ width: `${z * 100}%`, maxWidth: z === 1 ? "min(100%,560px)" : "none", maxHeight: z === 1 ? "80vh" : "none", objectFit: "contain" }} /></div>
      {withImg.length > 1 && <div className="flex justify-between p-3"><button onClick={() => { setI((i + withImg.length - 1) % withImg.length); setZ(1); }} className="px-5 py-2 border border-gold rounded-full">‹</button><button onClick={() => { setI((i + 1) % withImg.length); setZ(1); }} className="px-5 py-2 border border-gold rounded-full">›</button></div>}</div>}
  </>;
}
