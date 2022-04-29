import {PureComponent} from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

import * as actionCreators from '../../store/actionCreators'
import {destructObject} from '../../shared/utils'

class PDP extends PureComponent { 
    componentDidMount (){ 
        this.props.resetRedirect()
    }
    render (){ 
        if (!this.props.canBeSeen && this.props.redirectTo === '/cart'){
            return <Navigate to='/cart' />
        } ; 
        if (!this.props.canBeSeen){
            return <Navigate to='/' />
        }
        const {gallery , 
               name  , 
               brand , 
               description , 
               prices ,
               attributes,
               defaultCurrency , 
               setAttribute ,
               hasUnselectedAttribute} = this.props ;
        
        const price = prices.find( item => item.currency.symbol === defaultCurrency.symbol) ; 

        return ( 
            <div className="pdp">
            <div className="pdp__content">
                <div className="pdp__content--images">
                    {
                        gallery.map((item , index) => 
                            index < 3 ? <img src={item} key={index} alt={this.props.name} /> : null  )
                    }
                    
                 </div>

                <div className="pdp__content--image">
                        <img src={gallery[0]}  alt={this.props.name} />
                </div>
                <div className="pdp__content--details  details">
                    <h1 className="details__title">
                        {name}
                    </h1>
                    <div className="details__secondary">
                        {brand}
                    </div>


                    {
                        attributes.map( ({name , items , type , id } , index) => (

                            <div className="details__attribute" key={index}>
                                <div className="details__attribute--name">{name}</div> 
                                <div className="details__attribute--btns">
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
                    <div className="details__price">
                        <div className="details__price--text ">
                            <div className="pdp-label">Price:</div> 
                            <span>
                                {
                                    price.currency.symbol + price.amount.toFixed(2) 
                                }
                            </span>
                        </div>

                    </div>
                    {hasUnselectedAttribute ? <h2 style={{color : '#ff0000'}}>
                            Kindly select options for all attributes displayed
                    </h2> : null }
                    <button className="details__button no-outline-border " onClick={()=> this.props.addToCart()}>
                        add to cart 
                    </button>
                    <div className="details__description" dangerouslySetInnerHTML={{__html : description}}/>
                </div>
            </div>

            </div>
        )
    }
}

const mapStateToProps = state  => {
    const data = destructObject(state.pdp , ['name' , 'gallery' , 'brand' , 'description' , 'prices' , 'attributes' , 'hasUnselectedAttribute'])

    return { 
       ...data, 
        defaultCurrency : state.defaultCurrency , 
        canBeSeen : state.pdp.canBeSeen,
        redirectTo : state.redirectTo , 


    }
}


const mapDispathToProps = dispatch => { 
    return {
        resetRedirect : ()=> dispatch(actionCreators.resetRedirect()) , 
        setAttribute :  payload => dispatch(actionCreators.setAttributes(payload)), 
        addToCart : ()=>dispatch(actionCreators.addToCart()) , 

    }
}


export default connect(mapStateToProps,mapDispathToProps)(PDP)