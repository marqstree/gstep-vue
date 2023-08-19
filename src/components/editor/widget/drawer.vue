<template>
    <div class="edit-drawer-mask" v-show="isShowDrawer" @click="onClose">
        <div class="content" @click.stop>
            <div class="head">
                <img src="@/assets/close.png" class="close" @click="onClose" />
            </div>
            <slot></slot>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits,watch } from 'vue';

const props = defineProps(['isShowDrawer'])
const emit = defineEmits('update:isShowDrawer')

onMounted(() => {

})

const onClose = ()=>{
    emit('update:isShowDrawer',false)
}

</script>
  
<style lang="scss" scoped>
.edit-drawer-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    overflow: auto;
    .content{
        position:absolute;
        top:0;
        bottom: 0;
        right:0;
        background: #fff;
        width: 450px;
        height: 100%;
        padding: 15px 20px;
        box-sizing: border-box;
        .head{
            text-align: right;
            .close{
                width: 25px;
                height: 25px;
                cursor: pointer;
                opacity: 0.5;
            }
        }
    }
}
</style>
  
  