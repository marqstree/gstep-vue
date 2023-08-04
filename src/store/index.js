import { createStore } from 'vuex'
import { state2cache } from '@/util/recover_vuex.js'
import { clearCache } from '@/util/cache_util'
import router from '@/router'

export default createStore({
    state: {
        // *************************************************************
        // 注意：初始值不能定义成undefined，否则全局store也会变成undefined
        userInfo: {
            id: '',
            username: '',
            nickname: '',
        },
        isLogin: false
    },
    getters: {},
    mutations: {
        setUserInfo: function (state, userInfo) {
            state.userInfo = userInfo
            state.isLogin = true

            // 为避免用户按浏览器刷新按钮后，vuex中数据丢失
            // 将vuex数据缓存入sessionStorage，用户不关闭浏览器，sessionStorage中数据一直存在
            state2cache(state)
        },
        logout: function (state) {
            clearCache()
            state.userInfo = {}
            state.isLogin = false
            state.selectPath = state.menus[0].path
            state.tabMenus = []
            state.tabMenus.push(state.menus[0])
            state2cache(state)
        },
        showHead (state, isShow) {
            state.isHeadShow = isShow
            state2cache(state)
        },
        showFoot (state, isShow) {
            state.isMenuShow = isShow
            state2cache(state)
        },
        toggleMenuCollapse (state) {
            state.isMenuCollapse = !state.isMenuCollapse
            state2cache(state)
        },
        setMenus (state, value) {
            state.menus = value
            state2cache(state)
        },
        //选择菜单路由
        selectMenu (state, path) {
            state.selectPath = path

            //左侧菜单中不存在路由，不跳转 
            let findMenus = state.menus.filter(item => {
                return item.path == path
            })
            if (findMenus.length < 1)
                return

            //新路由加入tab导航列表
            let list = state.tabMenus.filter(e => {
                return e.path == path
            })
            if (list.length < 1) {
                //增加tab导航项    
                state.tabMenus.push(findMenus[0])
            }

            //跳转路由
            router.push(path)
            state2cache(state)
        },
        //删除掉tab导航项
        deleteTabMenu (state, path) {
            //tab导航中只有一个导航项，不跳转
            if (state.tabMenus.length < 2) {
                return
            }

            //删除掉tab导航项
            let list = state.tabMenus.filter(e => {
                return e.path != path
            })
            state.tabMenus = list

            if (list.length > 0) {
                //跳转路由
                let lastPath = list[list.length - 1].path
                state.selectPath = lastPath
                router.push(lastPath)
            }
        }
    },
    actions: {},
    modules: {}
})