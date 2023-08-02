import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 引入图标
import installIcon from './util/icon_util'

import store from './store'
import { recoverVuex } from './util/recover_vuex'
recoverVuex(store.state)

const app = createApp(App)
    .use(store)
    .use(router)
    .use(installIcon) // 注册全局图标
    .use(ElementPlus, {
        locale: zhCn,
    })
    .mount('#app')