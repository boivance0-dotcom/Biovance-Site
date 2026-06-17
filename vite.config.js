import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base is controlled by the VITE_BASE env var so the SAME code deploys to both:
//   - Cloudflare Pages (root):     VITE_BASE=/           (or just leave unset)
//   - GitHub Pages (subfolder):    VITE_BASE=/Biovance-Site/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE || '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
