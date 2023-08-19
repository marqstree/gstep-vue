<template>
    <div class="edit-dialog-mask" v-show="isShowDialog" @click="onClose">
        <div class="dialog" @click.stop>
            <div class="head">
                <span class="title">{{ title }}</span>
                <img src="@/assets/close.png" class="close" @click="onClose" />
            </div>
            <div class="content">
                <slot></slot>
            </div>
            <div class="foot">
                <span class="btn" @click="onCancel">取消</span>
                <span class="btn confirm" @click="onConfirm">保存</span>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits, watch } from 'vue';

const props = defineProps(['isShowDialog', 'title'])
const emit = defineEmits('update:isShowDialog', 'cancel', 'confirm')

onMounted(() => {

})

const onClose = () => {
    emit('update:isShowDialog', false)
}


const onCancel = () => {
    emit('cancel')
    emit('update:isShowDialog', false)
}

const onConfirm = async () => {
    emit('confirm')
    emit('update:isShowDialog', false)
}
</script>
  
<style lang="scss" scoped>
.edit-dialog-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    .dialog {
        background: #fff;
        min-width: 450px;
        padding: 15px 20px;
        box-sizing: border-box;

        .head {
            position: relative;
            height: 40px;

            .title {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                font-size: 16px;
                text-align: center;
                line-height: 40px;
            }

            .close {
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                width: 25px;
                height: 25px;
                margin: auto auto;
                cursor: pointer;
                opacity: 0.5;
            }
        }

        .content{
            padding: 15px 15px;
        }

        .foot {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .btn {
                border-radius: 4px;
                border: 1px solid #dcdfe6;
                padding: 5px 15px;
                margin: 0 7px 0 0;
                cursor: pointer;

                &.confirm {
                    background: #409eff;
                    color: white;
                }
            }
        }
    }
}</style>
  
  