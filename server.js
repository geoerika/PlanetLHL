"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));


// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: ["my-super-secret-password"]
  })
);

// app.use((req, res, next) => {
//   const token = req.session.token;
//   const anonUser = {
//     id: -1,
//     username: "Anonymous"
//   };

//   if (token) {
//     return users
//       .findByToken(token)
//       .then(([user]) => {
//         if (user) {
//           req.currentUser = user;
//         } else {
//           req.currentUser = anonUser;
//         }
//       })
//       .catch(() => {
//         req.currentUser = anonUser;
//       })
//       .then(next, next);
//   }

//   req.currentUser = anonUser;
//   next();
// });

// Mount all resource routes
app.use("/planetLHL", usersRoutes(knex));

// Home page
app.get("/resources", (req, res) => {

  res.render("index", usersRoutes.currentUser);
});

app.get("/", (req, res) => {
 // console.log("This is current user : ", usersRoutes.currentUser)
  res.redirect("/resources");
});

//User page
app.get("/users/:id", (req, res) => {
  res.render("user.ejs", usersRoutes.currentUser);
});

//comments page
app.get("/resources/:id", (req, res) => {
  console.log("Server :",req.params)
  res.render("comments.ejs");
});

//test page
app.get("/comments", (req, res) => {
  res.render("comments.ejs");
});

app.post("/register", (req, res) => {
  let username = req.body.UserName
  let password = req.body.UserPassword
  console.log("username: ", username, "password", password)
  console.log(usersRoutes)
  usersRoutes.registerUser(username, password)
  res.render("index.ejs")
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
