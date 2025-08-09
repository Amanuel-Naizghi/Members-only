const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


const router = require("./routes/userRouter");
app.use("/",router);

  
const PORT = 3000;
app.listen(PORT, () => console.log(`You are running on port ${PORT}`));