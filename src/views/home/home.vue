<template>
  <div class="page">
    <Editor class="editor" baseUrl="http://localhost:9900" :template="template" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const template = ref({})

onMounted(() => {
  template.value = {
    id: 0,
    groupId: 1
  }
})

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100vh;

  .editor {
    width: 100%;
    height: 100%;
  }
}
</style>

