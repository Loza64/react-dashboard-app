import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const apiUrl = env.VITE_API_URL || 'http://localhost:4000'
  const isDev = mode === 'development'

  return {
    plugins: [react(), tsconfigPaths()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: {
      host: true,
      port: env.PORT ? parseInt(env.PORT, 10) : 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      allowedHosts: [
        'cobros-web.onrender.com',
        'cobros-web-ubikme.onrender.com',
      ],
    },
    build: {
      sourcemap: isDev,
      chunkSizeWarningLimit: 900,
      minify: 'esbuild',
    },
  }
})
