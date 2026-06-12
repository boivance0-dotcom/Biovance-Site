import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Served from https://<user>.github.io/Biovance-Site/ on GitHub Pages.
  // If you deploy to Cloudflare Pages or a root domain, set base back to "/".
  base: mode === "production" ? "/Biovance-Site/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
