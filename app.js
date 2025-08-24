const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const flash = require("connect-flash");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.set("trust proxy", 1); // trust first proxy (Render uses a proxy)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // send cookies only over HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  })
);


app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());
//For showing login error if user input doesn't exist
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
  });



const router = require("./routes/userRouter");
app.use("/",router);
app.use(express.static("public"));

  
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`You are running on port ${PORT}`));