import Link from "next/link"; import { pub } from "@/lib/db"; import Countdown from "@/components/Countdown"; import Gallery from "@/components/Gallery";
export const revalidate = 60;
export default async function Home() {
  const db = pub();
  const [{ data: ev }, { data: ben }, { data: prog }, { data: posters }] = await Promise.all([
    db.from("event").select("*").single(), db.from("benefits").select("*").order("sort"),
    db.from("programmes").select("*").order("sort"), db.from("posters").select("*").order("sort")]);
  return <main>
    <section className="geo min-h-screen flex flex-col items-center justify-center text-center px-5 py-16 gap-5">
      <img src="/logo.png" alt="Samastha Centenary" width={120} height={129} className="w-24 sm:w-28 h-auto rounded-2xl shadow-lg" />
      <p className="tracking-[.3em] text-gold text-xs">{ev?.subtitle}</p>
      <p className="text-sm opacity-80">SSF ALAPPUZHA DISTRICT COMMITTEE</p>
      <h1 className="text-4xl sm:text-6xl font-bold leading-tight">{ev?.title}</h1>
      <p className="text-lg text-gold/90">{ev?.tagline}</p>
      <p className="opacity-90">{ev && new Date(ev.starts_at).toLocaleDateString("ml-IN", { dateStyle: "long" })} · {ev?.venue}</p>
      {ev && <Countdown to={ev.starts_at} />}
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/register" className="px-7 py-3 rounded-full bg-gold text-em2 font-bold">ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യൂ</Link>
        <a href="#why" className="px-7 py-3 rounded-full border border-gold text-gold">സമ്മേളനം അറിയാം</a></div>
    </section>
    <section id="why" className="px-5 py-14 max-w-5xl mx-auto"><h2 className="text-2xl font-bold text-gold mb-6">ഈ സമ്മേളനം നിങ്ങൾക്കായി ഒരുക്കുന്നത്...</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{ben?.map(b => <div key={b.id} className="rounded-2xl bg-em p-4 border border-gold/20 active:scale-95 hover:-translate-y-1 transition"><div className="text-3xl">{b.icon}</div><h3 className="font-bold mt-2">{b.title}</h3><p className="text-sm opacity-80">{b.body}</p></div>)}</div></section>
    <section className="px-5 py-14 max-w-5xl mx-auto"><h2 className="text-2xl font-bold text-gold mb-6">നിങ്ങൾ ഇവിടെ അനുഭവിക്കാൻ പോകുന്നത്</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{prog?.map(p => <div key={p.id} className="rounded-2xl bg-em2 border border-gold/30 p-4"><div className="text-3xl">{p.icon}</div><h3 className="font-bold mt-2">{p.title}</h3><p className="text-sm opacity-80">{p.body}</p></div>)}</div></section>
    {!!posters?.length && <section className="px-5 py-14 max-w-5xl mx-auto"><h2 className="text-2xl font-bold text-gold mb-6">പോസ്റ്ററുകൾ</h2>
      <Gallery posters={posters} /></section>}
    <footer className="text-center py-10 opacity-70 text-sm">SSF ആലപ്പുഴ ജില്ലാ കമ്മിറ്റി · <Link href="/admin">Admin</Link></footer>
  </main>;
}
