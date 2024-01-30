import { createContext, useReducer } from "react";

export const Store = createContext();
export const ACTIONS = {
  SIGN_UP: "sign_up",
  SIGN_IN: "sign_in",
  SIGN_OUT: "sign_out",
};
const initialState = {
  userDetails: localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : null,
    expenses: localStorage.getItem("expenses")
    ? JSON.parse(localStorage.getItem("expenses"))
    : [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SIGN_IN:
      return { ...state, userDetails: action.payload };
    case ACTIONS.SIGN_UP:
      return { ...state, userDetails: action.payload };
    case ACTIONS.SIGN_OUT:
      return {
        ...state,
        userDetails: null,
        expenses:[]
      };
    default:
      return state;
  }
};
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
export { reducer };
