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
      .from("users")
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
        res.json(results); //Results are at "/results/:search" in a json
    });
  });

  router.post("/create", (req, res) => {
    let url = req.body.url
    let title = req.body.title
    let tags = req.body.tags.toLowerCase().split(' ')
    console.log("THE TAGS ARE : ", tags)
    let desc = req.body.description

    let resource = {
      title: title,
      resource_url: url,
      description: desc,
      created_at: 1000,
      likes: 0,
      rating: 0,
      users_id: 1
    }

    function createTag (tag) {
      let tagObj = {
        name: tag
      }
      return tagObj
    }


    console.log("Resource Object is ", resource)

    knex('resources')
      .insert(resource)
      .returning('id')
      .then((resourceResults) => {
          for (let i = 0; i < tags.length; i++) {
            let tag = createTag(tags[i])
            console.log("Tag inside beginning of loop ", tag)
            knex('tags')
              .select('id')
              .where('name', '=', tag.name)
              .returning('id')
              .then((success) => {
                if (success) {
                console.log('WE ARE IN THE TRY PART', success)
                console.log("THIS IS THE VALUE OF SUCCESS: ", success[0].id)
                console.log("THIS IS THE VALUE OF RESOURCERESULT: ", resourceResults[0])
                knex('resource_tags')
                  .insert({
                  resources_id: resourceResults[0],
                  tags_id: success[0].id
                  })
                  .then((end) =>{
                    console.log("Successfully got an id")
                  })
              } else {
              knex('tags')
              .insert(tag)
              .returning('id')
              .then((tagResults) => {
                console.log('WE ARE IN THE CATCH PART')
                knex('resource_tags')
                .insert({
                  resources_id: resourceResults[0],
                  tags_id: tagResults[0]
                })
                .then((finalResults) =>{
                  res.json(results)
                })
              })
            }
            })
        }
      })

  })


  router.get("/create", (req, res) => {
    /// THIS WILL BE A REDIRECT TO HOMEPAGE WITH NEW CREATED RESOURCE NOW AVAILABLE
    res.redirect('/')
  })


  return router;
}

//THIS FILE THE '/'' Represents whatever is mounted in server.js in app.use

