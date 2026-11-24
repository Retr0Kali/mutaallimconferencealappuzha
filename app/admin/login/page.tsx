"use client";
import { useState } from "react";
export default function Login() {
  const [e, setE] = useState(""), [p, setP] = useState(""), [m, setM] = useState("");
  const go = async () => { const r = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ email: e, password: p }) }); r.ok ? (location.href = "/admin") : setM("Login failed"); };
  return <main className="min-h-screen grid place-items-center px-5"><div className="max-w-sm w-full space-y-3"><h1 className="text-2xl text-gold font-bold">Admin</h1>
    <input className="inp" placeholder="Email" value={e} onChange={x => setE(x.target.value)} /><input className="inp" type="password" placeholder="Password" value={p} onChange={x => setP(x.target.value)} />
    <button onClick={go} className="w-full py-3 rounded-full bg-gold text-em2 font-bold">Login</button><p className="text-red-300">{m}</p></div></main>;
}
