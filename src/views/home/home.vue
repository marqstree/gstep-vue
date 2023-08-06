<template>
  <Chart v-model:isShowDrawer="isShowDrawer" />
  <el-drawer v-model="isShowDrawer" title="编辑" direction="rtl">
    <Edit @close="onClose" />
  </el-drawer>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Edit from './widget/edit.vue'
import Chart from './widget/chart.vue'

const isShowDrawer = ref(false)

onMounted(async () => {
})

const onClose=()=>{
  isShowDrawer.value=false
}

</script>

<style scoped>
#mountNode {
  width: 100%;
  height: 100vh;
}
</style>

