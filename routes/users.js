"use strict";

// THIS FILE IS WHAT ACTUALLY PULLS INFORMATION FROM THE DATABASE AND PUTS A JSON
// RESPONSE AT THAT URL
const express = require('express');
const router  = express.Router();


function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

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
    .from("migrations")
    .then((results) => {
    res.json(results);
    });
  });

router.post("/results", (req, res) => {
  let search = req.body.search.slice(5)
  let searchArray = search.split("%20")
  let finalArray = removeA(searchArray, '');
  console.log("FINAL ARray" , finalArray)

    knex
      .select("*")
      .from("users")
      .where("name", "ilike", `${finalArray[0]}%`)
      // .orWhere("title", "ilike", `%${finalArray[0]}%`)
      .orWhere("name", "ilike", `${finalArray[1]}%`)
      // .orWhere("title", "ilike", `%${finalArray[1]}%`)
      .orWhere("name", "ilike", `${finalArray[2]}%`)
      // .orWhere("title", "ilike", `%${finalArray[2]}%`)
      .orWhere("name", "ilike", `${finalArray[3]}%`)
      // .orWhere("title", "ilike", `%${finalArray[3]}%`)
      .orWhere("name", "ilike", `${finalArray[4]}%`)
      // .orWhere("title", "ilike", `%${finalArray[4]}%`)
      .orWhere("name", "ilike", `${finalArray[5]}%`)
      // .orWhere("title", "ilike", `%${finalArray[5]}%`)
      .then((results) => {
        // res.json(results);
        console.log("results Are: " , results)
        console.log("response is: ", res.body)
        res.send("thank you")
        console.log("response is: ", res.body)
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
