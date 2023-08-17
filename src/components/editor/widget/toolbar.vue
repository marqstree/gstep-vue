<template>
    <div class="widget">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">保存</el-button>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import ApiUtil from '@/api/api'
import VM from '../vm/vm'

onMounted(() => {

})


const onCancel = () => {
    close()
}

const onConfirm = async () => {
    let params = VM.template
    let res = await ApiUtil.template_save(params)

    params = {
        templateId: res.data
    }
    let result = await ApiUtil.template_detail(params)
    VM.template = result.data

    emit('update:isRefreshChart',true)
}

const close = () => {
    emit('close')
}

const emit = defineEmits(['close','update:isRefreshChart'])

</script>
  
<style lang="scss" scoped>
.widget {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0 1px 0 0 #DBDBDB;
}
</style>
  
  