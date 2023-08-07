import G6 from '@antv/g6'
import { fittingString } from '@/util/str_util'

export default class VM {

    static nodeW = 120
    static nodeH = 50
    static spaceH = 30
    static addR = 10
    static endH = 30
    static conditionH = 30

    static addStepH = 30
    static addConditionH = 30

    static BG_PRIMARY_COLOR = "#2196f3ff"
    static BG_END_COLOR = "#aaa"
    static BG_HOVER_COLOR = "#2196f3aa"
    static FONT_PRIMARY_COLOR = "#333333"
    static FONT_HOVER_COLOR = "#999999"

    static chartData = {}
    static template = {
        id: 0,
        groupId: 0,
        title: ""
    }

    // 查询入库流程图数据
    static async getData() {
        const params = {
            groupId: template.groupId
        }
        template = await ApiUtil.template_detail(params)
    }

    static NewConditionStep(parentStep) {
        let title = ''
        if (parentStep.branchSteps.length == 0)
            title = '条件1'
        else
            title = '条件' + parentStep.branchSteps.length

        let newStep = {
            "id": VM.newStepId(),
            "title": title,
            "category": "condition",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": {}
        }
        parentStep.branchSteps.push(newStep)

        if (parentStep.branchSteps.length == 1) {
            let defaultStep = {
                "id": VM.newStepId(),
                "title": '默认条件',
                "category": "condition",
                "level": parentStep.level + 1,
                "form": {},
                "branchSteps": [],
                "nextStep": {}
            }
            parentStep.branchSteps.push(defaultStep)
        }

        VM.refreshChartData()
    }

    static refreshChartData() {
        VM.chartData = {
            nodes: [],
            edges: []
        }
        VM.formatStep(VM.template.rootStep)
        VM.step2chartData(VM.template.rootStep, null)
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(VM.chartData)
    }

    // 创建新流程图数据
    static newChartData() {
        if (!VM.template.rootStep || !VM.template.rootStep.id) {
            VM.template.rootStep = {
                "id": 1,
                "title": "申请",
                "category": "start",
                "level": 1,
                "form": {},
                "candidates": [{
                    "id": "013645",
                    "name": "王凡"
                }, {
                    "id": "013645",
                    "name": "王凡"
                }],
                "branchSteps": [],
                "nextStep": {
                    "id": 9999,
                    "title": "结束",
                    "category": "end",
                    "level": 2,
                    "form": {},
                    "branchSteps": [],
                    "nextStep": {}
                }
            }
        }

        VM.formatStep(VM.template.rootStep)
        VM.chartData = {
            nodes: [],
            edges: []
        }
        VM.step2chartData(VM.template.rootStep, null)
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(VM.chartData)
        // VM.chartData = {
        //     "nodes": [
        //         {
        //             "id": "1",
        //             "x": 0,
        //             "y": 0,
        //             "detail": {
        //                 "id": 1,
        //                 "title": "申请",
        //                 "category": "start",
        //                 "level": 1,
        //                 "form": {},
        //                 "candidates": [
        //                     {
        //                         "id": "013645",
        //                         "name": "王凡"
        //                     },
        //                     {
        //                         "id": "013645",
        //                         "name": "王凡"
        //                     }
        //                 ],
        //                 "branchSteps": [],
        //                 "nextStep": {
        //                     "id": 9999,
        //                     "title": "结束",
        //                     "category": "end",
        //                     "level": 2,
        //                     "form": {},
        //                     "branchSteps": [],
        //                     "nextStep": {}
        //                 },
        //                 "candidatesText": "王凡,王凡"
        //             },
        //             "bg_color": "#2196f3ff",
        //             "font_color": "#333333",
        //             "type": "start",
        //             "anchorPoints": [
        //                 [
        //                     0.5,
        //                     0.5
        //                 ]
        //             ],
        //             "style": {}
        //         },
        //         {
        //             "id": "1_add_step",
        //             "x": 50,
        //             "y": 70,
        //             "step": {
        //                 "id": 1,
        //                 "title": "申请",
        //                 "category": "start",
        //                 "level": 1,
        //                 "form": {},
        //                 "candidates": [
        //                     {
        //                         "id": "013645",
        //                         "name": "王凡"
        //                     },
        //                     {
        //                         "id": "013645",
        //                         "name": "王凡"
        //                     }
        //                 ],
        //                 "branchSteps": [],
        //                 "nextStep": {
        //                     "id": 9999,
        //                     "title": "结束",
        //                     "category": "end",
        //                     "level": 2,
        //                     "form": {},
        //                     "branchSteps": [],
        //                     "nextStep": {}
        //                 },
        //                 "candidatesText": "王凡,王凡"
        //             },
        //             "type": "add-child",
        //             "anchorPoints": [
        //                 [
        //                     0.5,
        //                     0.5
        //                 ]
        //             ],
        //             "style": {}
        //         },
        //     ],
        //     "edges": [
        //     ]
        // }
    }

    //节点类型的高度
    static getNodeHeight(node) {
        if (node.type == 'start')
            return VM.nodeH
        else if (node.type == 'end')
            return VM.endH
        else if (node.type == 'add-child')
            return VM.addR * 2
        else if (node.type == 'add-condition')
            return VM.conditionH
        else
            return VM.nodeH
    }

    // 流程步骤转节点数据
    static step2chartData(step, prevNode) {
        if (!step || !step.id)
            return

        // 添加新的节点
        let lastNode = null
        let stepNode = {}
        let y = prevNode ? prevNode.y : 0
        if (null != prevNode)
            y = y + VM.getNodeHeight(prevNode) + VM.spaceH

        if (step.category == 'start') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                x: -VM.nodeW/2, // Number，可选，节点位置的 x 值
                y: y, // Number，可选，节点位置的 y 值
                // type: 'rect', // 矩形节点
                detail: step,
                type: 'start',
                anchorPoints: [
                    [0.5, 1]
                ]
            }
        }
        else if (step.category == 'end') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                x: -VM.nodeW/2, // Number，可选，节点位置的 x 值
                y: y, // Number，可选，节点位置的 y 值
                type: 'end',
                detail: step,
                anchorPoints: [
                    [0.5, 0]
                ]
            }
        } else if (step.category == 'condition') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                x: -(VM.getSiblingCount(step)*VM.nodeW / 2) + (VM.getSiblingIndex(step)*VM.nodeW) , // Number，可选，节点位置的 x 值
                y: y, // Number，可选，节点位置的 y 值
                type: 'condition',
                detail: step,
                anchorPoints: [
                    [0.5, 0], [0.5, 1]
                ]
            }
        }
        VM.chartData.nodes.push(stepNode)
        lastNode = stepNode

        // 与父节点的连线
        if (prevNode) {
            let parentEdge = {
                source: prevNode.id, // String，必须，起始点 id
                target: stepNode.id, // String，必须，目标点 id
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
            VM.chartData.edges.push(parentEdge)
        }

        if (step.category == 'end')
            return lastNode

        //加号节点
        let addx = 0
        if(step.category=='condition')
            addx=stepNode.x+VM.nodeW/2
        let addStepNode = {
            id: step.id + '_add_step', // String，该节点存在则必须，节点的唯一标识
            x: addx, // Number，可选，节点位置的 x 值
            y: y + VM.nodeH + VM.spaceH, // Number，可选，节点位置的 y 值
            step: step,
            type: 'add-child',
            anchorPoints: [
                [0.5, 0], [0.5, 1]
            ]
        }
        VM.chartData.nodes.push(addStepNode)
        lastNode = addStepNode
        let addStepEdge = {
            source: stepNode.id, // String，必须，起始点 id
            target: addStepNode.id, // String，必须，目标点 id
            label: '', // 边的文本
            style: {
                fill: '#99999966',
                stroke: '#99999966'
            }
        }
        VM.chartData.edges.push(addStepEdge)

        //添加条件节点
        if (step.branchSteps.length > 0) {
            let addConditionNode = {
                id: step.id + '_add_condition', // String，该节点存在则必须，节点的唯一标识
                x: -VM.nodeW/2, // Number，可选，节点位置的 x 值
                y: addStepNode.y + VM.addStepH + VM.spaceH, // Number，可选，节点位置的 y 值
                step: step,
                type: 'add-condition',
                anchorPoints: [
                    [0.5, 0], [0.5, 1]
                ]
            }
            VM.chartData.nodes.push(addConditionNode)
            lastNode = addConditionNode
            let addConditionEdge = {
                source: addStepNode.id, // String，必须，起始点 id
                target: addConditionNode.id, // String，必须，目标点 id
                label: '', // 边的文本
                style: {
                    fill: '#99999966',
                    stroke: '#99999966'
                }
            }
            VM.chartData.edges.push(addConditionEdge)
        }

        //生成分支节点树
        let branchAddNodes = []
        let maxBranchY = 0
        for (var i = 0; i < step.branchSteps.length; i++) {
            let branchLastNode = VM.step2chartData(step.branchSteps[i], lastNode)
            branchAddNodes.push(branchLastNode)
            maxBranchY = Math.max(branchLastNode.y, maxBranchY)
        }

        //下一步
        if (step.nextStep.id) {
            if (step.branchSteps.length > 0) {
                //加号节点
                let addReduceNode = {
                    id: step.id + '_add_reduce', // String，该节点存在则必须，节点的唯一标识
                    x: 0, // Number，可选，节点位置的 x 值
                    y: maxBranchY + VM.addStepH, // Number，可选，节点位置的 y 值
                    step: step,
                    type: 'add-child',
                    anchorPoints: [
                        [0.5, 0],[0.5,1]
                    ]
                }
                VM.chartData.nodes.push(addReduceNode)
                lastNode = addReduceNode

                for (var j = 0; j < branchAddNodes.length; j++) {
                    let addReduceEdge = {
                        source: branchAddNodes[j].id, // String，必须，起始点 id
                        target: addReduceNode.id, // String，必须，目标点 id
                        label: '', // 边的文本
                        style: {
                            fill: '#99999966',
                            stroke: '#99999966'
                        }
                    }
                    VM.chartData.edges.push(addReduceEdge)
                }
            }

            lastNode = VM.step2chartData(step.nextStep, lastNode)
        }

        return lastNode
    }

    // 格式化流程步骤数据
    static formatStep(step) {
        if (!step)
            return

        // 候选人文案
        step.candidatesText = ''
        if (step.candidates && step.candidates.length > 0) {
            let txt = step.candidates.map(e => e.name).join(',')
            // 文案最宽90px,字号14px
            step.candidatesText = fittingString(txt, 90, 14)
        }

        if (step.nextSteps && step.nextSteps.length > 0) {
            step.nextSteps.forEach(item => {
                VM.formatStep(item)
            })
        }
    }

    //生成下一个步骤id
    static newStepId() {
        let maxId = VM.getMaxStepId(VM.template.rootStep)
        return maxId + 1
    }

    //查询最大流程id
    static getMaxStepId(rootStep) {
        if (!rootStep || !rootStep.id)
            return 0

        let nextMaxId = rootStep.id
        rootStep.branchSteps.forEach(element => {
            if (element.category != 'end') {
                let childMaxId = VM.getMaxStepId(element)
                nextMaxId = Math.max(nextMaxId, childMaxId)
            }
        })

        if (rootStep.nextStep
            && rootStep.nextStep.category != 'end'
            && rootStep.nextStep.id)
            nextMaxId = Math.max(nextMaxId, rootStep.nextStep.id)

        return nextMaxId
    }

    //查找父步骤
    static findParentStep(targetStep, startStep) {
        if (startStep.nextStep.id == targetStep.id)
            return startStep

        for (var i = 0; i < startStep.branchSteps.length; i++) {
            if (startStep.branchSteps[i].id == targetStep.id)
                return startStep
        }

        for (var i = 0; i < startStep.branchSteps.length; i++) {
            let step = VM.findParentStep(targetStep, startStep.branchSteps[i])
            if (null != step)
                return step
        }

        return null
    }

    //查找分支最后一个步骤列表
    static findBranchLeafSteps(startStep) {
        for (var i = 0; i < startStep.branchSteps.length; i++) {
            if (startStep.branchSteps[i].id == targetStep.id)
                return startStep
        }

        for (var i = 0; i < startStep.branchSteps.length; i++) {
            let step = VM.findParentStep(targetStep, startStep.branchSteps[i])
            if (null != step)
                return step
        }

        return []
    }

    static getSiblingCount(step) {
        let parentStep = VM.findParentStep(step,VM.template.rootStep)
        if(null==parentStep)
            return 0

        return parentStep.branchSteps.length
    }

    static getSiblingIndex(step) {
        let parentStep = VM.findParentStep(step,VM.template.rootStep)
        if(null==parentStep)
            return 0

        for(var i=0;i<parentStep.branchSteps.length;i++){
            if(parentStep.branchSteps[i].id == step.id)
                return i 
        }

        return 0
    }
}