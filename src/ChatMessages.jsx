import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatMessages extends Component {
  componentDidMount = () => {
    let updateMessages = async () => {
      let response = await fetch("/messages");
      let responseBody = await response.text();
      console.log("response from messages", responseBody);
      let parsed = JSON.parse(responseBody);
      console.log("parsed response body", parsed);
      if (!Array.isArray(parsed)) {
        return;
      }
      this.props.dispatch({ type: "set-messages", messages: parsed });
    };
    setInterval(updateMessages, 500);
  };
  render = () => {
    let msgToElement = msg => {
      return (
        <li>
          {msg.username}: {msg.message} posted at {msg.timestamp}
        </li>
      );
    };
    return <ul>{this.props.messages.map(msgToElement)}</ul>;
  };
}

let mapStateToProps = state => {
  return {
    messages: state.msgs,
    initialLogin: state.loggedIn
  };
};

let Chat = connect(mapStateToProps)(UnconnectedChatMessages);

export default Chat;
