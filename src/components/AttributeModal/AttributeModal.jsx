import React from 'react' ;
import cNames from './AttributeModal.module.scss' ;
import {connect} from 'react-redux' ; 
import * as actionCreators from '../../store/actionCreators' ; 

class SelectAttribute extends React.PureComponent{ 
    //TODO 
    //CLEAN UP 
    render(){
        const {
            attributes, 
            setAttribute
        } = this.props

        return <div className={cNames.container}>
            <div className={cNames.content}>
                    <h1>Please select attributes for your item </h1>
                    {
                    attributes.map( ({name , items , type , id } , index) => (

                            <div className={cNames.attribute} key={index}>
                                <div className={cNames.name}>{name}</div> 
                                <div className={cNames.btns}>
                                    { 
                                        items.map(({displayValue , value , id:itemId , isSelected } , index) => {
                                            const attributePayload = {
                                                attributeData : {id , name , type  , items } ,
                                                setItemId : itemId 
                                            }

                                            return <button 
                                                key={itemId} 
                                                style={{ 
                                                    background : type === 'swatch' ? value : 'initial' , 
                                                    boxShadow : isSelected === true ? '0 0 5px black' : 'none' , 
                                                     }}
                                                onClick={() => setAttribute(attributePayload)}>
                                                {displayValue}
                                            </button>
                                    })
                                    }
                                </div>
                            </div> 
                        ))
                    } 
                        <button className={cNames.addToCart} onClick={()=> this.props.addToCart()}>
                        add to cart 
                    </button>          
            </div>
        </div>
    }
}

const mapStateToProps= state => { 
    return { 
        attributes : state.pdp.attributes
    }
}
const mapDispathToProps = dispatch => { 
    return { 
        setAttribute :  payload => dispatch(actionCreators.setAttributes(payload)),
        addToCart : ()=>dispatch(actionCreators.addToCart()) , 

    }
}
export default connect(mapStateToProps, mapDispathToProps)(SelectAttribute)