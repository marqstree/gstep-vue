<template>
    <div class="widget">
        <div style="flex: auto">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref,defineEmits } from 'vue';


onMounted(() => {

})


const onCancel=()=>{
    close()
}

const onConfirm=()=>{
    close()
}

const close=()=>{
    emit('close')
}

const emit=defineEmits(['close'])

</script>
  
<style scoped>
.widget {}
</style>
  
  