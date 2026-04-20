/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const rawApiHost = process.env.VITE_API_BASE_URL ?? 'localhost';
const apiPort = process.env.VITE_API_BASE_URL_PORT ?? '3000';
const normalizedApiHost = rawApiHost
  .replace(/^https?:\/\//, '')
  .replace(/^http\/\//, '');
const apiTarget = `http://${normalizedApiHost}:${apiPort}`;
/**
 * server: http://localhost:3000
 * Since the service is running locally, the option `secure` can be omitted.
 * If the backend were running on HTTPS, you would need to set `secure: true`
 * to ensure that the proxy verifies the SSL certificate of the target server.
 */
export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/pokemon-ui',

  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    nodePolyfills({ include: ['crypto'], protocolImports: true }),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    nxViteTsPaths(),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/packages/pokemon-ui',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/pokemon-ui',
      provider: 'v8',
    },
  },
});
