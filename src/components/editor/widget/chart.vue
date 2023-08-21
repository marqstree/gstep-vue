<template>
    <div id="chartMountId"></div>
</template>
  
<script setup>
import G6 from '@antv/g6'
import { onMounted, ref, watch, defineProps, defineEmits, defineExpose } from 'vue'
import VM from '../vm/vm'
import { deleteConfirm } from '@/util/message_util'

const props = defineProps({
    isRefreshChart: Boolean,
    selectStep: Object
})
const emit = defineEmits(['update:isShowDrawer', 'update:isRefreshChart'])

let graph = null

onMounted(() => {
    setupChart()
})

watch(props, () => {
    if (props.isRefreshChart) {
        refreshChart()
        emit('update:isRefreshChart', false)
        return
    }
}, {
    immediate: true
})

const getTemplate = async() => {
    if (VM.template.id)
        await VM.getData()
    else
        VM.newTemplate()
}

const refreshChart = () => {
    console.log('+++ 刷新流程图 ++++++++++++++')
    VM.refreshChartData()
    // 加载流程图数据
    graph.data(VM.chartData) // 读取 Step 2 中的数据源到图上
    graph.render() // 渲染图
}

defineExpose({getTemplate,refreshChart})

// 定义流程图
const setupChart = () => {
    const container = document.getElementById('chartMountId')

    const scrollWidth = container.scrollWidth
    const scrollHeight = container.scrollHeight

    // 开始节点
    G6.registerNode(
        'start',
        {
            drawShape: function drawShape(cfg, group) {
                const color = VM.BG_PRIMARY_COLOR;
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: VM.BG_PRIMARY_COLOR,
                        radius: r,
                        cursor: 'pointer',
                    },
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    name: 'title-box'
                })

                // title text
                let titleText = cfg.step.title
                if (process.env.APP_IS_DEBUG) {
                    titleText = cfg.step.title + ':' + cfg.step.id
                }
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH / 2 + 11,
                        x: 0,
                        text: titleText,
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                // detail text
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH / 2 + 35,
                        x: 0,
                        text: cfg.step.detailText,
                        fill: '#000',
                        fontSize: 12,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 1]
                ]
            }
        },
        'single-node',
    )

    // 加号节点
    G6.registerNode(
        'add-child',
        {
            drawShape: function drawShape(cfg, group) {
                const shape = group.addShape('marker', {
                    attrs: {
                        x: 0,
                        y: 0,
                        r: VM.addR,
                        width: VM.addR * 2,
                        height: VM.addR * 2,
                        symbol: G6.Marker.expand,
                        stroke: '#666',
                        cursor: 'pointer'
                    },
                    // 在 G6 3.3 及之后的版本中，必须指定 name，可以是任意字符串，但需要在同一个自定义元素类型中保持唯一性
                    name: 'marker-shape',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 0], [0.5, 1]
                ]
            }
        },
        'single-node',
    )

    // 分支节点
    G6.registerNode(
        'branch',
        {
            drawShape: function drawShape(cfg, group) {
                const color = "#B66FF5"
                const r = 16
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.branchW / 2,
                        y: -VM.branchH / 2,
                        width: VM.branchW,
                        height: VM.branchH,
                        stroke: color,
                        fill: color,
                        radius: r,
                        cursor: 'pointer',
                    },
                    name: 'main-box'
                })

                // title text
                let titleText = "添加条件"
                if (process.env.APP_IS_DEBUG) {
                    titleText = "添加条件" + ":" + cfg.step.id
                }
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 0,
                        text: titleText,
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        cursor: 'pointer'
                    },
                    name: 'title',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 0], [0.5, 1]
                ]
            }
        },
        'single-node',
    )

    // 结束节点
    G6.registerNode(
        'end',
        {
            drawShape: function drawShape(cfg, group) {
                const color = VM.BG_PRIMARY_COLOR;
                const r = 16
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.endH / 2,
                        width: VM.nodeW,
                        height: VM.endH,
                        stroke: "#909399",
                        fill: "#909399",
                        radius: r,
                    },
                    name: 'main-box'
                })

                // title text
                let titleText = "结束"
                if (process.env.APP_IS_DEBUG) {
                    titleText = titleText + ':' + cfg.step.id
                }
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 1.5,
                        text: titleText,
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle'
                    },
                    name: 'title',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 0]
                ]
            }
        },
        'single-node',
    )

    // 条件节点
    G6.registerNode(
        'condition',
        {
            drawShape: function drawShape(cfg, group) {
                const r = 2;
                let color = "#FF6765"
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: color,
                        radius: r,
                        cursor: 'pointer',
                    },
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    name: 'title-box'
                })

                // title text
                let titleText = cfg.step.title
                if (process.env.APP_IS_DEBUG) {
                    titleText = titleText + ':' + cfg.step.id
                }
                group.addShape('text', {
                    attrs: {
                        textBaseline: 'middle',
                        textAlign: 'center',
                        y: -VM.nodeH / 2 + 11,
                        x: 0,
                        text: titleText,
                        fill: '#fff',
                        fontSize: 14,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                if (cfg.step.title != '默认条件') {
                    group.addShape('image', {
                        attrs: {
                            x: 40,
                            y: -VM.nodeH / 2 + 3,
                            width: 14,
                            height: 14,
                            img: 'https://www.bqdnao.com/faceroop-static/close_white.png',
                            cursor: 'pointer',
                        },
                        // 在 G6 3.3 及之后的版本中，必须指定 name，可以是任意字符串，但需要在同一个自定义元素类型中保持唯一性
                        name: 'delete-condition-image',
                    })
                }

                // detail text
                group.addShape('text', {
                    attrs: {
                        textBaseline: 'middle',
                        textAlign: 'center',
                        y: -VM.nodeH / 2 + 35,
                        x: 0,
                        text: cfg.step.detailText,
                        fill: '#000',
                        fontSize: 12,
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 0], [0.5, 1]
                ]
            }
        },
        'single-node',
    )

    // 审核节点
    G6.registerNode(
        'audit',
        {
            drawShape: function drawShape(cfg, group) {
                const color = "#FCAD22"
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: color,
                        radius: r,
                        cursor: 'pointer',
                    },
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    name: 'title-box'
                })

                // title text
                let titleText = cfg.step.title
                if (process.env.APP_IS_DEBUG) {
                    titleText = titleText + ':' + cfg.step.id
                }
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH / 2 + 11,
                        x: 0,
                        text: titleText,
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fontWeight: 'bold',
                    },
                    name: 'title',
                })

                //删除图标
                group.addShape('image', {
                    attrs: {
                        x: 40,
                        y: -VM.nodeH / 2 + 3,
                        width: 14,
                        height: 14,
                        img: 'https://www.bqdnao.com/faceroop-static/close_white.png',
                        cursor: 'pointer',
                    },
                    name: 'delete-audit-image',
                })

                // detail text
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH / 2 + 35,
                        x: 0,
                        text: cfg.step.detailText,
                        fill: '#000',
                        fontSize: 12,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        cursor: 'pointer',
                    },
                    name: 'detail',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 0], [0.5, 1]
                ]
            }
        },
        'single-node',
    )

    // 抄送节点
    G6.registerNode(
        'notify',
        {
            drawShape: function drawShape(cfg, group) {
                const color = "#3CB4B2"
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: color,
                        radius: r,
                        cursor: 'pointer',
                    },
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH / 2,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    name: 'title-box'
                })

                // title text
                let titleText = cfg.step.title
                if (process.env.APP_IS_DEBUG) {
                    titleText = titleText + ':' + cfg.step.id
                }
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH / 2 + 11,
                        x: 0,
                        text: titleText,
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                //删除图标
                group.addShape('image', {
                    attrs: {
                        x: 40,
                        y: -VM.nodeH / 2 + 3,
                        width: 14,
                        height: 14,
                        img: 'https://www.bqdnao.com/faceroop-static/close_white.png',
                        cursor: 'pointer',
                    },
                    name: 'delete-notify-image',
                })

                // detail text
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH / 2 + 35,
                        x: 0,
                        text: cfg.step.detailText,
                        fill: '#000',
                        fontSize: 12,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                return shape
            },
            getAnchorPoints() {
                return [
                    [0.5, 0], [0.5, 1]
                ]
            }
        },
        'single-node',
    )

    // 加号弹窗菜单
    const menu = new G6.Menu({
        offsetX: 5,
        offsetY: -40,
        itemTypes: ['node'],
        getContent(e) {
            const outDiv = document.createElement('div');
            outDiv.innerHTML = `<div style='font-size:12px;cursor:pointer;display:flex;align-items: center;justify-content: center;'>
                                    <div style='padding: 0 5px;text-align:center;' data-tag='menu-condition'>
                                        <image src="https://www.bqdnao.com/faceroop-static/condition.png" style="width:25px;height:25px;" data-tag='menu-condition'/>
                                        <div style='margin-top:5px;' data-tag='menu-condition'>条件分支</div>
                                    </div>
                                    <div style='padding: 10px 15px;text-align:center;' data-tag='menu-audit'>
                                        <image src="https://www.bqdnao.com/faceroop-static/stamp.png" style="width:25px;height:25px;" data-tag='menu-audit' />
                                        <div style='margin-top:5px;' data-tag='menu-audit'>审核人</div>
                                    </div>
                                    <div style='padding: 10px 15px;text-align:center;' data-tag='menu-notify'>
                                        <image src="https://www.bqdnao.com/faceroop-static/plane.png" style="width:25px;height:25px;" data-tag='menu-notify' />
                                        <div style='margin-top:5px;'data-tag='menu-notify'>抄送人</div>
                                    </div>
                                </div>`
            return outDiv
        },
        //鼠标左键触发
        trigger: 'click',
        //点击加号才弹出
        shouldBegin(evt) {
            return evt.item._cfg.currentShape == 'add-child'
        },
        //菜单点击回调
        handleMenuClick(target, item) {
            let step = item._cfg.model.step
            if (target.dataset.tag == 'menu-condition') {
                console.log('+++ click menu-condition +++++++++++++++++++')
                VM.newBranchStep(step)
                refreshChart()
            } else if (target.dataset.tag == 'menu-audit') {
                console.log('+++ click menu-audit +++++++++++++++++++')
                VM.newAuditStep(step)
                refreshChart()
            } else if (target.dataset.tag == 'menu-notify') {
                console.log('+++ click menu-notify +++++++++++++++++++')
                VM.newNotifyStep(step)
                refreshChart()
            }

            return true
        },
    })

    // 定义g6图
    graph = new G6.Graph({
        modes: {
            default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
            nodeActive: ['hover', 'clickSelect']
        },
        container: 'chartMountId', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        plugins: [menu], // 配置 Menu 插件
        fitView: false, // 是否将图适配到画布大小，可以防止超出画布或留白太多。
        width: scrollWidth, // Number，必须，图的宽度
        height: scrollHeight, // Number，必须，图的高度
        layout: {
            type: 'dagre',
            rankdir: 'TB',
            ranksep: 15,
            nodesep: 35,
            controlPoints: true
        },
        defaultNode: {
            size: [VM.nodeW, VM.nodeH * 0.6],
            type: 'rect',
            anchorPoints: [[0.5, 0], [0.5, 1]]
        },
        defaultEdge: {
            type: 'polyline',
            style: {
                radius: 10,
                offset: 0,
                // style: {
                //     endArrow: {
                //         path: 'M 0,0 L 8,4 L 8,-4 Z',
                //     },
                // }
            },
        },
        fitCenter: true
    })

    //////////////////////////////////////////////////////////////////////////
    // 监听事件并切换元素状态
    //////////////////////////////////////////////////////////////////////////
    //监听节点点击
    graph.on('node:click', (e) => {
        const { item } = e
        console.log("+++++++++ node:click ++++++++++++++++")
        if (item._cfg.currentShape == 'start'
            || item._cfg.currentShape == 'audit'
            || item._cfg.currentShape == 'notify'
            || (item._cfg.currentShape == 'condition' && item._cfg.model.step.title != '默认条件')) {
            emit('update:selectStep', item._cfg.model.step)
            emit('update:isShowDrawer', true)
        } else if (item._cfg.currentShape == 'branch') {
            let step = item._cfg.model.step
            VM.addConditionStep(step)
            refreshChart()
        }
    })

    //条件节点:删除按钮
    graph.on('delete-condition-image:click', (e) => {
        const { item } = e
        console.log("+++++++++ delete-condition-image:click ++++++++++++++++")
        e.bubbles = false
        let step = item._cfg.model.step
        deleteConfirm().then(() => {
            VM.deleteChildStepById(step.id, VM.template.rootStep)
            refreshChart()
        })
    })

    //审核节点:删除按钮
    graph.on('delete-audit-image:click', (e) => {
        const { item } = e
        console.log("+++++++++ delete-audit-image:click ++++++++++++++++")
        e.bubbles = false
        let step = item._cfg.model.step
        deleteConfirm().then(() => {
            VM.deleteChildStepById(step.id, VM.template.rootStep)
            refreshChart()
        })
    })

    //抄送节点:删除按钮
    graph.on('delete-notify-image:click', (e) => {
        const { item } = e
        console.log("+++++++++ delete-notify-image:click ++++++++++++++++")
        e.bubbles = false
        let step = item._cfg.model.step
        deleteConfirm().then(() => {
            VM.deleteChildStepById(step.id, VM.template.rootStep)
            refreshChart()
        })
    })

    // 加载流程图数据
    graph.data(VM.chartData) // 读取 Step 2 中的数据源到图上
    graph.render() // 渲染图
}

</script>
  
<style scoped>
#chartMountId {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>