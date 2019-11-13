import React, { Component } from "react";
import { connect } from "react-redux";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import ChatForm from "./ChatForm.jsx";
import ChatMessages from "./ChatMessages.jsx";

class UnconnectedApp extends Component {
  render = () => {
    if (this.props.lgin) {
      return (
        <div>
          <ChatMessages />
          <ChatForm />
        </div>
      );
    }
    return (
      <div>
        <h2>Signup</h2>
        <Signup />
        <h2>Login</h2>
        <Login />
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    lgin: state.loggedIn
  };
};

let App = connect(mapStateToProps)(UnconnectedApp);

export default App;
