<template>
    <div id="mountNode"></div>
</template>
  
<script setup>
import G6 from '@antv/g6'
import { onMounted, ref, defineEmits } from 'vue'
import ApiUtil from '@/api/api'
import { fittingString } from '@/util/str_util'
import { getMaxStepId } from '@/util/step_util'

const BG_PRIMARY_COLOR = "#2196f3ff"
const BG_HOVER_COLOR = "#2196f3aa"
const FONT_PRIMARY_COLOR = "#333333"
const FONT_HOVER_COLOR = "#999999"

const emit = defineEmits(['update:isShowDrawer'])
var chartData = {}

const nodeW = 200
const nodeH = 150
let template = {
    id: 0,
    groupId: 0,
    title: ""
}
let graph = null
let isShowMenu = false
let isAddBtnClick = false

onMounted(async () => {
    if (template.groupId) {
        await getData()
    }

    newChartData()
    setupChart()
})

// 查询入库流程图数据
const getData = async () => {
    const params = {
        groupId: template.groupId
    }
    template = await ApiUtil.template_detail(params)
}

const refreshChart = () => {
    chartData = {
        nodes: [],
        edges: []
    }
    formatStep(template.rootStep)
    step2chartData(template.rootStep)
    // 加载流程图数据
    graph.data(chartData) // 读取 Step 2 中的数据源到图上
    graph.render() // 渲染图
}

// 创建新流程图数据
const newChartData = () => {
    chartData = {
        nodes: [],
        edges: []
    }

    if (!template.rootStep || !template.rootStep.id) {
        template.rootStep = {
            "id": 1,
            "title": "申请",
            "category": "start",
            "level": 1,
            "form": {},
            "candidates": [],
            "nextSteps": [
                {
                    "id": 9999,
                    "title": "结束",
                    "category": "end",
                    "level": 2,
                    "form": {}
                }
            ]
        }
    }

    formatStep(template.rootStep)
    step2chartData(template.rootStep)
}

// 格式化流程步骤数据
const formatStep = (step) => {
    if (!step)
        return

    // 候选人文案
    step.candidatesText = ''
    if (step.candidates && step.candidates.length > 0) {
        let txt = step.candidates.map(e => e.name).join(',')
        step.candidatesText = fittingString(txt, 90, 14)
    }

    if (step.nextSteps && step.nextSteps.length > 0) {
        step.nextSteps.forEach(item => {
            formatStep(item)
        })
    }
}

// 流程步骤转节点数据
const step2chartData = (step) => {
    if (!step || !step.id)
        return

    let prevNode = null
    if(chartData.nodes && chartData.nodes.length>0)
        prevNode = chartData.nodes[chartData.nodes.length-1]

    let node = {}
    let y = prevNode ? prevNode.y + nodeH : 0
    if (step.category != 'end') {
        node = {
            id: step.id + '', // String，该节点存在则必须，节点的唯一标识
            x: nodeW, // Number，可选，节点位置的 x 值
            y: y, // Number，可选，节点位置的 y 值
            // type: 'rect', // 矩形节点
            label: step.title, // 矩形节点框内的文字
            detail: step,
            bg_color: BG_PRIMARY_COLOR,
            font_color: FONT_PRIMARY_COLOR,
            type: 'node-start',
            anchorPoints: [
                [0.5, 0.5]
            ]
        }
    } else {
        node = {
            id: step.id + '', // String，该节点存在则必须，节点的唯一标识
            x: nodeW, // Number，可选，节点位置的 x 值
            y: y, // Number，可选，节点位置的 y 值
            type: 'node-end',
            label: '结束',
            detail: step,
            anchorPoints: [
                [0.5, 0]
            ]
        }
    }
    chartData.nodes.push(node)

    if (prevNode) {
        let edge = {
            source: prevNode.id, // String，必须，起始点 id
            target: node.id, // String，必须，目标点 id
            label: '', // 边的文本
            style: {
                // endArrow: true,
                // startArrow: false,
                // 箭头样式
                endArrow: {
                    lineDash: false,
                    path: G6.Arrow.triangle(10, 10, 2), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
                    d: 2,
                    fill: '#999999ff',
                    stroke: '#999999ff'
                },
                fill: '#99999966',
                stroke: '#99999966'
            }
        }
        chartData.edges.push(edge)
    }

    if (!step.nextSteps || step.nextSteps.length < 1)
        return

    for (var i = 0; i < step.nextSteps.length; i++) {
        step2chartData(step.nextSteps[i])
    }
}

// 定义流程图
const setupChart = () => {
    const container = document.getElementById('mountNode')

    const width = container.scrollWidth
    const height = container.scrollHeight

    // 自定义开始节点
    G6.registerNode(
        'node-start',
        (cfg) => `
      <group>
        <rect>
          <rect style={{
            width: 150,
            height: 20,
            fill: ${cfg.bg_color},
            radius: [6, 6, 0, 0],
            stroke: ${cfg.bg_color},
            cursor:'pointer'
          }}>
            <text style={{
              marginTop: 2,
              marginLeft: 75,
              textAlign: 'center',
              fontWeight: 'bold',
              fill: '#fff',
              cursor:'pointer'
             }} name="title-text">{{detail.title}}</text>
          </rect>
          <rect style={{
            width: 150,
            height: 40,
            marginLeft:0,
            stroke: ${cfg.bg_color},
            fill: #ffffff,
            radius: [0, 0, 6, 6],
            cursor:'pointer'
          }}>
            <text style={{ 
              marginTop: 5,
              marginLeft: 5,
              fill: ${cfg.font_color}, 
              width:50,
              cursor:'pointer' 
            }} >责任人: {{detail.candidatesText}}</text>
          </rect>
        </rect>
        <circle style={{
          stroke: ${cfg.bg_color},
          r: 10,
          fill: '#fff',
          marginLeft: 75,
          cursor: 'pointer'
        }} >
          <image style={{ img: 'https://www.bqdnao.com/faceroop-static/add.png', width: 12, height: 12,  marginLeft: 69,  marginTop: -6,cursor: 'pointer' }} name="add-btn" />
        </circle>
      </group>`,
    )

    // 自定义结束节点
    G6.registerNode(
        'node-end',
        (cfg) => `
      <group>
        <rect>
          <rect style={{
            width: 150,
            height: 25,
            fill: '#bbb',
            radius: [6, 6, 6, 6],
            stroke: '#bbb',
            lineWidth:0,
          }}>
            <text style={{
              marginTop: 3,
              marginLeft: 75,
              textAlign: 'center',
              fontWeight: 'bold',
              fill: '#fff',
             }} name="title-text">结束</text>
          </rect>
        </rect>
      </group>`,
    )

    const menu = new G6.Menu({
        offsetX: 10,
        offsetX: 10,
        itemTypes: ['node'],
        getContent(e) {
            const outDiv = document.createElement('div');
            outDiv.innerHTML = `<div style='font-size:16px;cursor:pointer;display:flex;align-items: center;justify-content: center;'>
                                    <div style='padding: 10px 15px;text-align:center;' data-tag='menu-condition'>
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
            let isShow = isAddBtnClick
            isAddBtnClick = false
            return isShow
        },
        //菜单点击回调
        handleMenuClick(target, item) {
            let step = item._cfg.model.detail
            if (target.dataset.tag == 'menu-condition') {
                console.log('+++ click menu-condition +++++++++++++++++++')

                let newStep = {
                    "id": getMaxStepId(template.rootStep) + 1,
                    "title": "条件1",
                    "category": "condition",
                    "level": step.level + 1,
                    "form": {}
                }
                step.nextSteps.unshift(newStep)
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
        fitCenter: true,
        size: [100, 1000],
    })

    //////////////////////////////////////////////////////////////////////////
    // 监听事件并切换元素状态
    //////////////////////////////////////////////////////////////////////////
    // 鼠标进入节点
    graph.on("node:mouseenter", (e) => {
        const node = e.item; // 获取鼠标进入的节点元素对象
        console.log("+++++ mouseenter +++++++++++++++++++++")

        if (node._cfg.currentShape == 'node-end')
            return

        graph.updateItem(node, {
            bg_color: BG_HOVER_COLOR,
            font_color: FONT_HOVER_COLOR
        })
        graph.refreshItem(node)
    })

    // 鼠标离开节点
    graph.on("node:mouseleave", (e) => {
        const node = e.item; // 获取鼠标离开的节点元素对象
        console.log("+++++ mouseleave +++++++++++++++++++++")

        if (node._cfg.currentShape == 'node-end')
            return

        graph.updateItem(node, {
            bg_color: BG_PRIMARY_COLOR,
            font_color: FONT_PRIMARY_COLOR
        })
        graph.refreshItem(node)
    })

    //监听节点点击
    graph.on('node:click', (e) => {
        const { item } = e
        console.log("+++++++++ node:click ++++++++++++++++")
        if (item._cfg.currentShape == 'node-end')
            return

        if (!isAddBtnClick) {
            emit('update:isShowDrawer', true)
        }
    })

    // 监听加号点击
    graph.on('add-btn:click', (e) => {
        const { item } = e
        console.log("+++++++++ add-btn:click ++++++++++++++++")
        // // 阻止冒泡
        // e.propagationStopped = true

        isAddBtnClick = true
    })

    // 加载流程图数据
    graph.data(chartData) // 读取 Step 2 中的数据源到图上
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
  
  