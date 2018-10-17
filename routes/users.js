"use strict";

// THIS FILE IS WHAT ACTUALLY PULLS INFORMATION FROM THE DATABASE AND PUTS A JSON
// RESPONSE AT THAT URL
const express = require('express');
const router  = express.Router();

module.exports =  (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .where("id", "=", 2)
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/users", (req, res) => {
    knex
      .select("*")
      .from("migrations")
      .then((results) => {
        res.json(results);
    });
  });

router.get("/results", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}

//THIS FILE THE '/'' Represents whatever is mounted in server.js in app.use


//FOR SEARCH BAR FUNCTIONALITY OF SPLITTING FORM DATA INTO WORDS
  // let testArray = req.body.text.split(" ")
  //   console.log('Word 1: ' , testArray[0])
  //   console.log('Word 2: ' , testArray[1])
  //   console.log('Word 3: ' , testArray[2])
  //   console.log('Word 4: ' , testArray[3])
