<template>
    <div class="tree-node-wrapper">
        <div class="current-node">
            <span class="arrow empty" />
            <img class="arrow right" src="@/assets/right.png" v-if="data.hasChild && !data.isExpand" />
            <img class="arrow down" src="@/assets/right.png" v-if="data.hasChild && data.isExpand" />
            <img class="check" v-if="data.isChecked" src="@/assets/checked.png" />
            <img class="check" v-if="!data.isChecked" src="@/assets/uncheck.png" />
            <span class="content-wrapper" @click="onSelectNode">
                <img class="icon" src="@/assets/home.png" v-if="data.category == 'department'" />
                <img class="icon" src="@/assets/person.png" v-if="data.category == 'person'" />
                <span class="title">{{ data.name }}</span>
            </span>
            <div>{{ data.title }}</div>
        </div>
        <TreeNode class="child-node" v-for="(item,i) in data.children" :key="i" :data="item" />
    </div>
</template>
  
<script setup>
import { onMounted, ref, defineEmits, watch } from 'vue';
import TreeNode from './tree_node.vue'

const props = defineProps({
    data: Object
})

onMounted(() => {
    onLoadChildren()
})

const formatDepartments = (departments) => {
    let nodes = departments.map(e => {
        let node = e
        node.category = 'department'
        node.isLeaf = !node.hasSubDepartments && node.userCount == 0
        node.isSelected = isSelected(e)
        node.isExpand=false
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
        node.isExpand=false
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
</script>
  
<style lang="scss" scoped>
.tree-node-wrapper {}
</style>
  
  