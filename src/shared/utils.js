
export const updateObject = (currentObject , newValues) => {
    return {
        ...currentObject , 
        ...newValues
    }
}


export const updateClass = (currentClasses , newClassses , shouldUpdate) => {
    if (shouldUpdate){
         return [...currentClasses.split(" "),...newClassses.split(" ")].join(" ")
    } 
    else {
        return [...currentClasses.split(" ")].join(" ")
    }
}


export const resetObject = (object) => { 
    const newData = {} 

    for (let key in object) {

        if (typeof object[key] === "string" ){ 
            newData[key] = ""
        }
        else if (typeof object[key] === 'object' && Array.isArray(object[key]) ) {
             newData[key] = []
        }
        else if (typeof object[key] === 'object') {
            newData[key] = {}
        }
        else if (typeof object[key] === 'boolean') {
            newData[key] = !object[key]
        }
        else {
            console.log('might be a number, no check for that')
        }
    }
    return newData
}



/* DESTRUCTURE AN OBJECT AND RETURN A NEW OBJECT TO EVADE REPETITION OF CODE 
    EG const {gallery , name } = action.data 
    return updateObject(state.pdp , {
        gallery 
        name 
    })
*/
export const destructObject  = (initialObject = undefined , propertiesToDestructure=undefined) =>{
    if (initialObject === undefined || propertiesToDestructure === undefined){ 
        throw new Error('BOTH PARAMETERS MUST HAVE A VALUE')
    }
    const newData = {} ;    
    propertiesToDestructure.forEach ((item, index ) => { 
        if (initialObject.hasOwnProperty(item)){ 
            newData[item] = initialObject[item]
        }
        else {
            throw new Error(`Initial Object does not have the property you want to destructure, CHECK ${index} ${propertiesToDestructure[index]}`)
        }
    })        
    return newData
}



//LOGING WITH DESCRIPTION
export const log = (description , data) => { 
    console.log(`[${description}]`, data)
}

