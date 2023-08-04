<template>
  <div id="mountNode"></div>
  <el-drawer v-model="isShowDrawer" title="编辑" direction="rtl">
    <Content @close="onClose" />
  </el-drawer>
</template>

<script setup>
import G6 from '@antv/g6'
import { onMounted, ref } from 'vue';
import Content from './widget/content.vue'
import ApiUtil from '@/api/api'

const isShowDrawer = ref(false)

var chartData = {
  // 点集
  nodes: [
    {
      id: 'node-start', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 0, // Number，可选，节点位置的 y 值
      type: 'rect', // 矩形节点
      label: '申请', // 矩形节点框内的文字
      // 矩形节点框样式
      style: {
        fill: '#FFFFFF',
        stroke: '#4A94FF66',
        lineWidth: 1,
        radius: 4
      },
      anchorPoints: [
        [0.5, 0.5], [1, 0.5]
      ]
    },
    {
      id: 'node-audit', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 100, // Number，可选，节点位置的 y 值
      type: 'rect', // 矩形节点
      label: '审核', // 矩形节点框内的文字
      // 矩形节点框样式
      style: {
        fill: '#FFFFFF',
        stroke: '#4A94FF66',
        lineWidth: 1,
        radius: 4
      },
      anchorPoints: [
        [0.5, 0]
      ]
    },
    {
      id: 'node-approve', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      type: 'rect', // 矩形节点
      label: '审批', // 矩形节点框内的文字
      // 矩形节点框样式
      style: {
        fill: '#FFFFFF',
        stroke: '#4A94FF66',
        lineWidth: 1,
        radius: 4
      },
      anchorPoints: [
        [0.5, 0], [1, 0.5]
      ]
    },
    {
      id: 'node-end', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 300, // Number，可选，节点位置的 y 值
      type: 'rect', // 矩形节点
      label: '批准', // 矩形节点框内的文字
      // 矩形节点框样式
      style: {
        fill: '#FFFFFF',
        stroke: '#4A94FF66',
        lineWidth: 1,
        radius: 4
      },
      anchorPoints: [
        [0.5, 0], [0.5, 0.5]
      ]
    }
  ],
  // 边集
  edges: [
    {
      source: 'node-start', // String，必须，起始点 id
      target: 'node-audit', // String，必须，目标点 id
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
    },
    {
      source: 'node-audit', // String，必须，起始点 id
      target: 'node-approve', // String，必须，目标点 id
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
    },
    {
      source: 'node-approve', // String，必须，起始点 id
      target: 'node-end', // String，必须，目标点 id
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
    },
    {
      source: 'node-end', // String，必须，起始点 id
      target: 'node-approve', // String，必须，目标点 id
      label: '不合格', // 边的文本
      type: 'polyline',
      controlPoints: [{ x: 200, y: 300 }, { x: 200, y: 200 }],
      style: {
        endArrow: {
          path: G6.Arrow.triangle(10, 10, 2),
          d: 2,
          fill: '#FCAD22ad',
          stroke: '#FCAD22ad'
        }
      },
      fill: '#18c298ad',
      stroke: '#18c298'
    }
  ]
}

const nodeW = 200
const nodeH = 150
let template = {
  id: 0,
  groupId: 0,
  title: ""
}

onMounted(async () => {
  if (template.groupId) {
    await getData()
  }

  makeChartData()
  setupChart()
})

const getData = async () => {
  const params = {
    groupId: template.groupId
  }
  template = await ApiUtil.template_detail(params)
}

const makeChartData = () => {
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
      "nextSteps": []
    }
  }

  step2chartData(template.rootStep)
}

const step2chartData = (step) => {
  if (!step || !step.id)
    return

  let startNode = {
    id: step.id + '', // String，该节点存在则必须，节点的唯一标识
    x: nodeW, // Number，可选，节点位置的 x 值
    y: nodeH * (step.level - 1), // Number，可选，节点位置的 y 值
    // type: 'rect', // 矩形节点
    label: '申请', // 矩形节点框内的文字
    description: 'ant_type_name_...',
    color: '#2196f3',
    meta: {
      creatorName: 'a_creator',
    },
    type: 'rect-jsx',
    // 矩形节点框样式
    style: {
      fill: '#FFFFFF',
      stroke: '#4A94FF66',
      lineWidth: 1,
      radius: 4
    },
    // anchorPoints: [
    //   [0.5, 0], [0.5, 1]
    // ]
  }
  chartData.nodes.push(startNode)

  let endNode = {
    id: '9999', // String，该节点存在则必须，节点的唯一标识
    x: nodeW, // Number，可选，节点位置的 x 值
    y: nodeH, // Number，可选，节点位置的 y 值
    // type: 'rect', // 矩形节点
    label: '结束', // 矩形节点框内的文字
    description: 'ant_type_name_...',
    color: '#2196f3',
    meta: {
      creatorName: 'a_creator',
    },
    type: 'rect-jsx',
    // 矩形节点框样式
    style: {
      fill: '#FFFFFF',
      stroke: '#4A94FF66',
      lineWidth: 1,
      radius: 4
    },
    // anchorPoints: [
    //   [0.5, 0], [0.5, 1]
    // ]
  }
  chartData.nodes.push(endNode)

  let edge = {
    source: startNode.id, // String，必须，起始点 id
    target: endNode.id, // String，必须，目标点 id
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

  if (!step.nextSteps || step.nextSteps.length < 1)
    return

  step.nextSteps.forEach(item => {
    step2chartData(item)
  })
}

const setupChart = () => {
  const container = document.getElementById('mountNode')

  const width = container.scrollWidth
  const height = container.scrollHeight


  G6.registerNode(
    'rect-jsx',
    (cfg) => `
    <group>
      <rect>
        <rect style={{
          width: 150,
          height: 20,
          fill: ${cfg.color},
          radius: [6, 6, 0, 0],
          cursor: 'move'，
          stroke: ${cfg.color}
        }} draggable="true">
          <text style={{
            marginTop: 2,
            marginLeft: 75,
            textAlign: 'center',
            fontWeight: 'bold',
            fill: '#fff' }}>{{label}}</text>
        </rect>
        <rect style={{
          width: 150,
          height: 55,
          stroke: ${cfg.color},
          fill: #ffffff,
          radius: [0, 0, 6, 6],
        }}>
          <text style={{ marginTop: 5, marginLeft: 3, fill: '#333', marginLeft: 4 }}>责任人: {{description}}</text>
        </rect>
      </rect>
      <circle style={{
        stroke: ${cfg.color},
        r: 10,
        fill: '#fff',
        marginLeft: 75,
        cursor: 'pointer'
      }} name="circle">
        <image style={{ img: 'https://www.bqdnao.com/faceroop-static/add.png', width: 12, height: 12,  marginLeft: 69,  marginTop: -5 }} />
      </circle>
    </group>`,
  );

  // const width = window.
  const graph = new G6.Graph({
    modes: {
      default: ['drag-canvas', 'zoom-canvas'], // 允许拖拽画布、放缩画布、拖拽节点
      nodeActive: ['hover', 'clickSelect']
    },
    container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    fitView: true, // 是否将图适配到画布大小，可以防止超出画布或留白太多。
    width: width, // Number，必须，图的宽度
    height: height, // Number，必须，图的高度
    size: [100, 1000],
    //////////////////////////////////////////////////////////////////////////
    // 交互状态 State
    //////////////////////////////////////////////////////////////////////////
    // 节点不同状态下的样式集合
    nodeStateStyles: {
      // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
      hover: {
        stroke: "#4A94FFff",
      },
      // 鼠标点击节点，即 click 状态为 true 时的样式
      click: {
        fill: "#eeeeeeFF",
      },
    }
  })
  G6.registerNode('diamond', {
    options: {
      style: {},
      stateStyles: {
        hover: {},
        selected: {}
      }
    },
    /**
     * 绘制节点，包含文本
     * @param  {Object} cfg 节点的配置项
     * @param  {G.Group} group 图形分组，节点中图形对象的容器
     * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
     * 关于 keyShape 可参考文档 核心概念-节点/边/Combo-图形 Shape 与 keyShape
     */
    draw(cfg, group) { },
    /**
 * 绘制后的附加操作，默认没有任何操作
 * @param  {Object} cfg 节点的配置项
 * @param  {G.Group} group 图形分组，节点中图形对象的容器
 */
    afterDraw(cfg, group) { },
    /**
 * 更新节点，包含文本
 * @override
 * @param  {Object} cfg 节点的配置项
 * @param  {Node} node 节点
 */
    update(cfg, node) { },
    /**
 * 更新节点后的操作，一般同 afterDraw 配合使用
 * @override
 * @param  {Object} cfg 节点的配置项
 * @param  {Node} node 节点
 */
    afterUpdate(cfg, node) { },
    /**
 * 响应节点的状态变化。
 * 在需要使用动画来响应状态变化时需要被复写，其他样式的响应参见下文提及的 [配置状态样式] 文档
 * @param  {String} name 状态名称
 * @param  {Object} value 状态值
 * @param  {Node} node 节点
 */
    setState(name, value, node) { },
    /**
 * 获取锚点（相关边的连入点）
 * @param  {Object} cfg 节点的配置项
 * @return {Array|null} 锚点（相关边的连入点）的数组,如果为 null，则没有控制点
 */
    getAnchorPoints(cfg) { }
  },
    // 继承内置节点类型的名字，例如基类 'single-node'，或 'circle', 'rect' 等
    // 当不指定该参数则代表不继承任何内置节点类型
    'single-node', // 基于 single-node 为例进行扩展
  )

  //////////////////////////////////////////////////////////////////////////
  // 监听事件并切换元素状态
  //////////////////////////////////////////////////////////////////////////
  // 鼠标进入节点
  graph.on("node:mouseenter", (e) => {
    const nodeItem = e.item; // 获取鼠标进入的节点元素对象
    graph.setItemState(nodeItem, "hover", true); // 设置当前节点的 hover 状态为 true
  })

  // 鼠标离开节点
  graph.on("node:mouseleave", (e) => {
    const nodeItem = e.item; // 获取鼠标离开的节点元素对象
    graph.setItemState(nodeItem, "hover", false); // 设置当前节点的 hover 状态为 false
  })

  // 点击节点
  graph.on("node:click", (e) => {
    // 先将所有当前是 click 状态的节点置为非 click 状态
    const clickNodes = graph.findAllByState("node", "click");
    console.log("Bowen: mounted -> clickNodes", clickNodes)
    clickNodes.forEach((cn) => {
      graph.setItemState(cn, "click", false);
    });
    const nodeItem = e.item; // 获取被点击的节点元素对象
    graph.setItemState(nodeItem, "click", true); // 设置当前节点的 click 状态为 true

    selectTask(nodeItem)
  })

  graph.data(chartData) // 读取 Step 2 中的数据源到图上

  graph.render() // 渲染图

}

const onClose = () => {
  isShowDrawer.value = false
}

const selectTask = (item) => {
  console.log(item)

  isShowDrawer.value = true
}
</script>

<style scoped>
#mountNode {
  width: 100%;
  height: 100vh;
}
</style>

