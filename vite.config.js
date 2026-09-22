import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // O proxy da Vercel mantém os cookies de sessão e CSRF no domínio da página.
  define: mode === "vercel"
    ? { "import.meta.env.VITE_API_URL": JSON.stringify("/api") }
    : {},
  server: { port: 5173 },
}));
