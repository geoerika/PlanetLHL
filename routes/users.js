"use strict";

// THIS FILE IS WHAT ACTUALLY PULLS INFORMATION FROM THE DATABASE AND PUTS A JSON
// RESPONSE AT THAT URL
const express = require('express');
const router  = express.Router();

//THIS FUNCTION REMOVES SPACES FROM SEARCH ARRAYS to allow better database searches
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
      .from("resources")
      //.where("id", "=", 2)
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

  router.get("/results/:search", (req, res) => {

    let search = req.params.search.slice(5) //Takes what was actually searched
    let searchArray = search.split(" ") //Puts individual words searched into an array
    let finalArray = removeA(searchArray, ''); //Removes spaces for Database Search

    knex
      .select("*")
      .from("resources")
      .where("title", "ilike", `%${finalArray[0]}%`)
      // .orWhere("title", "ilike", `%${finalArray[0]}%`)
      .orWhere("title", "ilike", `%${finalArray[1]}%`)
      // .orWhere("title", "ilike", `%${finalArray[1]}%`)
      .orWhere("title", "ilike", `%${finalArray[2]}%`)
      // .orWhere("title", "ilike", `%${finalArray[2]}%`)
      .orWhere("title", "ilike", `%${finalArray[3]}%`)
      // .orWhere("title", "ilike", `%${finalArray[3]}%`)
      .orWhere("title", "ilike", `%${finalArray[4]}%`)
      // .orWhere("title", "ilike", `%${finalArray[4]}%`)
      .orWhere("title", "ilike", `%${finalArray[5]}%`)
      // .orWhere("title", "ilike", `%${finalArray[5]}%`)
      .then((results) => {
        res.json(results); //Results are at "/results/:search" in a json
    });
  });

  router.post("/create", (req, res) => {
    console.log(req.body)
    res.send('Thanks')
  })


  router.get("/create", (req, res) => {
    /// THIS WILL BE A REDIRECT TO HOMEPAGE WITH NEW CREATED RESOURCE NOW AVAILABLE
    res.redirect('/')
  })

 //OLD WAY TO RECEIVE POST for search CAN USE skeleton CODE FOR create FORMS
// router.post("/results", (req, res) => {


//   let search = req.body.search.slice(5)
//   let searchArray = search.split("%20")
//   let finalArray = removeA(searchArray, '');
//   console.log("FINAL ARray" , finalArray)

//     knex
//       .select("*")
//       .from("users")
//       .where("name", "ilike", `${finalArray[0]}%`)
//       // .orWhere("title", "ilike", `%${finalArray[0]}%`)
//       .orWhere("name", "ilike", `${finalArray[1]}%`)
//       // .orWhere("title", "ilike", `%${finalArray[1]}%`)
//       .orWhere("name", "ilike", `${finalArray[2]}%`)
//       // .orWhere("title", "ilike", `%${finalArray[2]}%`)
//       .orWhere("name", "ilike", `${finalArray[3]}%`)
//       // .orWhere("title", "ilike", `%${finalArray[3]}%`)
//       .orWhere("name", "ilike", `${finalArray[4]}%`)
//       // .orWhere("title", "ilike", `%${finalArray[4]}%`)
//       .orWhere("name", "ilike", `${finalArray[5]}%`)
//       // .orWhere("title", "ilike", `%${finalArray[5]}%`)
//       .then((results) => {
//         // res.json(results);
//         console.log("results Are: " , results)
//         console.log("response is: ", res.body)
//         res.send("thank you")
//         console.log("response is: ", res.body)
//     });
//   });

  return router;
}

//THIS FILE THE '/'' Represents whatever is mounted in server.js in app.use

