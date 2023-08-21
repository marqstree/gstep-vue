<template>
    <div class="editor-toolbar">
        <span class="btn" @click="onCancel">取消</span>
        <span class="btn confirm" @click="onConfirm">保存</span>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import ApiUtil from '@/api/api'
import VM from '../vm/vm'

onMounted(() => {

})

const onCancel = () => {
    emit('cancel')
}

const onConfirm = async () => {
    await VM.save2db()

    emit('update:isRefreshChart',true)
    emit('save')
}

const emit = defineEmits(['cancel','save','update:isRefreshChart'])

</script>
  
<style lang="scss" scoped>
.editor-toolbar {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0 1px 0 0 #DBDBDB;

    .btn{
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        padding: 5px 15px;
        margin: 0 7px 0 0;
        cursor: pointer;
        &.confirm{
            background: #409eff;
            color: white;
        }
    }
}
</style>
  
  