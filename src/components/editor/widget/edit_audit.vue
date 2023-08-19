<template>
    <div class="edit-audit-widget">
        <div class="field-box">
            <div class="title">标题</div>
            <el-input v-model="selectStep.title" />
        </div>
        <div class="field-box">
            <div class="title">可提交审核的候选人/部门</div>
            <div class="tags">
                <CandidateTag class="candidate" v-for="(item, i) in selectStepLocal.candidates" :key="i" :candidate="item"
                    @deleteCandidate="onDeleteCandidate" />
                <div class="edit" @click="onShowPicker">修改</div>
            </div>
        </div>

        <div class="field-box">
            <div class="title">多人审批方式</div>
            <el-select v-model="selectStepLocal.auditMethod" placeholder="Select">
                <el-option v-for="item in auditMethods" :key="item.value" :label="item.label" :value="item.value"
                    :disabled="item.disabled" />
            </el-select>
        </div>

        <CandidatePicker v-if="isShowPicker" v-model:isShowPicker="isShowPicker"
            v-model:candidates="selectStepLocal.candidates" />

        <div class="btn-row">
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits, defineProps, watch } from 'vue'
import VM from '../vm/vm'
import CandidatePicker from './candidate_picker.vue'
import CandidateTag from './candidate_tag.vue'
import {ElButton,ElSelect,ElOption,ElInput} from 'element-plus'

const props = defineProps({
    selectStep: Object,
    isRefreshChart: Boolean
})

const selectStepLocal = ref({})
const isShowPicker = ref(false)
const auditMethods = [{ label: '或签', value: 'or' }, { label: '会签', value: 'and' }]

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

const onConfirm = () => {
    let findStep = VM.findStep(props.selectStep.id, VM.template.rootStep)
    findStep.title = selectStepLocal.value.title
    findStep.candidates = selectStepLocal.value.candidates
    findStep.auditMethod = selectStepLocal.value.auditMethod
    emit('update:isRefreshChart', true)
    close()
}

const close = () => {
    emit('close')
}

const onShowPicker = () => {
    isShowPicker.value = true
}

const onDeleteCandidate = (candidate) => {
    let idx=selectStepLocal.value.candidates.indexOf(e=>e.id==candidate.id)
    selectStepLocal.value.candidates.splice(idx, 1)
}

const emit = defineEmits(['close', 'update:isRefreshChart'])

</script>
  
<style scoped>
.edit-audit-widget {
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

.field-box {
    padding: 0 0 30px 0;

    .title {
        font-size: 14px;
        font-weight: bold;
        color: #606266;
        margin-bottom: 15px;
    }

    .tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .candidate {
            margin: 0 5px 5px 0;
        }

        .edit {
            font-size: 14px;
            color: #409eff;
            cursor: pointer;
            margin: 0 0 5px 5px;
        }
    }
}
</style>