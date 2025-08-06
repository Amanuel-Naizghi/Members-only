const express = require("express");
const router = require("./routes/userRouter");
const path = require("node:path");


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.use("/",router);

  
const PORT = 3000;
app.listen(PORT, () => console.log(`You are running on port ${PORT}`));