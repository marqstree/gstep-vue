import { getCacheValueByKey, setCacheValueByKey } from './cache_util.js'

const vuexStateKey = process.env.VUE_APP_VUEX_CACHE_KEY

// 从cache中恢复Vuex
export function recoverVuex (state) {

    // // 遍历state对象的所有属性名
    // for (var item in state) {
    //     //取出属性
    //     state[item] = getCacheValueByKey(item)
    // }

    let json = getCacheValueByKey(vuexStateKey)
    let obj = JSON.parse(json)

    console.log('+++++++++++++++++++++++++++++++++++++++++')
    console.log(obj)

    for (var item in state) {
        try {
            state[item] = obj[item]
        } catch (e) {
            console.log(e)
        }
    }
}

export function state2cache (state) {
    setCacheValueByKey(vuexStateKey, JSON.stringify(state))
}