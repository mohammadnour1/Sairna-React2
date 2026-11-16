import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'https://sairna.abdulrahman-hares.com'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    // MapLibre v6 loads its worker relative to its own module URL; pre-bundling would break that path.
    optimizeDeps: { exclude: ['maplibre-gl'] },
    server: {
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true, secure: true },
      },
    },
  }
})
