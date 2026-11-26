"use client";
import { useEffect, useState } from "react";
// Downloaded pass uses ONLY Latin text + QR (Malayalam text on canvas misaligns on some phones).
type P = { name: string; regId: string; startsAt: string; qr: string };
export default function QrCard({ name, regId, startsAt, qr }: P) {
  const [img, setImg] = useState(""); const [canShare, setCanShare] = useState(false); const [msg, setMsg] = useState("");
  useEffect(() => { (async () => {
    const W = 800, H = 1000, F = "Arial, Helvetica, sans-serif";
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d")!;
    x.textAlign = "center"; x.textBaseline = "alphabetic";
    const fit = (t: string, y: number, size: number, color: string, w: string, fam = F, max = 700) => { let s = size; x.font = `${w} ${s}px ${fam}`; while (x.measureText(t).width > max && s > 18) { s -= 2; x.font = `${w} ${s}px ${fam}`; } x.fillStyle = color; x.fillText(t, W / 2, y); };
    x.fillStyle = "#022c22"; x.fillRect(0, 0, W, H); x.strokeStyle = "#d4af37"; x.lineWidth = 6; x.strokeRect(24, 24, W - 48, H - 48);
    fit("SSF ALAPPUZHA", 120, 48, "#d4af37", "bold");
    fit("DISTRICT MUTA'ALLIM CONFERENCE 2026", 172, 30, "#faf6e9", "bold");
    const d = startsAt ? new Date(startsAt) : null;
    if (d && !isNaN(+d)) fit(d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), 220, 28, "#d4af37", "normal");
    const im = new Image(); await new Promise(r => { im.onload = r; im.src = qr; });
    x.fillStyle = "#fff"; x.beginPath(); x.roundRect(170, 260, 460, 460, 28); x.fill(); x.drawImage(im, 190, 280, 420, 420);
    const latin = /^[\x20-\x7E]+$/.test(name.trim());
    let y = 800; if (latin) { fit(name.trim(), y, 44, "#faf6e9", "bold"); y += 60; }
    fit(regId, y, 40, "#d4af37", "bold", "'Courier New', monospace");
    fit("SHOW THIS QR AT ENTRY", H - 70, 26, "#faf6e9", "normal");
    setImg(c.toDataURL("image/png"));
  })(); }, [name, regId, startsAt, qr]);
  useEffect(() => { setCanShare(typeof navigator !== "undefined" && !!navigator.canShare); }, []);
  const blob = async () => (await fetch(img)).blob();
  const download = async () => { try { const a = document.createElement("a"); a.href = URL.createObjectURL(await blob()); a.download = `${regId}.png`; document.body.appendChild(a); a.click(); a.remove(); setMsg("ഡൗൺലോഡ് ആയില്ലെങ്കിൽ, ചിത്രത്തിൽ അമർത്തിപ്പിടിച്ച് 'Save image' തിരഞ്ഞെടുക്കുക"); } catch { setMsg("ചിത്രത്തിൽ അമർത്തിപ്പിടിച്ച് 'Save image' തിരഞ്ഞെടുക്കുക"); } };
  const share = async () => { try { const f = new File([await blob()], `${regId}.png`, { type: "image/png" }); if (navigator.canShare?.({ files: [f] })) await navigator.share({ files: [f], title: regId }); else setMsg("ഷെയർ ലഭ്യമല്ല; ഡൗൺലോഡ് ചെയ്യുക"); } catch {} };
  return <div className="space-y-3">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={img || qr} alt="Registration QR pass" className="mx-auto w-full max-w-xs rounded-2xl" />
    <button disabled={!img} onClick={download} className="block w-full py-3 rounded-full bg-em text-gold font-bold disabled:opacity-50">⬇ QR ഡൗൺലോഡ്</button>
    {canShare && <button disabled={!img} onClick={share} className="block w-full py-3 rounded-full border-2 border-em text-em font-bold">📤 ചിത്രം ഷെയർ / സേവ് ചെയ്യുക</button>}
    {msg && <p className="text-xs">{msg}</p>}
  </div>;
}
