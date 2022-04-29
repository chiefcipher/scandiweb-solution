
import { updateObject, resetObject , destructObject } from '../shared/utils'
import * as actionTypes from './actions'


const initState = {
    routes : [] , 
    currencies  : [] ,
    defaultCurrency : {
        label : 'USD', 
        symbol : '$'
    },
    pdp : {
        gallery : [] , 
        name : "" , 
        brand : "" , 
        description : "" , 
        id : "" ,
        prices : "" ,
        attributes : [] , 
        newAttributes : [], 
        canBeSeen : false  ,
        hasUnselectedAttribute : false , 
        showAttributeModal : false 
        
    }, 
    redirectTo : false , 
    cart : [], 
    showBackdrop  : false , 
    hasNetworkError : {
        status  : false , 
        error : null 
    }

}


const populateData = (state , action ) => { 
    return updateObject( state , {
        routes : action.payload.routes ,   
        categories : [...action.payload.categories]
    }) 
}


const addPdpInit = (state , action )=> { 
    const data = destructObject(action.data ,['gallery' , 'name' , 'brand' , 'description' , 'attributes' , 'prices' , 'id' ]) ; 
    return updateObject(state , {
       pdp : updateObject(state.pdp , { 
              ...data,
               canBeSeen : true 
       })
   }) 
}

const redirectTo = (state , action ) => { 
    return updateObject(state, { 
        redirectTo : action.route, 
       
    })
}

const setRedirect = (state , action )=> {
    return updateObject(state, { 
        redirectTo : false , 
    
    })

}

const addToCartAttributeError = (state , action )=> { 
    return updateObject(state , {
        pdp : updateObject(state.pdp , { 
            hasUnselectedAttribute : true 
        })
    } )
}


const addCart = (state , action )=> { 
            const data = destructObject(state.pdp , ['gallery', 'name' , 'id' , 'brand' , 'description' , 'newAttributes' , 'prices' ]) ; 
            const findMatches = state.cart.filter(cartItem => cartItem.id.split('-added-')[0] === data.id )
                if (findMatches.length > 0 ){ 
                    data.id = data.id + '-added-' + findMatches.length ; 
                }
            return updateObject(state ,{
            cart : state.cart.concat({
                ...data,
                prices : state.pdp.prices   ,
                quantity : 1  ,
            }),
            pdp : resetObject({...state.pdp , showAttributeModal : true}) 
        })
}



const quantifyCart = (state , action )=> { 
            const cart = [...state.cart ]
            const cartItemIndex = cart.findIndex( item => item.id ===action.id ) 
            if (action.method === 'increase'){ 
                cart[cartItemIndex].quantity += 1 
            }

            if (action.method === 'decrease'){ 
                if(cart[cartItemIndex].quantity === 1) {
                    cart.splice(cartItemIndex,1)
                }
                else {
                    cart[cartItemIndex].quantity -= 1 

                }
                    
            }
            
            return updateObject(state , {
                cart : cart
            })
}


const setAttributes = (state , action ) => { 
    const {id , name , type  ,  }  = action.payload.attributeData ; 
            const {setItemId} = action.payload
            const isAdded = state.pdp.newAttributes.find(item => item.id === id)
    

            const stateAttribute = [...state.pdp.attributes] 
            const workingAttribute = stateAttribute.find(item => item.id === id)
            const workingAttributeIndex = stateAttribute.findIndex(item => item.id === id)
            const workingItems = [...workingAttribute.items].map( item => ({
                    ...item  , 
                    isSelected : false })) ;
            const workingItem = workingItems.find(item => item.id === setItemId)
            const workingItemIndex = workingItems.findIndex(item => item.id === setItemId)
            

            workingItems[workingItemIndex] ={
                ...workingItem , 
                isSelected : true  
            }
            workingAttribute.items = workingItems ; 

            stateAttribute[workingAttributeIndex] = workingAttribute
            
            if (isAdded === undefined ){ 
                const updatedAttribute = {id , name , type , items : [...workingItems]}
                
                return updateObject(state , {
                    pdp : updateObject(state.pdp , {
                        attributes : stateAttribute , 
                        newAttributes : state.pdp.newAttributes.concat({
                            ...updatedAttribute
                        })
                    })
                })
                
            } else {
                const newAttributes = [...state.pdp.newAttributes]
                const existingItemIndex =  state.pdp.newAttributes.findIndex(item => item.id === id)
                newAttributes[existingItemIndex] = {
                    id , name , type , items : [...workingItems]
                }
               
                return updateObject(state , {
                    pdp : updateObject(state.pdp , {
                        attributes : stateAttribute , 
                        newAttributes : newAttributes
                    })
                })

            }
}


const changeDefaultCurrency = (state , action )=> { 
    return updateObject(state, {
        defaultCurrency : {
            ...action.data 
        }
    })

}

const showSelectAttributeModal= (state , action )=> { 
    return updateObject(state , {
        pdp : updateObject(state.pdp , { 
            showAttributeModal : true 
        })
    })
}

const setNetworkError = (state , action) => { 
    return updateObject(state , { 
        hasNetworkError : {
            status : true , 
            error : action.error
        }
    })
}


export const reducer = (state = initState , action ) => { 
    switch(action.type) {
        case actionTypes.POPULATE_DATA : {
            return populateData(state , action)
        }
        case actionTypes.SET_NETWORK_ERROR : { 
            return setNetworkError(state , action)
        }
        case actionTypes.ADD_PDP_INIT : {
            return addPdpInit(state , action)            
        }
        case actionTypes.REDIRECT_TO:  {
            return redirectTo(state , action)
        }
        case actionTypes.RESET_REDIRECT:  {
            return setRedirect(state  , action )    
        }
        case actionTypes.ADD_TO_CART_ATTRIBUTE_ERROR : {
            return addToCartAttributeError(state, action)
        }
        case actionTypes.ADD_TO_CART :{ 
            return addCart(state , action)
        }
        case actionTypes.QUANTIFY_CART_ITEM : {
            return quantifyCart(state , action )
        }
        case actionTypes.TOGGLE_BACKDROP : {
            return updateObject(state , {
                showBackdrop : !state.showBackdrop
            })
        }
        case actionTypes.SET_CURRENCIES : { 
            return updateObject(state , {
                currencies : action.currencyData
            })
        }
        case actionTypes.SHOW_SELECT_ATTRIBUTE_MODAL : { 
            return showSelectAttributeModal(state , action)
        }
        case actionTypes.SET_ATTRIBUTES : {
            return setAttributes(state , action )    
        }
        case actionTypes.CHANGE_DEFAULT_CURRENCY : { 
            return changeDefaultCurrency(state , action )
        }
        default : return state 
    }
}

