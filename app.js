const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const { initDatabase, cusotmer } = require("./db");
const router = require("./routes");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

initDatabase();

global.loggedIn = null;
global.userType = null;

app.use(
  expressSession({
    secret: "Nithin",
  })
);

app.use("*", async (req, res, next) => {
  try {
    const sessionUserName = req.session.userName;
    if (!sessionUserName) {
      loggedIn = null;
      userType = null;
      return next();
    }
    const user = await cusotmer.findOne({ userName: sessionUserName });
    if (user) {
      loggedIn = true;
      userType = user.userType;
    } else {
      loggedIn = null;
      userType = null;
    }
    next();
  } catch (e) {
    loggedIn = null;
    userType = null;
    next();
  }
});

app.use("/", router);

app.listen(3020, () => {
  console.log("******* App is listening at port 3020 !!! *******");
});
