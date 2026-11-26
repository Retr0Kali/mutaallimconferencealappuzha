import { NextResponse } from "next/server"; import { randomBytes } from "crypto"; import { srv } from "@/lib/db"; import { QUAL } from "@/lib/options";
const m = /^[6-9]\d{9}$/; const t = (v: any, n = 200) => String(v ?? "").trim().slice(0, n);
export async function POST(req: Request) {
  const b = await req.json().catch(() => null); if (!b) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const d = { full_name: t(b.full_name, 100), mobile: t(b.mobile, 10), whatsapp: t(b.whatsapp, 10), division: t(b.division, 80), sector: t(b.sector, 80),
    unit: t(b.unit, 80), institution: t(b.institution, 200), qualification: t(b.qualification, 40) };
  if (!d.full_name || !d.division || !d.sector || !d.unit || !d.institution || !QUAL.includes(d.qualification) || !m.test(d.mobile) || !m.test(d.whatsapp) || b.agree !== true)
    return NextResponse.json({ error: "വിവരങ്ങൾ പരിശോധിക്കുക" }, { status: 400 });
  const reg_id = "SSF-AL-" + randomBytes(4).toString("hex").toUpperCase();
  const { error } = await srv().from("participants").insert({ ...d, reg_id });
  if (error && error.code !== "23505") console.error("register db error:", error.code, error.message);
  if (error) return NextResponse.json({ error: error.code === "23505" ? "ഈ മൊബൈൽ നമ്പർ ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്" : "സേവ് ചെയ്യാൻ കഴിഞ്ഞില്ല" }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ reg_id });
}
