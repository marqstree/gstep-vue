import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {
      // APP_DOMAIN: 'http://localhost:9900',
      // APP_API_BASE_PATH: '',
      // APP_TOKEN_KEY: 'Authorization',
      // APP_TOKEN_PREFIX: 'Bearer ',
      // APP_NEED_LOGIN_CODE: 401,
      // APP_VUEX_CACHE_KEY: 'gstep_vuex_state',
      APP_IS_DEBUG: false
    },
  },
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.js'),
      name: 'gstep-ui',
      fileName: (format) => `gstep-ui.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
