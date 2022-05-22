import React from "react";
import HtmlParser from "html-react-parser";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import * as actionCreators from "../../store/actionCreators";
import { destructObject } from "../../shared/utility";

class PDP extends React.PureComponent {
  state = {
    galleryIndex: 0,
  };
  componentDidMount() {
    const { resetRedirect } = this.props;
    resetRedirect();
  }

  changeGalleryIndex = (index) => {
    if (index < 3 && index >= 0) {
      this.setState({ galleryIndex: index });
    }
  };
  render() {
    const { canBeSeen, addToCart } = this.props;
    if (!canBeSeen) return <Navigate to="/" />;
    const {
      gallery,
      name,
      brand,
      description,
      prices,
      attributes,
      defaultCurrency,
      setAttribute,
      hasUnselectedAttribute,
    } = this.props;
    const { galleryIndex } = this.state;
    const price = prices.find(
      (item) => item.currency.symbol === defaultCurrency.symbol
    );

    return (
      <div className="pdp">
        <div className="pdp__content">
          <div className="pdp__content--images">
            {gallery.map((item, index) =>
              index < 3 ? (
                <img
                  src={item}
                  key={item}
                  alt={name}
                  onClick={() => this.changeGalleryIndex(index)}
                />
              ) : null
            )}
          </div>

          <div className="pdp__content--image">
            <img src={gallery[galleryIndex]} alt={name} />
          </div>
          <div className="pdp__content--details  details">
            <h1 className="details__title">{name}</h1>
            <div className="details__secondary">{brand}</div>

            {attributes.map(({ attrName, items, type, id }) => (
              <div className="details__attribute" key={id}>
                <div className="details__attribute--name">{attrName}</div>
                <div className="details__attribute--btns">
                  {items.map(
                    ({ displayValue, value, id: itemId, isSelected }) => {
                      const attributePayload = {
                        attributeData: {
                          id,
                          name,
                          type,
                          items,
                        },
                        setItemId: itemId,
                      };

                      return (
                        <button
                          key={itemId}
                          type="button"
                          style={{
                            cursor: "pointer",
                            background: type === "swatch" ? value : "initial",
                            boxShadow:
                              isSelected === true ? "0 0 5px black" : "none",
                          }}
                          onClick={() => setAttribute(attributePayload)}
                        >
                          {displayValue}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
            <div className="details__price">
              <div className="details__price--text ">
                <div className="pdp-label">Price:</div>
                <span>{price.currency.symbol + price.amount.toFixed(2)}</span>
              </div>
            </div>
            {hasUnselectedAttribute ? (
              <h2 style={{ color: "#ff0000" }}>
                Kindly select options for all attributes displayed
              </h2>
            ) : null}
            <button
              className="details__button no-outline-border p-cursor"
              onClick={() => addToCart()}
              type="button"
            >
              add to cart
            </button>
            <div className="details__description">
              {" "}
              {HtmlParser(description)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = destructObject(state.pdp, [
    "name",
    "gallery",
    "brand",
    "description",
    "prices",
    "attributes",
    "hasUnselectedAttribute",
  ]);
  return {
    ...data,
    defaultCurrency: state.defaultCurrency,
    canBeSeen: state.pdp.canBeSeen,
    redirectTo: state.redirectTo,
  };
};

const mapDispathToProps = (dispatch) => ({
  resetRedirect: () => dispatch(actionCreators.resetRedirect()),
  setAttribute: (payload) => dispatch(actionCreators.setAttributes(payload)),
  addToCart: () => dispatch(actionCreators.addToCart()),
});

export default connect(mapStateToProps, mapDispathToProps)(PDP);
