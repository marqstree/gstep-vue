import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入图标
import Editor from '@/components/index'

const app = createApp(App)
    .use(router)
    .use(Editor)
    .mount('#app')