"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, saveSession } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("gerente@visitflow.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveSession(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-graphite p-12 text-white blueprint-strong lg:flex">
        <div>
          <p className="eyebrow text-orange/80">Imobiliária</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight">
            VisitFlow<span className="text-orange">.</span>
          </h1>
        </div>

        <div className="max-w-md">
          <h2 className="font-display text-3xl font-bold leading-tight">
            Cada visita é uma rota até a proposta.
          </h2>
          <p className="mt-4 text-white/70">
            Organize roteiros com vários imóveis, qualifique clientes após cada saída e acompanhe a
            equipe do agendamento à negociação.
          </p>

          {/* Assinatura: roteiro como rota com pinos */}
          <ol className="mt-8 space-y-3" aria-hidden>
            {["Marcada", "Confirmada", "Realizada", "Cliente quente"].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange font-mono text-sm font-bold text-graphite">
                  {i + 1}
                </span>
                <span className="text-sm text-white/85">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-xs text-white/40">Gestão inteligente de visitas imobiliárias</p>
      </section>

      {/* Formulário */}
      <section className="flex items-center justify-center bg-cream p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <h1 className="font-display text-3xl font-extrabold text-graphite">
              VisitFlow<span className="text-orange">.</span>
            </h1>
            <p className="mt-1 text-sm text-graphite-soft">Gestão inteligente de visitas imobiliárias</p>
          </div>

          <p className="eyebrow">Bem-vindo de volta</p>
          <h2 className="mb-6 mt-1 font-display text-2xl font-bold text-graphite">Entrar na plataforma</h2>

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Formulário de login">
            <div>
              <label className="label" htmlFor="email">E-mail</label>
              <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="password">Senha</label>
              <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && (
              <p className="rounded-lg bg-signal/10 px-3 py-2 text-sm text-signal" role="alert">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 rounded-xl border border-graphite/10 bg-white p-4 text-xs text-graphite-soft">
            <p className="mb-1 font-semibold text-graphite">Contas de demonstração</p>
            <p className="num">gerente@visitflow.com</p>
            <p className="num">joao@visitflow.com · ana@visitflow.com</p>
            <p className="mt-1">Senha: <span className="num">123456</span></p>
          </div>
        </div>
      </section>
    </main>
  );
}
