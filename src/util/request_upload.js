import axios from "axios"
import { getToken, TOKEN_KEY } from "./auth_util"
import { warnToast } from "@/util/toast_util.js"
import router from '@/router/index.js'
import { ElLoading } from 'element-plus'

const TokenKey = TOKEN_KEY
import store from '../store'
import { NEED_LOGIN_CODES } from './errer_code.js'

// create an axios instance
const service = axios.create({
    baseURL: process.env.APP_DOMAIN, // url = domain + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 1000 * 60 * 5, // request timeout
})

//请求拦截器
service.interceptors.request.use(
    config => {
        //loading
        ElLoading.service()

        //设置文件上传请求头
        config.headers["Content-Type"] = "multipart/form-data"

        //请求头加token
        let token = getToken()
        if (token) {
            config.headers[TokenKey] = token
        }

        //解析并传入post参数
        if (config.method.toLowerCase() == "post") {
            var form = new FormData()
            // 文件对象
            for (var key in config.data) {
                form.append(key, config.data[key])
            }
            config.data = form
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        warnToast(error)
        ElLoading.service().close()
        return Promise.reject(error)
    }
)

//响应拦截器
service.interceptors.response.use(
    response => {
        ElLoading.service().close()

        const res = response.data
        console.log(res)

        if (res.code !== 200) {
            warnToast(res.msg || "Error")

            if (NEED_LOGIN_CODES.indexOf(res.code) >= 0) {
                warnToast('请登录')
                store.commit('logout')
                router.push('/login')
                return
            }

            return Promise.reject(new Error(res.msg || "Error"))
        }

        return res
    },
    error => {
        console.log("err" + error) // for debug
        warnToast(error)
        ElLoading.service().close()
        return Promise.reject(error)
    }
)

export default service