const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/bug-tracker")
  .then(() => console.log("Connected to db."))
  .catch((err) => console.error(err));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/bug-tracker" }),
    secret: "super secret hush hush",
    resave: false,
    saveUninitialized: true,
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

// Routing

app.use("/", require("./routes/index"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/issues", require("./routes/issues"));
app.use("/users", require("./routes/users"));

app.use("/demo", require("./routes/demo"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App listening at port", port);
});
