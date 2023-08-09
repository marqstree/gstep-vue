import G6 from '@antv/g6'
import { fittingString } from '@/util/str_util'

export default class VM {
    static nodeW = 120
    static nodeH = 50
    static spaceH = 30
    static addR = 10
    static endH = 30
    static branchW = 80
    static branchH = 30

    static addStepH = 30
    static addConditionH = 30

    static BG_PRIMARY_COLOR = "#2196f3ff"
    static BG_END_COLOR = "#aaa"
    static BG_HOVER_COLOR = "#2196f3aa"
    static FONT_PRIMARY_COLOR = "#333333"
    static FONT_HOVER_COLOR = "#999999"
    static END_STEP_ID = 9999

    static chartData = {}
    static template = {
        id: 0,
        groupId: 0,
        title: ""
    }

    static END_STEP = {
        "id": VM.END_STEP_ID,
        "title": "结束",
        "category": "end",
        "level": 2,
        "form": {},
        "branchSteps": [],
        "nextStep": {}
    }

    // 查询入库流程图数据
    static async getData() {
        const params = {
            groupId: template.groupId
        }
        template = await ApiUtil.template_detail(params)
    }

    // 添加分支步骤
    static newBranchStep(parentStep) {
        let oldNextStep = VM.copyNextStepWithoutEndStep(parentStep)

        let branchStep = {
            "id": VM.newStepId(),
            "title": "",
            "category": "branch",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": parentStep.nextStep
        }
        parentStep.nextStep = branchStep

        let firstConditionStep = {
            "id": branchStep.id + 1,
            "title": "条件1",
            "category": "condition",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": {}
        }
        branchStep.branchSteps = []
        branchStep.branchSteps.push(firstConditionStep)

        let defaultConditionStep = {
            "id": branchStep.id + 2,
            "title": '默认条件',
            "category": "condition",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": oldNextStep
        }
        branchStep.branchSteps.push(defaultConditionStep)
    }

    // 添加分支步骤
    static newAuditStep(parentStep) {
        let auditStep = {
            "id": VM.newStepId(),
            "title": "审核",
            "category": "audit",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": parentStep.nextStep
        }
        parentStep.nextStep = auditStep
    }

    // 添加分支步骤
    static newNotifyStep(parentStep) {
        let notifyStep = {
            "id": VM.newStepId(),
            "title": "抄送",
            "category": "notify",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": parentStep.nextStep
        }
        parentStep.nextStep = notifyStep
    }

    // 添加条件步骤
    static addConditionStep(parentStep) {
        let title = '条件' + parentStep.branchSteps.length

        let conditionStep = {
            "id": VM.newStepId(),
            "title": title,
            "category": "condition",
            "level": parentStep.level + 1,
            "form": {},
            "branchSteps": [],
            "nextStep": {}
        }
        parentStep.branchSteps.splice(parentStep.branchSteps.length - 1, 0, conditionStep)
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
        console.log(VM.template.rootStep)

        VM.refreshChartData()
    }

    static deleteChildStepById(stepId, startStep) {
        if (null == startStep)
            return

        if(!startStep.id)
            return            

        //删除
        if (startStep.nextStep.id == stepId) {
            startStep.nextStep = startStep.nextStep.nextStep
        }

        //若为条件节点,删除条件节点及其子节点
        let findIndex = -1
        for (var i = 0; i < startStep.branchSteps.length; i++) {
            if (startStep.branchSteps[i].id == stepId) {
                findIndex = i
                break
            }
        }
        if (findIndex >= 0)
            startStep.branchSteps.splice(findIndex, 1)

        //只剩一个默认条件节点时,删除默认条件节点
        if (startStep.category == 'branch' && startStep.branchSteps.length <= 1) {
            let parentStep = VM.findParentStep(startStep)
            startStep.branchSteps = []
            parentStep.nextStep = startStep.nextStep
        }

        if (startStep.nextStep.id)
            VM.deleteChildStepById(stepId, startStep.nextStep)

        for (var i = 0; i < startStep.branchSteps.length; i++) {
            VM.deleteChildStepById(stepId, startStep.branchSteps[i])
        }
    }

    static copyNextStepWithoutEndStep(step) {
        let oldNextStep = JSON.parse(JSON.stringify(step.nextStep))
        if (VM.END_STEP_ID == oldNextStep.id 
            || !step.id) {
            return {}
        }

        VM.deleteChildStepById(VM.END_STEP_ID, oldNextStep)
        return oldNextStep
    }

    //刷新图表节点,连线列表
    static refreshChartData() {
        VM.chartData = {
            nodes: [],
            edges: []
        }
        VM.formatStep(VM.template.rootStep)
        VM.step2chartData(VM.template.rootStep, null)
        console.log(VM.chartData)
    }

    // 创建新流程模板
    static newTemplate() {
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
                "nextStep": VM.END_STEP
            }
        }

        VM.formatStep(VM.template.rootStep)
        VM.chartData = {
            nodes: [],
            edges: []
        }
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
            return prevNode

        // 添加新的节点
        let lastNode = null
        let stepNode = {}
        if (step.category == 'start') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                step: step,
                type: 'start'
            }
        }
        else if (step.category == 'end') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                type: 'end',
                step: step
            }
        } else if (step.category == 'branch') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                type: 'branch',
                step: step
            }
        } else if (step.category == 'condition') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                type: 'condition',
                step: step
            }
        } else if (step.category == 'audit') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                type: 'audit',
                step: step
            }
        } else if (step.category == 'notify') {
            stepNode = {
                id: step.id + '', // String，该节点存在则必须，节点的唯一标识
                type: 'notify',
                step: step
            }
        }
        VM.chartData.nodes.push(stepNode)
        lastNode = stepNode

        // 与上一个节点的连线
        if (prevNode) {
            let parentEdge = {
                source: prevNode.id, // String，必须，起始点 id
                target: stepNode.id, // String，必须，目标点 id
                label: '', // 边的文本
                style: {
                    endArrow: {
                        path: G6.Arrow.triangle(),
                        stroke: "#F6BD16",
                        fill: "#F6BD16"
                    },
                }
            }
            VM.chartData.edges.push(parentEdge)
        }

        //非终点,分支节点,增加节点与加号连线
        if (step.category != 'end' && step.category != 'branch') {
            //加号节点
            let addStepNode = {
                id: step.id + '_add_step', // String，该节点存在则必须，节点的唯一标识
                step: step,
                type: 'add-child'
            }
            VM.chartData.nodes.push(addStepNode)
            lastNode = addStepNode
            //步骤与加号连线
            let addStepEdge = {
                source: stepNode.id, // String，必须，起始点 id
                target: addStepNode.id, // String，必须，目标点 id
                label: '', // 边的文本
            }
            VM.chartData.edges.push(addStepEdge)
        }

        //生成分支节点树
        let branchAddNodes = []
        for (var i = 0; i < step.branchSteps.length; i++) {
            let branchLastNode = VM.step2chartData(step.branchSteps[i], lastNode)
            branchAddNodes.push(branchLastNode)
        }

        //下一步
        if (step.branchSteps.length > 0) {
            //加号节点
            let addReduceNode = {
                id: step.id + '_add_reduce', // String，该节点存在则必须，节点的唯一标识
                x: 0, // Number，可选，节点位置的 x 值
                y: 0, // Number，可选，节点位置的 y 值
                step: step,
                type: 'add-child'
            }
            VM.chartData.nodes.push(addReduceNode)
            lastNode = addReduceNode

            for (var j = 0; j < branchAddNodes.length; j++) {
                let addReduceEdge = {
                    source: branchAddNodes[j].id, // String，必须，起始点 id
                    target: addReduceNode.id, // String，必须，目标点 id
                    label: '', // 边的文本
                }
                VM.chartData.edges.push(addReduceEdge)
            }
        }

        lastNode = VM.step2chartData(step.nextStep, lastNode)

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
            && rootStep.nextStep.id) {
            nextMaxId = Math.max(nextMaxId, rootStep.nextStep.id)
            nextMaxId = Math.max(nextMaxId, VM.getMaxStepId(rootStep.nextStep))
        }
        return nextMaxId
    }

    //查找父步骤
    static findParentStep(targetStep, startStep) {
        if (startStep == null)
            startStep = VM.template.rootStep

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

        if (startStep.nextStep.id) {
            let step = VM.findParentStep(targetStep, startStep.nextStep)
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

    // 查询步骤的兄弟节点个数
    static getSiblingCount(step) {
        let parentStep = VM.findParentStep(step, VM.template.rootStep)
        if (null == parentStep)
            return 0

        return parentStep.branchSteps.length
    }

    //查询步骤在兄弟节点中的排名
    static getSiblingIndex(step) {
        let parentStep = VM.findParentStep(step, VM.template.rootStep)
        if (null == parentStep)
            return 0

        for (var i = 0; i < parentStep.branchSteps.length; i++) {
            if (parentStep.branchSteps[i].id == step.id)
                return i
        }

        return 0
    }
}