<template>
  <div id="mountNode"></div>
</template>

<script setup>
import G6 from '@antv/g6'
import { onMounted } from 'vue';

const data = {
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
        [0.5, 0.5]
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
        [0.5, 0],[0.5,0.5]
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
        [0.5, 0],[0.5,0.5]
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
      controlPoints: [{ x: 200, y: 300 },{ x: 200, y: 200 }],
      style: {
        endArrow: {
          path: G6.Arrow.triangle(10, 10, 18),
          d: -18,
          fill: '#18c298ad',
          stroke: '#18c298'
        }
      },
      fill: '#18c298ad',
      stroke: '#18c298'
    }
  ]
}

onMounted(() => {
  getView()
})

const getView = () => {
  const container = document.getElementById('mountNode')

  const width = container.scrollWidth
  const height = container.scrollHeight
  // const width = window.
  const graph = new G6.Graph({
    modes: {
      default: ['drag-canvas', 'zoom-canvas'] // 允许拖拽画布、放缩画布、拖拽节点
    },
    container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    fitView: true, // 是否将图适配到画布大小，可以防止超出画布或留白太多。
    width: width, // Number，必须，图的宽度
    height: height, // Number，必须，图的高度
    size: [100, 1000]
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
  // 动态设置节点样式
  // graph.node((node) => {
  //   console.log(node)
  //   return {
  //     id: node.id,
  //     type: 'rect',
  //     style: {
  //       fill: 'blue'
  //     }
  //   }
  // })
  graph.data(data) // 读取 Step 2 中的数据源到图上
  // 给节点下方展示额外的文字
  graph.on('afterrender', () => {
    graph.getNodes().forEach(node => {
      const { extraText, text1 } = node.getModel()
      const bbox = node.getBBox()
      const centerX = bbox.minX + bbox.width / 2
      const centerY = bbox.minY + bbox.height / 2
      const textGroup = graph.get('group').addGroup()
      const texta = textGroup.addShape('text', {
        attrs: {
          text: text1,
          x: centerX,
          y: centerY + 45,
          textAlign: 'center',
          textBaseline: 'middle',
          type: 'rect',
          fill: '#000',
          cursor: 'pointer',
          fontSize: 12
        }
      })
      textGroup.addShape('text', {
        attrs: {
          text: extraText,
          x: centerX,
          y: centerY + 25,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: '#000',
          fontSize: 12
        }
      })
      // 添加边框
      const bbox1 = texta.getBBox()
      if (bbox1.height !== 0) {
        textGroup.addShape('rect', {
          attrs: {
            x: bbox1.x - 4,
            y: bbox1.y - 4,
            width: bbox1.width + 10,
            height: bbox1.height + 8,
            stroke: '#000',
            lineWidth: 2,
            cursor: 'pointer',
            radius: 7
          }
        })
      }
      // 指定文字的点击事件
      texta.on('click', () => {
        // 处理点击事件的逻辑
        console.log('Label clicked!')
      })
    })
  })
  graph.render() // 渲染图
}
</script>

<style>
#mountNode {
  width: 100%;
  height: 500px;
}
</style>

