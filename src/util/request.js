import axios from "axios"
import { getToken, TOKEN_KEY } from "./auth_util"
import { warnToast } from "@/util/toast_util.js"
import qs from "qs"
import router from '@/router/index.js'

const TokenKey = TOKEN_KEY
import store from '../store'
import { NEED_LOGIN_CODES } from './errer_code.js'

// create an axios instance
const service = axios.create({
    baseURL: process.env.APP_DOMAIN, // url = domain + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000, // request timeout
})

//请求拦截器
service.interceptors.request.use(
    config => {
        //请求头加token
        let token = getToken()
        if (token) {
            config.headers[TokenKey] = token
        }

        if (config.method.toLowerCase() == "post") {
            config.data = qs.stringify(config.data)
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        warnToast(error)
        return Promise.reject(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data
        console.log(res)

        if (res.code !== 200) {
            warnToast(res.msg || "Error")

            console.log(NEED_LOGIN_CODES)

            if (NEED_LOGIN_CODES.indexOf(res.code + '') >= 0) {
                warnToast('请登录')
                setTimeout(() => {
                    store.commit('logout')
                    router.push('/login')
                    return
                }, 1500)
            }

            return Promise.reject(res.msg || "Error")
        }

        return res
    },
    error => {
        console.log("err" + error) // for debug
        warnToast(error.message)
        return Promise.reject(error)
    }
)

export default service
