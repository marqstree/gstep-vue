<template>
  <div class="page">
    <Editor class="editor" 
      baseUrl="http://localhost:9900" 
      v-model:template="template"
      @cancel="onCancel"
      @save="onSave" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const template = ref({})

onMounted(() => {
  template.value = {
    // id: 79
    // templateId: 1
  }
})

const onCancel=()=>{
  console.log('cancel')
}

const onSave=()=>{
  console.log('save')
  console.log('+++ saved template ++++++')
  console.log(template.value)
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

