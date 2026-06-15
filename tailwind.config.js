/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Tokens remapeados para a identidade "corretor premium / planta".
        graphite: "#0E3B2E", // esmeralda profundo (ink): sidebar, titulos, texto, acao primaria
        "graphite-soft": "#3A5A4F",
        orange: "#C99A2E", // latao/ouro: acento de assinatura
        "orange-deep": "#A8761A",
        peach: "#E8D8A8", // areia/ouro claro: badges suaves
        cream: "#ECEFE8", // sage: fundo
        clay: "#C2603F", // terracota: proposta
        signal: "#B23A2E", // vermelho: cancelar/negativo
        teal: "#2E7D6B", // confirmada/positivo
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(14,59,46,0.06), 0 8px 24px -12px rgba(14,59,46,0.12)",
      },
    },
  },
  plugins: [],
};
