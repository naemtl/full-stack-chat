import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({
      message: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("message submitted");
    let data = new FormData();
    data.append("msg", this.state.message);
    fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
  };

  handleLogout = () => {
    this.props.dispatch({ type: "logout-success" });
  };

  handleClearMessages = async () => {
    // this.props.dispatch({ type: "clear-messages" });
    await fetch("/clearmessages", { method: "POST" });
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleMessageChange} />
          <input type="submit" />
        </form>
        <button onClick={this.handleLogout}>Logout</button>
        <button onClick={this.handleClearMessages}>Remove my messages</button>
      </div>
    );
  };
}

let ChatForm = connect()(UnconnectedChatForm);

export default ChatForm;
