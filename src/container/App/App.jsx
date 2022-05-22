import React from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import Navigation from "../../components/Navigation/Navigation";
import CategoryItem from "../../components/Category/Category";
import Cart from "../../components/Cart/Cart";
import PDP from "../../components/PDP/PDP";
import Backdrop from "../../UI/Backdrop/Backdrop";
import SelectAttribute from "../../components/AttributeModal/AttributeModal";
import * as actionCreators from "../../store/actionCreators";
import "./combine-styles.scss";

import { GET_CATEGORIES } from "../../graphql/query";

class App extends React.PureComponent {
  componentDidMount() {
    const { setRoutes, catchNetworkError } = this.props;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: GET_CATEGORIES,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        const { categories } = result.data;
        const routes = [...categories].map((item) => item.name);
        setRoutes(routes);
      })
      .catch((e) => catchNetworkError(e));
  }

  render() {
    const { routes, netWorkErrorStatus, showAttributeModal } = this.props;

    const appContent =
      netWorkErrorStatus === false ? (
        <>
          <Navigation />
          <Routes>
            {routes.length > 0 ? (
              <Route
                path="/"
                exact
                element={<CategoryItem show={routes[0]} />}
n              />
            ) : (
              <Route
                path="/"
                exact
                element={<h1 style={{ padding: "10rem 5%" }}>Loading</h1>}
              />
            )}

            {routes.map((item) => (
              <Route
                key={item}
                path={`/${item}`}
                element={<CategoryItem show={item} />}
              />
            ))}
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/pdp" exact element={<PDP />} />
          </Routes>
          <Backdrop />
          {showAttributeModal ? <SelectAttribute /> : null}
        </>
      ) : (
        <h1>
          error asscessing internet, please check to ensure you have internet
          connection
        </h1>
      );
    return <div className="App">{appContent}</div>;
  }
}

const mapStateToProps = (state) => ({
  routes: state.routes,
  showAttributeModal: state.pdp.showAttributeModal,
  netWorkErrorStatus: state.hasNetworkError.status,
  netWorkErrorInformation: state.hasNetworkError.error,
});

const mapDispatchToProps = (dispatch) => ({
  setRoutes: (routes) => dispatch(actionCreators.setRoutes(routes)),
  catchNetworkError: (e) => dispatch(actionCreators.setNetworkError(e)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
