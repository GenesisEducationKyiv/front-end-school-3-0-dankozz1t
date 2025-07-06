import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  const isDevelopment = mode === 'development';
  const isDebug = env.VITE_IS_DEBUG === 'true';

  return {
    plugins: [
      vue(),
      isDebug &&
        visualizer({
          filename: 'dist/bundle-report.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      port: 3000,
    },
    
    preview: {
      port: 3000,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/_variables.scss";',
        },
      },
    },

    build: {
      sourcemap: isDevelopment,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            vuetify: ['vuetify'],
          },
        },
      },

      minify: isDevelopment ? false : 'terser',
      terserOptions: isDevelopment
        ? {}
        : {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },

      target: 'esnext',
    },
  };
});
