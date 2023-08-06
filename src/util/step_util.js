export function getMaxStepId(rootStep){
    if(!rootStep || !rootStep.id)
        return 0

    if(!rootStep.nextSteps || rootStep.nextSteps.length<1)
        return rootStep.id

    let nextMaxId = 0
    rootStep.nextSteps.forEach(element => {
        if(element.category!='end'){
            let childMaxId=getMaxStepId(element)
            nextMaxId = Math.max(nextMaxId, childMaxId)
        }
    })

    return Math.max(rootStep.id, nextMaxId)
}