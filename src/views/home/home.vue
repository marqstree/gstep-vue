<template>
  <div class="page">
    <Editor class="editor" 
      baseUrl="http://localhost:9900" 
      :template="template"
      @cancel="onCancel"
      @save="onSave" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const template = ref({})

onMounted(() => {
  template.value = {
    id: null,
    groupId: 1
  }
})

const onCancel=()=>{
  console.log('cancel')
}

const onSave=()=>{
  console.log('save')
}

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

