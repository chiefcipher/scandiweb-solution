import React , {PureComponent} from "react"; 

import { connect } from "react-redux";
import * as actionCreators from '../../store/actionCreators' ; 
import { CartItem } from "./CartItem/CartItem";
import cNames from './cart.module.scss'


 class Cart extends PureComponent {

     componentDidMount(){

    }

    getSubTotal = (cart , currency) => {   
        const total = cart.map(item => (
            item.prices.find(dat => dat.currency.symbol === currency.symbol).amount * item.quantity
        )).reduce((init , current)=> init + current , 0)

        return total
    }

    getQuantity = (cart)=>{
        const quantity = cart.map(item => item.quantity).reduce((init , current)=> init + current , 0)
        return quantity
    }  
    
    getTax= (cart , currency )=>{
        const taxPercent = 0.05  ;
        const tax = this.getSubTotal(cart , currency) * taxPercent
        return tax
    }

    getTotal = (cart , currency) =>{ 
        const total = this.getSubTotal(cart , currency) + this.getTax(cart, currency)
        return total 
    }
    render (){
        const {cart , defaultCurrency} = this.props ; 

        return (
             <div className={cNames.cartPage}>
                 <h1 className={cNames.title}>
                     Cart
                 </h1>
                  {
                    cart.length === 0  ? <div> Empty cart, pls add items </div> : 
                  <>
                  <div className={cNames.content}>
                    {
                        cart.map( ({brand , gallery , id , name , prices , quantity , newAttributes } , index)=> {
                            const price = prices.find( item => item.currency.symbol === defaultCurrency.symbol) ; 
                                
                            return <CartItem
                                    key={index} 
                                    currency ={this.props.currency} 
                                    brand={brand}
                                    gallery={gallery}
                                    id={id} 
                                    name={name}
                                    price={price}
                                    quantity={quantity}
                                    newAttributes={newAttributes}
                                    fromWhere={'cart'}
                                    
                                    clickIncrease={()=> this.props.quantify({method :'increase' , id : id})}
                                    clickDecrease={()=> this.props.quantify({method: 'decrease' ,id :  id})}
                                    />
                        })
                    }

                    
                 </div> 
                <div className={cNames.footer}>
                    <div>
                        Tax: <span>{defaultCurrency.symbol + this.getTax(cart , defaultCurrency).toFixed(2)}</span>
                    </div>
                    <div>
                        Quantity: <span>{this.getQuantity(cart)}</span>
                    </div>
                    <div>
                        Total: <span>{ defaultCurrency.symbol + this.getTotal(cart , defaultCurrency).toFixed(2)}</span>
                    </div>
                    <button>
                        ORDER
                    </button>
                </div>
                </>
                }

             </div>
         )
     }
}




const mapStateToProps =state => {
    return {
        cart : state.cart,
        currency : state.currency , 
        defaultCurrency : state.defaultCurrency , 


    }
}


const mapDispatchToProps = dispatch => { 
    return { 
        quantify : payload=>dispatch(actionCreators.quantifyCartItem(payload)) ,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Cart)