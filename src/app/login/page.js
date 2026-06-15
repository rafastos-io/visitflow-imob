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
    <main className="flex min-h-screen items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-graphite">
            VisitFlow <span className="text-orange">Imob</span>
          </h1>
          <p className="mt-1 text-sm text-graphite/70">Gestão inteligente de visitas imobiliárias</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4" aria-label="Formulario de login">
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 rounded-lg bg-peach/40 p-3 text-xs text-graphite">
          <p className="font-semibold">Contas de teste (senha: 123456)</p>
          <p>Gerente: gerente@visitflow.com</p>
          <p>Corretor: joao@visitflow.com · ana@visitflow.com</p>
        </div>
      </div>
    </main>
  );
}
