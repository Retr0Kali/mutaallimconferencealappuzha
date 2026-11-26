"use client";
import { useEffect, useState } from "react";
type P = { name: string; regId: string; title: string; when: string; venue: string; qr: string };
export default function QrCard({ name, regId, title, when, venue, qr }: P) {
  const [img, setImg] = useState(""); const [canShare, setCanShare] = useState(false); const [msg, setMsg] = useState("");
  useEffect(() => { (async () => {
    try { await document.fonts.load("700 40px Manjari"); await document.fonts.load("400 28px Manjari"); } catch {}
    const W = 800, H = 1150, F = "Manjari,'Noto Sans Malayalam',sans-serif";
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d")!;
    x.fillStyle = "#022c22"; x.fillRect(0, 0, W, H); x.strokeStyle = "#d4af37"; x.lineWidth = 6; x.strokeRect(24, 24, W - 48, H - 48);
    x.textAlign = "center";
    const wrap = (t: string, y: number, size: number, color: string, weight = 700, max = 680) => {
      x.fillStyle = color; x.font = `${weight} ${size}px ${F}`; let line = "";
      for (const w of t.split(" ")) { const n = line ? line + " " + w : w; if (x.measureText(n).width > max && line) { x.fillText(line, W / 2, y); y += size * 1.35; line = w; } else line = n; }
      x.fillText(line, W / 2, y); return y + size * 1.35;
    };
    let y = wrap("SSF ALAPPUZHA DISTRICT COMMITTEE", 100, 28, "#d4af37");
    y = wrap(title, y + 25, 50, "#faf6e9");
    y = wrap([when, venue].filter(Boolean).join(" · "), y + 5, 28, "#d4af37", 400);
    const im = new Image(); await new Promise(r => { im.onload = r; im.src = qr; });
    const qy = Math.max(y + 30, 400); x.fillStyle = "#fff"; x.beginPath(); x.roundRect(170, qy, 460, 460, 28); x.fill(); x.drawImage(im, 190, qy + 20, 420, 420);
    y = wrap(name, qy + 540, 46, "#faf6e9");
    x.fillStyle = "#d4af37"; x.font = `700 38px monospace`; x.fillText(regId, W / 2, y + 10);
    wrap("പ്രവേശനത്തിന് ഈ QR കാണിക്കുക", y + 80, 28, "#faf6e9", 400);
    setImg(c.toDataURL("image/png"));
  })(); }, [name, regId, title, when, venue, qr]);
  useEffect(() => { setCanShare(typeof navigator !== "undefined" && !!navigator.canShare); }, []);
  const blob = async () => (await fetch(img)).blob();
  const download = async () => { try { const a = document.createElement("a"); a.href = URL.createObjectURL(await blob()); a.download = `${regId}.png`; document.body.appendChild(a); a.click(); a.remove(); setMsg("ഡൗൺലോഡ് ആയില്ലെങ്കിൽ, ചിത്രത്തിൽ അമർത്തിപ്പിടിച്ച് 'Save image' തിരഞ്ഞെടുക്കുക"); } catch { setMsg("ചിത്രത്തിൽ അമർത്തിപ്പിടിച്ച് 'Save image' തിരഞ്ഞെടുക്കുക"); } };
  const share = async () => { try { const f = new File([await blob()], `${regId}.png`, { type: "image/png" }); if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title }); else setMsg("ഷെയർ ലഭ്യമല്ല; ഡൗൺലോഡ് ചെയ്യുക"); } catch {} };
  return <div className="space-y-3">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={img || qr} alt="Registration QR card" className="mx-auto w-full max-w-xs rounded-2xl" />
    <button disabled={!img} onClick={download} className="block w-full py-3 rounded-full bg-em text-gold font-bold disabled:opacity-50">⬇ കാർഡ് ഡൗൺലോഡ് (QR)</button>
    {canShare && <button disabled={!img} onClick={share} className="block w-full py-3 rounded-full border-2 border-em text-em font-bold">📤 ചിത്രം ഷെയർ / സേവ് ചെയ്യുക</button>}
    {msg && <p className="text-xs">{msg}</p>}
  </div>;
}
