import request_json from "@/util/request_json"


class ApiUtil {
    static baseUrl = ""

    static template_detail(data) {
        return request_json({
            url: ApiUtil.baseUrl + "/template/detail",
            method: "POST",
            data
        })
    }

    static template_save(data) {
        return request_json({
            url: ApiUtil.baseUrl + "/template/save",
            method: "POST",
            data
        })
    }

    static department_get_child_department(data) {
        return request_json({
            url: ApiUtil.baseUrl + "/department/get_child_department",
            method: "POST",
            data
        })
    }

    static department_get_users(data) {
        return request_json({
            url: ApiUtil.baseUrl + "/department/get_users",
            method: "POST",
            data
        })
    }
}

export default ApiUtil