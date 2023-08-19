<template>
  <div class="gstep-editor-wrapper">
    <div class="chart-wrapper">
      <Toolbar v-model:isRefreshChart="isRefreshChart" @cancel="onCancel" @save="onSave" />
      <Chart class="chart" ref="chart" v-model:isShowDrawer="isShowDrawer" v-model:isRefreshChart="isRefreshChart"
        v-model:selectStep="selectStep" />
    </div>
    <Drawer v-model:isShowDrawer="isShowDrawer">
      <EditStart v-if="selectStep.category == 'start'" v-model:selectStep="selectStep" @close="onCloseDrawer"
        v-model:isRefreshChart="isRefreshChart" />
      <EditAudit v-if="selectStep.category == 'audit'" v-model:selectStep="selectStep" @close="onCloseDrawer"
        v-model:isRefreshChart="isRefreshChart" />
      <EditNotify v-if="selectStep.category == 'notify'" v-model:selectStep="selectStep" @close="onCloseDrawer"
        v-model:isRefreshChart="isRefreshChart" />
      <EditCondition v-if="selectStep.category == 'condition'" v-model:selectStep="selectStep" @close="onCloseDrawer"
        v-model:isRefreshChart="isRefreshChart" />
    </Drawer>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, defineProps, watch, defineEmits } from 'vue'
import EditStart from './widget/edit_start.vue'
import EditAudit from './widget/edit_audit.vue'
import EditNotify from './widget/edit_notify.vue'
import EditCondition from './widget/edit_condition.vue'
import Chart from './widget/chart.vue'
import Toolbar from './widget/toolbar.vue'
import Drawer from './widget/drawer.vue'
import ApiUtil from '@/api/api'
import VM from './vm/vm'

const isShowDrawer = ref(false)
const isRefreshChart = ref(false)
const selectStep = ref({})
const chart = ref(null)

const props = defineProps({
  baseUrl: String,
  template: Object
})

onBeforeMount(() => {
  ApiUtil.baseUrl = props.baseUrl
  console.log('流程图编辑器baseUrl:')
  console.log(ApiUtil.baseUrl)
})

onMounted(() => {
  refreshDataAndChart()
})

watch(props, (newValue, oldValue) => {
  console.log('xxxxxxxxxxxxxxxxxx')
  if (chart.value
    && newValue.template
    && oldValue.template
    && oldValue.template.id != newValue.template.id) {
    refreshDataAndChart()
  }
}, {
  immediate: true
})

const refreshDataAndChart = async () => {
  VM.template = props.template
  await chart.value.getTemplate()
  chart.value.refreshChart()
}

const onCancel = () => {
  emit('cancel')
}

const onSave = () => {
  emit('save')
}

const onCloseDrawer = () => {
  isShowDrawer.value = false
}

const emit = defineEmits(['cancel', 'save'])

</script>

<style lang="scss" scoped>
.gstep-editor-wrapper {
  .chart-wrapper {
    width: 100%;
    height: 100%;

    .chart {
      height: calc(100% - 50px);
    }
  }
}
</style>

