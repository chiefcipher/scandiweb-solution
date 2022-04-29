import React, {PureComponent} from "react";
import { connect } from "react-redux";

import * as actionCreators from '../../store/actionCreators';
import { Navigate } from "react-router";
import {CategoryItem} from './CategoryItem/CategoryItem' ; 

import cNames from "./Category.module.scss" ; 

export class Category extends PureComponent {


    render() { 
        if (this.props.redirect === '/pdp' ){ 
               return  <Navigate to={this.props.redirect} replace/>
        }
        
        const {show , categories , defaultCurrency} = this.props 
        const data = categories.find(category => category.name === show)
        

        return ( 
                
        <div className={cNames.category}>
            <h1 className={cNames.heading}>{data.name}</h1>
            <div className={cNames.contents}>
                {
                    data.products.map ( ({name , gallery , prices , brand , description  , attributes , inStock , id } , index) => {
                        const price = prices.find( item => item.currency.symbol === defaultCurrency.symbol) 
                        const clickData={ gallery , name  , brand , description , attributes , prices , id} 

                    return <CategoryItem 

                            src={gallery[0]}
                            name={name}
                            symbol={price.currency.symbol }
                            amount ={price.amount}
                            inStock={inStock}

                            key={index} 
                            
                            click={()=>  this.props.addPdp(clickData)}
                            cartIconClick={()=>  this.props.addPdp(clickData ,'CART_ICON')}
                            /> 
                    }) 
                }
           </div>

           
        </div>)
    }
}



const mapStateToProps = state => {
    return {
        redirect : state.redirectTo , 
        categories : state.categories , 
        defaultCurrency : state.defaultCurrency 
    }
}


const mapDispathToProps = dispatch => { 
    return { 
        addPdp : (data , source)=> dispatch(actionCreators.addPdp(data, source)),
    }
}

export default connect(mapStateToProps , mapDispathToProps )(Category)