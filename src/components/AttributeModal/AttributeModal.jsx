import React from "react";
import { connect } from "react-redux";
import cNames from "./AttributeModal.module.scss";
import * as actionCreators from "../../store/actionCreators";

class SelectAttribute extends React.PureComponent {
  render() {
    const { attributes, setAttribute, addToCart } = this.props;

    return (
      <div className={cNames.container}>
        <div className={cNames.content}>
          <h1>Please select attributes for your item </h1>
          {attributes.map(({ name, items, type, id }) => (
            <div className={cNames.attribute} key={name}>
              <div className={cNames.name}>{name}</div>
              <div className={cNames.btns}>
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
          <button
            type="button"
            className={cNames.addToCart}
            onClick={() => addToCart()}
          >
            add to cart
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  attributes: state.pdp.attributes,
});
const mapDispathToProps = (dispatch) => ({
  setAttribute: (payload) => dispatch(actionCreators.setAttributes(payload)),
  addToCart: () => dispatch(actionCreators.addToCart()),
});

export default connect(mapStateToProps, mapDispathToProps)(SelectAttribute);
