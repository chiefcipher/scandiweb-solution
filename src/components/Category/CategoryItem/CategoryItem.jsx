import React from 'react' ; 
import {ReactComponent as CartIcon} from './addToCart.svg'
import { updateClass } from "../../../shared/utils";
import cNames from './CategoryItem.module.scss' ; 


export class CategoryItem extends React.PureComponent { 
    
    render () { 
        const {click ,  name , symbol , amount , src , inStock , cartIconClick} = this.props

        return (
            <div className={updateClass(cNames.content , cNames.outOfStock , !inStock)} >
                <div className={cNames.image} onClick={inStock ? click : null }>
                    <img src={src} alt={name} />
                </div>
                <div className={cNames.name} onClick={inStock ? click : null }>
                    {name}
                </div>
                <div className={cNames.price} onClick={inStock ? click : null }>
                    {symbol+' ' +amount}
                </div>
                { !inStock  ? 
                  <div className={cNames.outOfStock}>Out of stock</div> : 
                  <CartIcon className={cNames.addToCart} onClick={cartIconClick} />}
            </div>
        )
    }
    
}