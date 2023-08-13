import request from "@/util/request"
import request_json from "@/util/request_json"
import request_upload from '@/util/request_upload.js'

class ApiUtil {
    static template_detail(data) {
        return request_json({
            url: "/template/detail",
            method: "POST",
            data
        })
    }

    static template_save(data) {
        return request_json({
            url: "/template/save",
            method: "POST",
            data
        })
    }

    static department_get_child_department(data) {
        return request_json({
            url: "/department/get_child_department",
            method: "POST",
            data
        })
    }

    static department_get_users(data) {
        return request_json({
            url: "/department/get_users",
            method: "POST",
            data
        })
    }
}

export default ApiUtil