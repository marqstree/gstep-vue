<template>
    <div class="widget">
        <div class="title">可提交的成员</div>
        <div class="candidate" v-for="(item,i) in selectStep.candidates" :key="i">
            <div class="title">item.title</div>
            <Close @click="onDelete" />
        </div>
        <div class="add">编辑111</div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits, defineProps, watch } from 'vue'
import VM from '../vm/vm'
import ApiUtil from '@/api/api'
import CandidatePicker from './candidate_picker.vue'

const props = defineProps({
    selectStep: Object
})

const selectStepLocal = ref({})

onMounted(() => {

})

watch(props, () => {
    selectStepLocal.value = JSON.parse(JSON.stringify(props.selectStep))
    console.log(selectStepLocal)
}, {
    immediate: true
})

const onCancel = () => {
    close()
}

const onConfirm = async () => {
    let findStep = VM.findStep(props.selectStep.id, VM.template.rootStep)
    findStep.title = selectStepLocal.value.title
    await VM.save2db()
    emit('update:isRefreshChart', true)
    close()
}

const close = () => {
    emit('close')
}

const emit = defineEmits(['close', 'update:isRefreshChart'])

</script>
  
<style lang="scss" scoped>
.widget {
    height: 100%;
    display: flex;
    flex-direction: column;

    .form {
        flex: 1;
        height: 0;
    }

    .btn-row {
        margin-top: 15px;
    }
}
</style>