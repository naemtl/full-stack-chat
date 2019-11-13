import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true };
  }
  if (action.type === "logout-success") {
    return { ...state, loggedIn: false };
  }
  if (action.type === "set-messages") {
    return { ...state, msgs: action.messages };
  }
  if (action.type === "clear-messages") {
    return { ...state, msgs: action.messages };
    // object.keys(logged in username) and delete all entries in array that match this key
  }
  return state;
};

const store = createStore(
  reducer,
  { msgs: [], loggedIn: false },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
