import React from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../store/actionCreators";
import cNames from "./Backdrop.module.scss";
class Backdrop extends React.PureComponent {
  render() {
    const { showBackdrop, toggleBackdrop } = this.props;
    return (
      <div
        className={cNames.backdrop}
        style={{ display: showBackdrop ? "block" : "none" }}
        role="button"
        aria-label="Show Backdrop"
        onClick={toggleBackdrop}
        onKeyDown={() => {}}
        onKeyUp={() => {}}
        onKeyPress={toggleBackdrop}
        tabIndex={0}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  showBackdrop: state.showBackdrop,
});

const mapDispatchToProps = (dispatch) => ({
  toggleBackdrop: () => dispatch(actionCreators.toggleBackdrop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Backdrop);
