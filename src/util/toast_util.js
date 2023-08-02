import { ElMessage } from 'element-plus'

export function warnToast(msg) {
    ElMessage({
        message: msg,
        type: 'warning',
        duration: 3 * 1000
    })
}

export function successToast(msg) {
    ElMessage({
        message: msg,
        type: 'success',
        duration: 3 * 1000
    })
}