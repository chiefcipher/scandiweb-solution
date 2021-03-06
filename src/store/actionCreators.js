import * as actions from "./actions";
export const setCategory = (payload)=>{
  return {
    type : actions.SET_CATEGORY , 
    ...payload 
  }
}
export const setRoutes = (routes) => {
  return {
    type: actions.POPULATE_DATA,
    routes: routes
  };
};

export const setNetworkError = (e) => {
  return {
    type: actions.SET_NETWORK_ERROR,
    error: e,
  };
};
export const addPdp = (data, source) => {
  return (dispatch) => {
    dispatch(addPdpInit(data));

    if (source !== "CART_ICON") {
      dispatch(redirectTo("/pdp"));
    } else {
      dispatch({
        type: actions.SHOW_SELECT_ATTRIBUTE_MODAL,
      });
    }
  };
};

const addPdpInit = (data) => ({
  type: actions.ADD_PDP_INIT,
  data,
});

const redirectTo = (route) => {
  return {
    type: actions.REDIRECT_TO,
    route: route,
  };
};

export const resetRedirect = () => {
  return {
    type: actions.RESET_REDIRECT,
  };
};

export const setAttributes = (payload) => {
  return {
    type: actions.SET_ATTRIBUTES,
    payload: {
      ...payload,
    },
  };
};
export const addToCart = () => {
  return (dispatch, getState) => {
    const { attributes, newAttributes } = getState().pdp;

    if (attributes.length > newAttributes.length) {
      return dispatch({
        type: actions.ADD_TO_CART_ATTRIBUTE_ERROR,
      });
    }
    dispatch({
      type: actions.ADD_TO_CART,
    });
    dispatch({
      type: actions.RESET_SELECTED_PDP_ATTRIBUTES,
    });
  };
};

export const quantifyCartItem = (payload) => {
  return {
    type: actions.QUANTIFY_CART_ITEM,
    id: payload.id,
    method: payload.method,
  };
};

export const toggleBackdrop = () => {
  return {
    type: actions.TOGGLE_BACKDROP,
  };
};

export const setCurrencies = (data) => {
  return {
    type: actions.SET_CURRENCIES,
    currencyData: [...data.currencies],
  };
};

export const changeDefaultCurrency = (data) => {
  return {
    type: actions.CHANGE_DEFAULT_CURRENCY,
    data: {
      label: data.label,
      symbol: data.symbol,
    },
  };
};

export const changeCartItemAttribute = (payload) => {
  return {
    type: actions.CHANGE_CART_ITEM_ATTRRIBUTE,
    payload,
  };
};
