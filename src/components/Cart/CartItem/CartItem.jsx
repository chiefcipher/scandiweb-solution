import React from "react";
import { ReactComponent as ChevronLeft } from "./chevron.svg";
import classNames from "./CartItem.module.scss";
import { connect } from "react-redux";
import * as actionCreators from "../../../store/actionCreators";
class CartItem extends React.PureComponent {
  state = {
    galleryIndex: 0,
  };
  changeGalleryIndex = (method, length) => {
    switch (method) {
      case "increase":
        if (this.state.galleryIndex < length - 1)
          this.setState({ galleryIndex: this.state.galleryIndex + 1 });
        break;
      case "decrease":
        if (this.state.galleryIndex > 0)
          this.setState({ galleryIndex: this.state.galleryIndex - 1 });
        break;
      default:
        break;
    }
  };
  render() {
    const {
      name,
      brand,
      id: cartItemId,
      price,
      quantity,
      gallery,
      newAttributes,

      fromWhere,
      changeAttrName,
    } = this.props;

    const { galleryIndex } = this.state;

    const chevronDisplayStyle = {
      display: gallery.length < 2 || fromWhere !== "cart" ? "none" : "block",
    };

    return (
      <div
        className={
          fromWhere === "nav"
            ? `${classNames.item} ${classNames.fromNav}`
            : `${classNames.item}`
        }
      >
        <div className={classNames.detail}>
          <h1 className={classNames.name}>{name}</h1>
          <p className={classNames.brand}>{brand}</p>
          <p className={classNames.price}>
            {price.currency.symbol + " " + price.amount}
          </p>

          <div className={classNames.newAttributes}>
            {newAttributes.map(({ id, name, type, items }) => (
              <div className={classNames.new} key={id}>
                <h2>{name}</h2>
                {items.map(
                  ({ displayValue, id: itemId, value, isSelected }) => {
                    return (
                      <button
                        key={itemId}
                        onClick={() =>
                          changeAttrName({
                            attributeId: id,
                            itemId: itemId,
                            cartItemId,
                          })
                        }
                        style={{
                          background:
                            type === "swatch"
                              ? value
                              : isSelected
                              ? "#fff"
                              : "#000",
                          outline:
                            isSelected && type === "swatch"
                              ? "1px solid green"
                              : "none",
                          color:
                            type !== "swatch" && !isSelected ? "#fff" : "#000",
                        }}
                      >
                        {type !== "swatch" ? displayValue : null}
                      </button>
                    );
                  }
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={classNames.cta}>
          <button className="increase" onClick={this.props.clickIncrease}>
            +
          </button>
          <p className={classNames.quantity}>{quantity}</p>
          <button className="decrease" onClick={this.props.clickDecrease}>
            -
          </button>
        </div>
        <div
          className={[
            classNames.img,
            fromWhere !== "cart" ? classNames.notCart : classNames.isCart,
          ].join(" ")}
        >
          <ChevronLeft
            style={chevronDisplayStyle}
            className={`${classNames.chevron} ${classNames.left}`}
            onClick={() => this.changeGalleryIndex("decrease", gallery.length)}
          />
          <img
            src={fromWhere === "cart" ? gallery[galleryIndex] : gallery[0]}
            alt={name + " Cart item"}
          />
          <ChevronLeft
            style={chevronDisplayStyle}
            className={`${classNames.chevron} ${classNames.right}`}
            onClick={() => this.changeGalleryIndex("increase", gallery.length)}
          />
        </div>
      </div>
    );
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    changeAttrName: (payload) =>
      dispatch(actionCreators.changeCartItemAttribute(payload)),
  };
};
export default connect(null, mapDispathToProps)(CartItem);
