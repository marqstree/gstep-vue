<template>
  <div class="page">
    <div class="chart-wrapper">
      <Toolbar v-model:isRefreshChart="isRefreshChart" />
      <Chart class="chart" v-model:isShowDrawer="isShowDrawer" v-model:isRefreshChart="isRefreshChart" />
    </div>
    <el-drawer v-model="isShowDrawer" title="编辑" direction="rtl">
      <Edit @close="onClose" />
    </el-drawer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Edit from './widget/edit.vue'
import Chart from './widget/chart.vue'
import Toolbar from './widget/toolbar.vue'

const isShowDrawer = ref(false)
const isRefreshChart = ref(false)

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

