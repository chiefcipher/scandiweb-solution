import React , {PureComponent} from 'react' ;
import {NavLink,Link} from 'react-router-dom'
import { connect } from 'react-redux';
import {ReactComponent as NavMidIcon } from './assets/a-logo.svg'
import {ReactComponent as CartIcon} from './assets/Empty-Cart.svg'
import {ReactComponent as Caret } from './assets/caret.svg'

import * as actionCreators from '../../store/actionCreators'
import { updateClass } from '../../shared/utils';

import {CartItem } from '../Cart/CartItem/CartItem'
import { LOAD_CURRENCIES } from '../../graphql/query';

class Navigation extends PureComponent { 
     state = { 
         toggleCurrency :  false  , 
         toggleCart : false ,

    };

    componentDidMount = ()=>{
        fetch("http://localhost:4000/graphql" , { 
            method :    "POST" ,
            headers : {
                'Content-Type' : 'application/json' ,
                'Accept' : 'application/json'
            },
            body : JSON.stringify({query : LOAD_CURRENCIES})
        }).then(response => response.json())
        .then(result =>  {
                this.props.setCurrencies(result.data)
        })
        .catch(e => this.props.catchNetworkError(e))
    }
    componentDidUpdate = ()=> { 
    }

    getTotal = (data , currency) => {   
        const total = data.map(item => (
            item.prices.find(dat => dat.currency.symbol === currency.symbol).amount * item.quantity
        )).reduce((init , current)=> init + current , 0)

        return total
    }

    currencyToggler = ()=> { 
        this.setState(prevState => ({
            toggleCurrency : !prevState.toggleCurrency 
        }))
    }

    cartToggler = ()=> { 
        this.props.toggleBackdrop()
        
    }
    render () {
        const { cart ,
                routes  ,
                changeDefaultCurrency, 
                currencies , 
                defaultCurrency } = this.props
        
        let NavigationItems = <h1>Loading</h1> ; 
            
        if (routes.length  > 0  ){
                NavigationItems = 
                    routes.map ((item , index) => (
                    <NavLink to={item} className='navigation__items--item' key={index} >
                        {item}
                    </NavLink> ))
            } ;
        return (
            <div className="navigation">
                <div className="navigation__items">
                    { NavigationItems  }
                </div>
    
                <div className='navigation__icon'>
                        <NavMidIcon /> 
                </div>
                <div className='navigation__ctas'>
                        <button onClick={this.currencyToggler}
                            className={updateClass('navigation__ctas--cta currency ' , 'active', this.state.toggleCurrency)}>
                            {defaultCurrency.symbol}
                            <Caret className='caret' /> 
                        </button>
                        
                        <button onClick={this.cartToggler}
                                className='navigation__ctas--cta cart '>
                            <div className='counter' style={{display : cart.length > 0 ? 'block' : 'none'}}>
                                {cart.length}
                            </div>
                            <CartIcon /> 

                        </button>
                   
                        
                        <div className={updateClass('items' , 'active' , this.props.showBackdrop)}>
                                <h1>My Bag, <span>{cart.length} items</span></h1>
                                {
                                    cart.map(
                                        ({brand , gallery , id , name , prices , quantity , newAttributes } , index) => {
                                            const price = prices.find( item => item.currency.symbol === defaultCurrency.symbol) ; 
                                            
                                           return  <CartItem 
                                            brand={brand}
                                            gallery={gallery}
                                            id={id} 
                                            name={name}
                                            price={price}
                                            quantity={quantity}
                                            fromWhere={'nav'}
                                            newAttributes={newAttributes}
                                            key={index} 

                                            clickIncrease={()=> this.props.quantify({method :'increase' , id : id})}
                                            clickDecrease={()=> this.props.quantify({method: 'decrease' ,id :  id})}
                                            />
                                        }
                                    )
                                }

                                <div className='total'>
                                    <span>Total</span>
                                    <span>{defaultCurrency.symbol + " " +this.getTotal(cart , defaultCurrency).toFixed(2)} </span>
                                </div>
                                <div className='actions'>
                                    <Link to="/cart" onClick={this.cartToggler}>VIEW BAG</Link>
                                    <Link to='/#'>CHECK OUT</Link>
                                </div>
                            </div>

                        <div className={updateClass('select-currency', 'active', this.state.toggleCurrency)}>
                                {
                                    currencies.map (({symbol , label }, i) => 
                                    <button key={i} onClick={ ()=> {this.currencyToggler() ; return changeDefaultCurrency({ symbol : symbol , label : label})} }> 
                                        {symbol + " "+  label } 
                                    </button>)
                                }
                        </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps= state => {
    return { 
        cart  : state.cart , 
        showBackdrop : state.showBackdrop , 

        routes : state.routes , 
        currencies : state.currencies , 
        defaultCurrency : state.defaultCurrency 
    }
}

const mapDispatchToProps = dispatch => { 
    return { 
        quantify : payload=>dispatch(actionCreators.quantifyCartItem(payload)),
        toggleBackdrop : () => dispatch(actionCreators.toggleBackdrop()) , 
        setCurrencies : (data)=>dispatch(actionCreators.setCurrencies(data)) , 
        changeDefaultCurrency : (data)=>dispatch(actionCreators.changeDefaultCurrency(data)) , 
        catchNetworkError : (e)=> dispatch(actionCreators.setNetworkError(e))
    }
}
export default connect(mapStateToProps , mapDispatchToProps)(Navigation)

