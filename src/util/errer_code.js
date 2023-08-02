// 返回这些错误码都要清除cookie及local storage
//未登录 错误码
const NEED_LOGIN = process.env.VUE_APP_NEED_LOGIN_CODE;

export const NEED_LOGIN_CODES = [
    NEED_LOGIN,
]