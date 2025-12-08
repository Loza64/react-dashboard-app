import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:4000';
  const isDev = mode === 'development';

  return {
    plugins: [react(), tsconfigPaths()],

    server: {
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      sourcemap: isDev,             // Mapa útil en dev, apagado en prod
      chunkSizeWarningLimit: 900,   // Evitar warnings molestos
      minify: 'esbuild',            // Más rápido
    },
  };
});
