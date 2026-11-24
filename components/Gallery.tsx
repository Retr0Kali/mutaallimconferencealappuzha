"use client";
import { useState } from "react";
export default function Gallery({ posters }: { posters: { id: number; url: string }[] }) {
  const [i, setI] = useState<number | null>(null); const [z, setZ] = useState(1);
  const close = () => { setI(null); setZ(1); };
  const dl = async (u: string) => { const b = await (await fetch(u)).blob(); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "SSF-poster-" + u.split("/").pop(); a.click(); };
  const share = (u: string) => navigator.share ? navigator.share({ title: "SSF മുത്തഅല്ലിം സമ്മേളനം", url: u }).catch(() => {}) : window.open("https://wa.me/?text=" + encodeURIComponent(u));
  return <>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{posters.map((p, k) => <button key={p.id} onClick={() => setI(k)} className="overflow-hidden rounded-xl"><img src={p.url} alt="Poster" loading="lazy" className="aspect-[4/5] object-cover w-full hover:scale-105 transition" /></button>)}</div>
    {i !== null && <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" role="dialog">
      <div className="flex gap-2 p-3 justify-end text-sm">
        <button onClick={() => setZ(Math.max(1, z - .5))} className="px-3 py-2 border border-gold rounded-full">−</button><button onClick={() => setZ(Math.min(4, z + .5))} className="px-3 py-2 border border-gold rounded-full">+</button>
        <button onClick={() => dl(posters[i].url)} className="px-3 py-2 bg-gold text-em2 rounded-full">ഡൗൺലോഡ്</button><button onClick={() => share(posters[i].url)} className="px-3 py-2 bg-green-600 rounded-full">ഷെയർ</button><button onClick={close} className="px-3 py-2 border border-gold rounded-full">✕</button></div>
      <div className="flex-1 overflow-auto grid place-items-center" onClick={e => e.target === e.currentTarget && close()}>
        <img src={posters[i].url} alt="Poster" onDoubleClick={() => setZ(z > 1 ? 1 : 2.5)} style={{ width: `${z * 100}%`, maxWidth: z === 1 ? "min(100%,560px)" : "none", maxHeight: z === 1 ? "80vh" : "none", objectFit: "contain" }} /></div>
      <div className="flex justify-between p-3"><button onClick={() => { setI((i + posters.length - 1) % posters.length); setZ(1); }} className="px-5 py-2 border border-gold rounded-full">‹</button><button onClick={() => { setI((i + 1) % posters.length); setZ(1); }} className="px-5 py-2 border border-gold rounded-full">›</button></div></div>}
  </>;
}
