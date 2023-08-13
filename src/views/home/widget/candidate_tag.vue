<template>
    <span class="candidate-tag">
        <img class="icon" src="@/assets/home.png" v-if="candidate.category == 'department'" />
        <img class="icon" src="@/assets/person.png" v-if="candidate.category == 'user'" />
        <span class="title">{{ candidate.title }}</span>
        <img class="close" src="@/assets/close.png" @click="onDelete" />
    </span>
</template>

<script setup>
import { onMounted, ref, defineEmits, defineProps, watch } from 'vue'
import VM from '../vm/vm'
import ApiUtil from '@/api/api'

const props = defineProps({
    candidate:Object,
    index:Number
})

onMounted(() => {
    
})

const onDelete = () => {
    emit('delete', props.index)
}

const emit = defineEmits(['delete'])

</script>
  
<style lang="scss" scoped>
.candidate-tag {
    display: flex;
    align-items: center;
    border: 1px solid #999;
    border-radius: 4px;
    padding: 4px 5px;
    font-size: 12px;

    .icon {
        width: 15px;
        height: 15px;
    }

    .title {
        margin-left: 5px;
        font-size: 12px;
    }

    .close{
        margin-left: 5px;
        width:20px;
        height: 20px;
        cursor: pointer;
    }
}
</style>