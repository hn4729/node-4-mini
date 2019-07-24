require("dotenv").config();
const express = require("express");
const session = require("express-session");
const messageCtrl = require("./messagesCtrl");

const { SESSION_SECRET, SERVER_PORT } = process.env;

const app = express();

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  })
);

app.use((req, res, next) => {
  let badWords = ["knucklehead", "jerk", "internet explorer"];
  if (req.body.message) {
    for (let i = 0; i < badWords.length; i++) {
      let regex = new RegExp(badWords[i], "g");
      req.body.message = req.body.message.replace(regex, "****");
    }
    next();
  } else {
    next();
  }
});

app.get("/api/messages", messageCtrl.getAll);
app.post("/api/message", messageCtrl.createMessage);
app.get("/api/messages/history", messageCtrl.history);

app.listen(SERVER_PORT, () => {
  console.log("Listening on PORT " + SERVER_PORT);
});
