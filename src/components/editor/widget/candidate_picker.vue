<template>
    <el-dialog v-model="isShowPickerLocal" title="可见范围">
        <div class="cat-row">
            <div class="cat" v-for="(item, i) in cats" :class="{ active: i == catSelectIndex }" :key="i"
                @click="onSelectCat(i)">
                {{ item.title }}
            </div>
        </div>
        <div class="">
            <el-tree :props="treeNode" :load="onLoadChildren" lazy show-checkbox check-strictly="true" node-key="id"
                :default-checked-keys="selectNodeIds" @check-change="onSelectNode">
                <template #default="{ node, data }">
                    <span class="custom-tree-node" @click="onSelectNode">
                        <img class="icon" src="@/assets/home.png" v-if="data.category == 'department'" />
                        <img class="icon" src="@/assets/person.png" v-if="data.category == 'person'" />
                        <span class="title">{{ data.name }}</span>
                    </span>
                </template>
            </el-tree>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="onConfirm">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, defineEmits, defineProps, watch } from 'vue'
import VM from '../vm/vm'
import ApiUtil from '@/api/api'

const props = defineProps({
    isShowPicker: Boolean,
    candidates: Array
})

const isShowPickerLocal = ref(false)
const candidatesLocal = ref({})
const cats = [{
    title: '组织',
    code: 'department'
}, {
    title: '岗位',
    code: 'position'
}]
const catSelectIndex = ref(0)
// 定义树节点数据字段
const treeNode = {
    //标题 
    label: 'name',
    //子节点
    children: 'children',
    // 是否叶子
    isLeaf: 'isLeaf',
}
const selectNodeIds = ref([])

onMounted(() => {

})

watch(props, () => {
    isShowPickerLocal.value = props.isShowPicker
    candidatesLocal.value = JSON.parse(JSON.stringify(props.candidates))
}, {
    immediate: true
})

const onSelectCat = (index) => {
    catSelectIndex.value = index
}

const onSelectNode = (data,
    checked,
    indeterminate) => {
    console.log(data, checked, indeterminate)
    indeterminate = false

    if (data.isSelected)
        return

    let candidate = {
        category: data.category,
        title: data.name,
        value: data.id
    }
    candidatesLocal.value.push(candidate)
}

const isSelected = (node) => {
    let idx = candidatesLocal.value.findIndex(e => {
        return e.category == node.category && e.value == node.id
    })
    return idx >= 0
}

const formatDepartments = (departments) => {
    let nodes = departments.map(e => {
        let node = e
        node.category = 'department'
        node.isLeaf = !node.hasSubDepartments && node.userCount == 0
        node.isSelected = isSelected(e)
        return node
    })

    return nodes
}

const formatUsers = (users) => {
    let nodes = users.map(e => {
        let node = e
        node.category = 'user'
        node.isLeaf = true
        node.isSelected = isSelected(e)
        return node
    })

    return nodes
}

const onLoadChildren = async (node, resolve) => {
    if (node.category == 'user')
        return

    let params = {
        parentId: node.data.id
    }
    let res = await ApiUtil.department_get_child_department(params)
    let departmentNodes = formatDepartments(res.data)

    params = {
        departmentId: node.data.id
    }
    let result = await ApiUtil.department_get_users(params)
    let userNodes = formatUsers(result.data)

    let unionNodes = departmentNodes
    unionNodes = unionNodes.concat(userNodes)

    selectNodeIds.value = unionNodes.filter(e=> e.isSelected).map(item=>item.id)
    console.log(selectNodeIds.value)

    resolve(unionNodes)
}

const onCancel = () => {
    emit('update:isShowPicker', false)
}

const onConfirm = async () => {
    emit('update:candidates', candidatesLocal.value)
    emit('update:isShowPicker', false)
}

const emit = defineEmits(['update:isShowPicker', 'update:candidates'])

</script>
  
<style lang="scss" scoped>
.cat-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .cat {
        cursor: pointer;
        color: #999;
        border-bottom: 1px solid #fff;
        padding: 0 10px 5px 10px;

        &.active {
            color: #0C4C7F;
            border-bottom: 1px solid #0C4C7F;
        }
    }
}

.custom-tree-node {
    display: flex;
    align-items: center;

    .icon {
        width: 15px;
        height: 15px;
    }

    .title {
        margin-left: 5px;
        font-size: 12px;
    }
}
</style>