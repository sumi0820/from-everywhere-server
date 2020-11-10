require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

require("./config/db.config");

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

// Session handler
app.use(
  session({
    secret: "foo",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60,
    }),
  })
);

//A library that helps us log the requests in the console
app.use(logger("dev"));

const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(express.static(path.join(__dirname, "public")));
// app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

//Register routes

const authRoutes = require("./routes/auth.routes");
app.use("/api", authRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

const itemRoutes = require("./routes/item.routes");
app.use("/api", itemRoutes);

const messageRoutes = require("./routes/message.routes");
app.use("/api", messageRoutes);

const fileUploads = require("./routes/file-upload.routes");
app.use("/api", fileUploads);

// If no routes match, send them the React HTML.
app.use((req, res, next) => {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
