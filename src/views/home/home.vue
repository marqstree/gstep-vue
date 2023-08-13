<template>
  <div class="page">
    <div class="chart-wrapper">
      <Toolbar v-model:isRefreshChart="isRefreshChart" />
      <Chart class="chart" v-model:isShowDrawer="isShowDrawer" v-model:isRefreshChart="isRefreshChart"
        v-model:selectStep="selectStep" />
    </div>
    <el-drawer v-model="isShowDrawer" title="编辑" direction="rtl" size="450">
      <EditStart v-if="selectStep.category=='start'" v-model:selectStep="selectStep" @close="onClose" v-model:isRefreshChart="isRefreshChart" />
      <EditAudit v-if="selectStep.category=='audit'" v-model:selectStep="selectStep" @close="onClose" v-model:isRefreshChart="isRefreshChart"/>
      <EditNotify v-if="selectStep.category=='notify'" v-model:selectStep="selectStep" @close="onClose" v-model:isRefreshChart="isRefreshChart"/>
      <EditCondition v-if="selectStep.category=='condition'" v-model:selectStep="selectStep" @close="onClose" v-model:isRefreshChart="isRefreshChart"/>
    </el-drawer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import EditStart from './widget/edit_start.vue'
import EditAudit from './widget/edit_audit.vue'
import EditNotify from './widget/edit_notify.vue'
import EditCondition from './widget/edit_condition.vue'
import Chart from './widget/chart.vue'
import Toolbar from './widget/toolbar.vue'

const isShowDrawer = ref(false)
const isRefreshChart = ref(false)
const selectStep = ref({})

onMounted(async () => {
})

const onClose = () => {
  isShowDrawer.value = false
}

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100vh;

  .chart-wrapper {
    width: 100%;
    height: 100%;

    .chart {
      height: calc(100% - 50px);
    }
  }
}
</style>

