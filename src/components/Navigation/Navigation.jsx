/* eslint-disable react/require-default-props */
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { ReactComponent as NavMidIcon } from "./assets/a-logo.svg";
import { ReactComponent as CartIcon } from "./assets/Empty-Cart.svg";
import { ReactComponent as Caret } from "./assets/caret.svg";
import * as actionCreators from "../../store/actionCreators";
import { updateClass } from "../../shared/utility";
import CartItem from "../Cart/CartItem/CartItem";
import { LOAD_CURRENCIES } from "../../graphql/query";

class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      toggleCurrency: false,
      toggleCart: false,
    };
  }

  componentDidMount() {
    const { setCurrencies, catchNetworkError } = this.props;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: LOAD_CURRENCIES }),
    })
      .then((response) => response.json())
      .then((result) => {
        setCurrencies(result.data);
      })
      .catch((e) => catchNetworkError(e));
  }

  // eslint-disable-next-line class-methods-use-this
  getTotal = (data, currency) => {
    const total = data
      .map(
        (item) =>
          item.prices.find((dat) => dat.currency.symbol === currency.symbol)
            .amount * item.quantity
      )
      .reduce((init, current) => init + current, 0);

    return total;
  };

  currencyToggler = () => {
    this.setState((prevState) => ({
      ...prevState,
      toggleCurrency: !prevState.toggleCurrency,
    }));
  };

  cartToggler = () => {
    const { toggleBackdrop } = this.props;
    toggleBackdrop();
  };
  counterValue = () => {
    const value = this.props.cart
      .map((el) => el.quantity)
      .reduce((a, b) => a + b, 0);
    return value;
  };

  render() {
    const {
      cart,
      routes,
      changeDefaultCurrency,
      currencies,
      defaultCurrency,
      showBackdrop,
      quantify,
    } = this.props;
    const { toggleCurrency } = this.state;
    let NavigationItems = <h1>Loading</h1>;

    if (routes.length > 0) {
      NavigationItems = routes.map((item) => (
        <NavLink to={item} className="navigation__items--item" key={item}>
          {item}
        </NavLink>
      ));
    }

    return (
      <div className="navigation">
        <div className="navigation__items">{NavigationItems}</div>

        <div className="navigation__icon">
          <NavMidIcon />
        </div>
        <div className="navigation__ctas">
          <button
            onClick={this.currencyToggler}
            type="button"
            className={updateClass(
              "navigation__ctas--cta currency ",
              "active",
              toggleCurrency
            )}
          >
            {defaultCurrency.symbol}
            <Caret className="caret" />
          </button>

          <button
            onClick={this.cartToggler}
            type="button"
            className="navigation__ctas--cta cart "
          >
            <div
              className="counter"
              style={{ display: this.counterValue() > 0 ? "block" : "none" }}
            >
              <span>{this.counterValue()} </span>
            </div>
            <CartIcon />
          </button>

          <div className={updateClass("items", "active", showBackdrop)}>
            <h1>
              My Bag <span>{cart.length} items</span>
            </h1>
            {cart.map(
              ({
                brand,
                gallery,
                id,
                name,
                prices,
                quantity,
                newAttributes,
              }) => {
                const price = prices.find(
                  (item) => item.currency.symbol === defaultCurrency.symbol
                );
                                                    
                return (
                  <CartItem
                    brand={brand}
                    gallery={gallery}
                    id={id}
                    name={name}
                    price={price}
                    quantity={quantity}
                    fromWhere="nav"
                    newAttributes={newAttributes}
                    key={id}
                    clickIncrease={() => quantify({ method: "increase", id })}
                    clickDecrease={() => quantify({ method: "decrease", id })}
                  />
                );
              }
            )}

            <div className="total">
              <span>Total</span>
              <span>
                {`${defaultCurrency.symbol} ${this.getTotal(
                  cart,
                  defaultCurrency
                ).toFixed(2)}`}
              </span>
            </div>
            <div className="actions">
              <Link to="/cart" onClick={this.cartToggler}>
                VIEW BAG
              </Link>
              <Link to="/#">CHECK OUT</Link>
            </div>
          </div>

          <div
            className={updateClass("select-currency", "active", toggleCurrency)}
          >
            {currencies.map(({ symbol, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  this.currencyToggler();
                  return changeDefaultCurrency({ symbol, label });
                }}
              >
                {`${symbol} ${label}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  showBackdrop: state.showBackdrop,

  routes: state.routes,
  currencies: state.currencies,
  defaultCurrency: state.defaultCurrency,
});

const mapDispatchToProps = (dispatch) => ({
  quantify: (payload) => dispatch(actionCreators.quantifyCartItem(payload)),
  toggleBackdrop: () => dispatch(actionCreators.toggleBackdrop()),
  setCurrencies: (data) => dispatch(actionCreators.setCurrencies(data)),
  changeDefaultCurrency: (data) =>
    dispatch(actionCreators.changeDefaultCurrency(data)),
  catchNetworkError: (e) => dispatch(actionCreators.setNetworkError(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
