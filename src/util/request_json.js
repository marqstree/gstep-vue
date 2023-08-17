import axios from "axios"
import { warnToast } from "@/util/toast_util.js"
import ApiUtil from "@/api/api"

// create an axios instance
const service = axios.create({
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000, // request timeout
})

//请求拦截器
service.interceptors.request.use(
    config => {
        if (config.method.toLowerCase() == "post") {
            config.data = JSON.stringify(config.data)
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