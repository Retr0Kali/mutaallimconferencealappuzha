"use client";
import { useState } from "react";
import { memorial as m } from "@/lib/memorial";
export default function Memorial() {
  const [open, setOpen] = useState(false);
  return <section id="memorial" className="px-5 py-16 max-w-3xl mx-auto">
    <div className="text-center space-y-2 mb-8">
      <p className="text-gold text-sm">{m.label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold">{m.name}</h2>
      <p className="text-gold/90">{m.subtitle}</p>
    </div>
    <div className="mx-auto w-64 sm:w-72 rounded-3xl overflow-hidden border-2 border-gold/50 bg-black shadow-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.photo} alt={m.name} loading="lazy" className="w-full h-auto block" />
    </div>
    <div className="mt-8 space-y-4 leading-8 text-[1.02rem] opacity-95">
      {m.intro.map((t, i) => <p key={i}>{t}</p>)}
      {open && <>
        {m.more.map((t, i) => <p key={i}>{t}</p>)}
        <p className="font-bold text-gold">{m.lessonIntro}</p>
        <ul className="space-y-2 border-l-2 border-gold/50 pl-4">{m.lessons.map((t, i) => <li key={i}>{t}</li>)}</ul>
        <div className="text-center pt-4 space-y-1 text-gold">{m.dua.map((t, i) => <p key={i}>{t}</p>)}</div>
      </>}
    </div>
    <button onClick={() => setOpen(!open)} className="mt-6 mx-auto block px-6 py-2 rounded-full border border-gold text-gold">{open ? "ചുരുക്കി കാണിക്കുക" : "കൂടുതൽ വായിക്കുക"}</button>
  </section>;
}
