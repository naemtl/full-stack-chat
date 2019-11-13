let express = require("express");
let app = express();
let multer = require("multer");
let upload = multer({
  dest: __dirname + "/uploads"
});
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let passwords = {};
let sessions = {};
let messages = [];
reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

// Your endpoints go after this line

app.get("/messages", (req, res) => {
  let latestMessages = messages.slice(
    messages.length - 20,
    messages.length + 1
  );
  // slice(-20) also works!
  let loggedInUser = req.cookies.sid;
  if (loggedInUser !== undefined) {
    res.send(JSON.stringify(latestMessages));
    return;
  }
  res.send("stop you hacker");
});

app.post("/newmessage", upload.none(), (req, res) => {
  console.log("In new messages endpoint");
  console.log("Logging body", req.body);
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("current username", username);
  let msg = req.body.msg;
  let newMsg = {
    username: username,
    message: msg,
    timestamp:
      new Date().toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit"
      }) +
      " on " +
      new Date().toLocaleDateString()
  };
  console.log("new message", newMsg);
  messages = messages.concat(newMsg);
  console.log("reassigned messages array", messages);
  res.send(JSON.stringify({ success: true }));
});

app.post("/clearmessages", (req, res) => {
  console.log("deleting my messages");
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let filteredMessages = messages.filter(message => {
    return message.username !== username;
  });
  messages = filteredMessages;
  res.send(JSON.stringify({ success: true }));
});

app.post("/login", upload.none(), (req, res) => {
  console.log("in login endpoint");
  console.log("logging req.body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  console.log("logging expected password", expectedPassword);

  if (enteredPassword === expectedPassword) {
    console.log("passwords match");
    let sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/signup", upload.none(), (req, res) => {
  console.log("in signup endpoint");
  console.log("logging req.body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  if (passwords[username] !== undefined) {
    res.send(
      JSON.stringify({
        success: false
      })
    );
    res.send("username in use");
    return;
  }
  passwords[username] = enteredPassword;
  let sessionId = generateId();
  sessions[sessionId] = username;
  res.cookie("sid", sessionId);
  console.log("passwords object contents", passwords);
  res.send(JSON.stringify({ success: true }));
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
