import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import * as actionCreators from "../../store/actionCreators";
import { CategoryItem } from "./CategoryItem/CategoryItem";

import { LOAD_CATEGORY } from "../../graphql/query.js";

import cNames from "./Category.module.scss";

class Category extends PureComponent {
  componentDidMount() {
    this.makeNetworkRequest();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) this.makeNetworkRequest();
  }
  makeNetworkRequest = () => {
    const { show, setCategory } = this.props;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: LOAD_CATEGORY(show),
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const { name, products } = result.data.category;
        setCategory({ name, products });
      })
      .catch((e) => console.log(e));
  };
  render() {
    const { redirect } = this.props;
    if (redirect === "/pdp") {
      return <Navigate to={redirect} replace />;
    }

    const { category, defaultCurrency, addPdp } = this.props;

    const content =
      category.name !== null && category.products !== null ? (
        <div className={cNames.category}>
          <h1 className={cNames.heading}>{category.name}</h1>
          <div className={cNames.contents}>
            {category.products.map(
              ({
                name,
                gallery,
                prices,
                brand,
                description,
                attributes,
                inStock,
                id,
              }) => {
                const price = prices.find(
                  (item) => item.currency.symbol === defaultCurrency.symbol
                );
                const clickData = {
                  gallery,
                  name,
                  brand,
                  description,
                  attributes,
                  prices,
                  id,
                };

                return (
                  <CategoryItem
                    src={gallery[0]}
                    name={name}
                    symbol={price.currency.symbol}
                    amount={price.amount}
                    inStock={inStock}
                    key={name}
                    click={() => addPdp(clickData)}
                    cartIconClick={() => addPdp(clickData, "CART_ICON")}
                  />
                );
              }
            )}
          </div>
        </div>
      ) : (
        <div> loading </div>
      );

    return content;
  }
}

const mapStateToProps = (state) => ({
  redirect: state.redirectTo,
  defaultCurrency: state.defaultCurrency,
  category: state.category,
});

const mapDispathToProps = (dispatch) => ({
  addPdp: (data, source) => dispatch(actionCreators.addPdp(data, source)),
  setCategory: (payload) => dispatch(actionCreators.setCategory(payload)),
});

export default connect(mapStateToProps, mapDispathToProps)(Category);
