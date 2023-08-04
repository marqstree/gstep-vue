import request from "@/util/request"
import request_json from "@/util/request_json"
import request_upload from '@/util/request_upload.js'

class ApiUtil {
    static auth_login(data) {
        return request_json({
            url: "/admin/auth/login",
            method: "POST",
            data
        })
    }

    static template_detail(data) {
        return request_json({
            url: "/template/detail",
            method: "POST",
            data
        })
    }
}

export default ApiUtil