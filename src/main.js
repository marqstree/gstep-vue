import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {setToken} from './util/auth_util'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 引入图标
import Editor from '@/components/index'

const app = createApp(App)
    .use(router)
    .use(ElementPlus, {
        locale: zhCn,
    })
    .use(Editor)
    .mount('#app')