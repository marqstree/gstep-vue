import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  //打包配置，一定要加，否则路径不对，找不到js/css文件
  //作用：打包index.html中的js/css文件前加相对路径./
  base: './',
  define: {
    'process.env': {
      APP_DOMAIN: 'http://localhost:9900',
      APP_API_BASE_PATH: '',
      APP_TOKEN_KEY: 'Authorization',
      APP_TOKEN_PREFIX: 'Bearer ',
      APP_NEED_LOGIN_CODE: 401,
      APP_VUEX_CACHE_KEY: 'gstep_vuex_state'
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
