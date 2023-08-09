import { ElMessageBox, ElMessage } from 'element-plus'


export function deleteConfirm() {
    return ElMessageBox.confirm(
        '确定删除?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })

            return Promise.resolve()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })

            return Promise.reject()
        })

}