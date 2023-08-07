<template>
    <div id="mountNode"></div>
</template>
  
<script setup>
import G6 from '@antv/g6'
import { onMounted, ref, defineEmits } from 'vue'
import VM from '../vm/vm'
import { strWidth } from '@/util/str_util'

const emit = defineEmits(['update:isShowDrawer'])

let graph = null

onMounted(async () => {
    if (VM.template.groupId)
        await VM.getData()
    else
        VM.newChartData()
    setupChart()
})

const refreshChart = () => {
    VM.refreshChartData()
    // 加载流程图数据
    graph.data(VM.chartData) // 读取 Step 2 中的数据源到图上
    graph.render() // 渲染图
}

// 定义流程图
const setupChart = () => {
    const container = document.getElementById('mountNode')

    const width = container.scrollWidth
    const height = container.scrollHeight

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
                        y: -VM.nodeH/2,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: VM.BG_PRIMARY_COLOR,
                        radius: r,
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW / 2,
                        y: -VM.nodeH/2,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'title-box'
                })

                // title text
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH/2+10,
                        x: 0,
                        text: cfg.detail.title,
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'title',
                })

                // detail text
                group.addShape('text', {
                    attrs: {
                        y: -VM.nodeH/2+35,
                        x: 0,
                        text: cfg.detail.candidatesText,
                        fill: '#000',
                        fontSize: 12,
                        textAlign: 'center',
                        textBaseline: 'middle'
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'title',
                })

                return shape
            },
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
        },
        'single-node',
    )

    // 添加条件节点
    G6.registerNode(
        'add-condition',
        {
            drawShape: function drawShape(cfg, group) {
                const color = VM.BG_PRIMARY_COLOR;
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW/2,
                        y: -VM.conditionH/2,
                        width: VM.nodeW,
                        height: VM.conditionH,
                        stroke: '#666',
                        radius: r,
                    },
                    name: 'main-box'
                })

                // title text
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 0,
                        text: "添加条件",
                        fill: '#000',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        cursor: 'pointer'
                    },
                    name: 'title',
                })

                return shape
            },
        },
        'single-node',
    )

    // 结束节点
    G6.registerNode(
        'end',
        {
            drawShape: function drawShape(cfg, group) {
                const color = VM.BG_PRIMARY_COLOR;
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW/2,
                        y: -VM.endH/2,
                        width: VM.nodeW,
                        height: VM.endH,
                        stroke: VM.BG_END_COLOR,
                        fill: VM.BG_END_COLOR,
                        radius: r,
                    },
                    name: 'main-box'
                })

                // title text
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: 0,
                        text: "结束",
                        fill: '#fff',
                        fontSize: 14,
                        textAlign: 'center',
                        textBaseline: 'middle'
                    },
                    name: 'title',
                })

                return shape
            },
        },
        'single-node',
    )

    // 条件节点
    G6.registerNode(
        'condition',
        {
            drawShape: function drawShape(cfg, group) {
                const color = VM.BG_PRIMARY_COLOR;
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW/2,
                        y: -VM.nodeH/2,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: VM.BG_PRIMARY_COLOR,
                        radius: r,
                    },
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: -VM.nodeW/2,
                        y: -VM.nodeH/2,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    name: 'title-box'
                })

                // title text
                group.addShape('text', {
                    attrs: {
                        textBaseline: 'middle',
                        textAlign:'center',
                        y: -VM.nodeH/2+10,
                        x: 0,
                        text: cfg.detail.title,
                        fill: '#fff',
                        fontSize: 14,
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    },
                    name: 'title',
                })

                // detail text
                group.addShape('text', {
                    attrs: {
                        textBaseline: 'middle',
                        textAlign:'center',
                        y: -VM.nodeH/2+20,
                        x: 0,
                        text: cfg.detail.expression,
                        fill: '#000',
                        fontSize: 12
                    },
                    name: 'title',
                })

                return shape
            },
        },
        'single-node',
    )

    // 添加审核节点
    G6.registerNode(
        'audit',
        {
            drawShape: function drawShape(cfg, group) {
                const color = VM.BG_PRIMARY_COLOR;
                const r = 2;
                const shape = group.addShape('rect', {
                    attrs: {
                        x: 0,
                        y: 0,
                        width: VM.nodeW,
                        height: VM.nodeH,
                        stroke: VM.BG_PRIMARY_COLOR,
                        radius: r,
                    },
                    name: 'main-box'
                })

                group.addShape('rect', {
                    attrs: {
                        x: 0,
                        y: 0,
                        width: VM.nodeW,
                        height: 20,
                        fill: color,
                        radius: [r, r, 0, 0],
                        cursor: 'pointer',
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'title-box'
                })

                // title text
                group.addShape('text', {
                    attrs: {
                        textBaseline: 'top',
                        y: 5,
                        x: 24,
                        lineHeight: 20,
                        text: cfg.detail.title,
                        fill: '#fff',
                        cursor: 'pointer',
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'title',
                })

                // detail text
                group.addShape('text', {
                    attrs: {
                        textBaseline: 'bottom',
                        y: 42,
                        x: 24,
                        lineHeight: 20,
                        text: cfg.detail.candidatesText,
                        fill: '#000',
                    },
                    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                    name: 'title',
                })

                return shape
            },
        },
        'single-node',
    )

    // 自定义菜单
    const menu = new G6.Menu({
        offsetX: 10,
        offsetX: 10,
        itemTypes: ['node'],
        getContent(e) {
            const outDiv = document.createElement('div');
            outDiv.innerHTML = `<div style='font-size:16px;cursor:pointer;display:flex;align-items: center;justify-content: center;'>
                                    <div style='padding: 10px 15px;text-align:center;' data-tag='menu-condition'>
                                        <image src="https://www.bqdnao.com/faceroop-static/condition.png" style="width:60px;height:60px;" data-tag='menu-condition'/>
                                        <div style='margin-top:5px;' data-tag='menu-condition'>条件分支</div>
                                    </div>
                                    <div style='padding: 10px 15px;text-align:center;' data-tag='menu-audit'>
                                        <image src="https://www.bqdnao.com/faceroop-static/stamp.png" style="width:60px;height:60px;" data-tag='menu-audit' />
                                        <div style='margin-top:5px;' data-tag='menu-audit'>审核人</div>
                                    </div>
                                    <div style='padding: 10px 15px;text-align:center;' data-tag='menu-notify'>
                                        <image src="https://www.bqdnao.com/faceroop-static/plane.png" style="width:60px;height:60px;" data-tag='menu-notify' />
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

                VM.NewConditionStep(step)
                refreshChart()
            } else if (target.dataset.tag == 'menu-audit') {
                console.log('+++ click menu-audit +++++++++++++++++++')
            } else if (target.dataset.tag == 'menu-notify') {
                console.log('+++ click menu-notify +++++++++++++++++++')
            }

            return true
        },
    });

    // 定义g6图
    graph = new G6.Graph({
        modes: {
            default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
            nodeActive: ['hover', 'clickSelect']
        },
        container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        plugins: [menu], // 配置 Menu 插件
        fitView: true, // 是否将图适配到画布大小，可以防止超出画布或留白太多。
        width: width, // Number，必须，图的宽度
        height: height, // Number，必须，图的高度
        layout: {
            type: 'dagre',
            sortByCombo: false,
            ranksep: 10,
            nodesep: 50,
        },
        fitCenter: true,
        size: [100, 1000],
    })

    //////////////////////////////////////////////////////////////////////////
    // 监听事件并切换元素状态
    //////////////////////////////////////////////////////////////////////////
    //监听节点点击
    graph.on('node:click', (e) => {
        const { item } = e
        console.log("+++++++++ node:click ++++++++++++++++")
        if (item._cfg.currentShape == 'start') {
            emit('update:isShowDrawer', true)
        }
    })

    // 加载流程图数据
    graph.data(VM.chartData) // 读取 Step 2 中的数据源到图上
    graph.render() // 渲染图

}

</script>
  
<style scoped>
#mountNode {
    width: 100%;
    height: 100vh;
    position: relative;
}
</style>