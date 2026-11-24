"use client";
import { useEffect, useState } from "react";
export default function Countdown({ to }: { to: string }) {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => { const f = () => setN(Math.max(0, new Date(to).getTime() - Date.now())); f(); const i = setInterval(f, 1000); return () => clearInterval(i); }, [to]);
  if (n === null) return <div className="h-20" />;
  const u: [string, number][] = [["ദിവസം", Math.floor(n / 864e5)], ["മണിക്കൂർ", Math.floor(n / 36e5) % 24], ["മിനിറ്റ്", Math.floor(n / 6e4) % 60], ["സെക്കൻഡ്", Math.floor(n / 1e3) % 60]];
  return <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">{u.map(([l, v]) => <div key={l} className="rounded-xl border border-gold/40 bg-em2/60 py-3"><div className="text-3xl font-bold text-gold tabular-nums">{String(v).padStart(2, "0")}</div><div className="text-xs opacity-80">{l}</div></div>)}</div>;
}
