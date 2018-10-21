"use strict";
const express = require('express');
const app = express();
const router  = express.Router();
const uuid= require('uuid/v4');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const metascraper = require('metascraper')([

  require('metascraper-image')(),
  require('metascraper-title')()

])

const got = require('got')

app.use(
  cookieSession({
    name: "session",
    keys: ["my-super-secret-password"]
  })
);

 let currentUser = {
    id: -1,
    name: 'anonymous'
  }

let anonUser = {
  id: -1,
  name: 'anonymous'
}

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

//This function creates a tag to be inserted to database
function createTag (tag) {
    let tagObj = {
      name: tag
    };
    return tagObj;
  }

module.exports =  (knex) => {

  router.get("/resources/:id", (req, res) => {
      console.log("REQPARAM", req.params.id)

    knex('resources')
      .join('comments','resources.id','=','comments.resources_id')
      .select("*")
      .where("comments.resources_id",req.params.id)
      .then((results) => {
        if (results.length < 1){
          knex
          .select('*')
          .from('resources')
          .where('id',req.params.id)
          .then((result) => {
            console.log("RESULTS ARE : ", result)
            res.json(result)
          })
        } else {
       console.log(results)
       res.json(results);
     }
    });
  });


  router.get("/resources", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .then((results) => {
        res.json(results);
    });
  });

//Get all the resources created by that user
  router.get("/users/:id/created", (req, res) => {
    knex
      .select("*")
      .from("resources")
      .where("users_id", currentUser.id)
      .then((results) => {
        res.json(results);
    });
  });

//Get all the resources liked by that user
  router.get("/users/:id/liked", (req, res) => {
    knex('resources')
      .join('likes','resources.id','=','likes.resources_id')
      .select("*")
      .where("likes.users_id", "=", currentUser.id)
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/results/:search", (req, res) => {

    let search = req.params.search.slice(5); //Takes what was actually searched
    let searchArray = search.split(" "); //Puts individual words searched into an array
    let finalArray = removeA(searchArray, ''); //Removes spaces for Database Search

// If the search is blank return everything, else return just the searched for resources
  if (finalArray.length < 1) {
     knex
      .select("*")
      .from("resources")
      .then((results) => {
        res.json(results);
    });
  } else {
    knex('resources')
      .join('resource_tags', 'resources.id','=','resource_tags.resources_id')
      .join('tags', 'tags.id', '=', 'resource_tags.tags_id')
      .select("*")
      .where("title", "ilike", `%${finalArray[0]}%`)
      .orWhere("name", "ilike", `%${finalArray[0]}%`)
      .orWhere("title", "ilike", `%${finalArray[1]}%`)
      .orWhere("name", "ilike", `%${finalArray[1]}%`)
      .orWhere("title", "ilike", `%${finalArray[2]}%`)
      .orWhere("name", "ilike", `%${finalArray[2]}%`)
      .orWhere("title", "ilike", `%${finalArray[3]}%`)
      .orWhere("name", "ilike", `%${finalArray[3]}%`)
      .orWhere("title", "ilike", `%${finalArray[4]}%`)
      .orWhere("name", "ilike", `%${finalArray[4]}%`)
      .orWhere("title", "ilike", `%${finalArray[5]}%`)
      .orWhere("name", "ilike", `%${finalArray[5]}%`)
      .then((results) => {
        res.json(results); //Results are at "/results/:search" in a json
    });
  }
  });

  router.post("/create", (req, res) => {
    let url = req.body.url;
    let title = req.body.title;
    let tags = req.body.tags.toLowerCase().split(' ');  //creates an array of tags
    let desc = req.body.description;

    const targetUrl = url;

    (async () => {
      const { body: html, url } = await got(targetUrl)
      const metadata = await metascraper({ html, url })
      console.log(metadata)

      // Builds Resource Object to be inserted ** will make created at Date.now() and user_id i
    let resource = {
      title: metadata.title,
      resource_url: url,
      description: desc,
      created_at: Date.now(),
      likes: 0,
      rating: 0,
      users_id: currentUser.id,///OF Logged in user
      image_url: metadata.image
    };
    //This creates the new resource in the database
    knex('resources')
      .insert(resource)
      .returning('id')
      .then((resourceResults) => {     ///For each tag, searches the database to see if it exists
          for (let i = 0; i < tags.length; i++) {
            let tag = createTag(tags[i]);
            knex('tags')
              .select('id')
              .where('name', '=', tag.name)
              .returning('id')
              .then((success) => {
                if (success.length > 0) { //If the tag already exists then insert the tag id and resource id into resource_tags table
                knex('resource_tags')
                  .insert({
                  resources_id: resourceResults[0],
                  tags_id: success[0].id
                  })
                  .then((end) =>{
                    console.log("Successfully got an id");
                  });
              } else {  //If the tag doesn't exist then insert the tag
                knex('tags')
                  .insert(tag)
                  .returning('id')
                  .then((tagResults) => {
                    knex('resource_tags') //Inserts the newly created tag id and resource id into resource_tags table in database
                    .insert({
                      resources_id: resourceResults[0],
                      tags_id: tagResults[0]
                    })
                    .then((finalResults) =>{
                      console.log("added new resource tag");
                    });
                  });
              }
            });
          }
      })
        .then((results) => {
          res.redirect("/");
        });
    })()
  });

  router.get("/create", (req, res) => {
    res.redirect("/")
  });

// THIS IS THE LOGIN POST
  router.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password

    knex("users")
      .select("*")
      .where("name", "=", username)
      .then((user) => {
        if (user.length <  1) { //Checks to see if user is in database
          console.log("username doesnt exist")
        } else {
          if (bcrypt.compareSync(password, user[0].password)) { //If user exists and password is right set current user
            currentUser = user[0]
            req.session.token = user[0].token;
            module.exports.currentUser = currentUser
             res.redirect("/")
          } else {
            console.log("Invalid password")
            res.redirect("/")
          }
        }
      })
      .catch(e => {
        console.log("Something went wrong" , e)
        res.redirect("/")
      })
  });

  //THIS IS THE REGISTER POST

  router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      name: username,
      password: hashedPassword,
      token: uuid()   //Will be used to set cookie after user created
    }

    if (!username || !password) { //Checks to see if password or username is empty
      console.log("Username or Password is empty")
      res.redirect("/")
    } else { //
     knex("users")
      .select("*")
      .where("name", "=", username)
      .then((user) => {
        if (user.length < 1) { //If user doesnt exist yet then insert user
          knex("users")
            .insert(newUser)
            .returning("*")
            .then((createdUser) => {
              req.session.token = createdUser[0].token;
              currentUser = createdUser[0];
              module.exports.currentUser = currentUser
              res.redirect("/")
             })
        } else {
         console.log("Username Already Exists")
         res.redirect("/")
        }
      })
      .catch(e => {
        console.log("Oops something went wrong", e)
        res.redirect("/")
      })
    }
  })

//THIS INSERTS A LIKE TO THE DATABASE AND UPDATES THE LIKES VALUE IN RESOURCE TABLE
  router.post("/resources/:id/likes", (req, res) => {
    let resourceId = req.body.resourceId

    let like = {
      users_id: currentUser.id,
      resources_id: resourceId
    }

    knex("likes")
      .select("*")
      .where("users_id", currentUser.id)
      .andWhere("resources_id", resourceId)
      .then((foundLike) => {
        console.log("Found like is : ", foundLike)
        if (foundLike.length < 1) {
          knex("likes")
            .insert(like)
            .then((result) => {
              console.log("Inserted a new like")
            })
            .then((results) => {
              knex('likes')
                .count("*")
                .where("resources_id", resourceId)
                .then((count) => {
                  knex("resources")
                    .update({likes:count[0].count})
                    .where("id", resourceId)
                    .then((end) => {
                      console.log("likes have been updated")
                      res.redirect("/")
                    })
                })
            })
        } else {
          console.log("Like already exists")
          res.redirect("/")
        }
      })
  })

//HANDLES THE RATING INSERT AND UPDATES RESOURCE TABLE WITH NEW AVG
  router.post("/resources/:id/rating", (req, res) => {

    let resourceId = req.body.resourceId;
    let rating = req.body.rating;
    let ratingObj = {
      rating: rating,
      resources_id: resourceId,
      users_id: currentUser.id
    };

    knex("ratings")
      .select("*")
      .where("users_id", currentUser.id)
      .andWhere("resources_id", resourceId)
      .then((foundRating) => {
        if (foundRating.length < 1) {
          knex("ratings")
            .insert(ratingObj)
            .then((result) => {
              console.log("Inserted a new Rating")
            })
            .then((results) => {
              knex('ratings')
                .avg("rating")
                .where("resources_id", resourceId)
                .then((updateRating) => {
                  console.log("Updated Rating is : ", updateRating[0].avg)
                  knex("resources")
                    .update({rating:updateRating[0].avg})
                    .where("id", resourceId)
                    .then((end) => {
                      console.log("ratings have been updated")
                      res.redirect("/")
                    })
                })
            })
        } else {
          console.log("Rating already exists")
          res.redirect("/")
        }
      })
  })

  router.post("/logout", (req, res) => {
    req.session.token = null
    currentUser = anonUser
    module.exports.currentUser = currentUser
    console.log("Logged out current user is now : ", currentUser)
    res.redirect("/")
  })

  router.post("/resources/:id/comments", (req, res) => {

    let resourceId = req.body.resourceId;
    let comment = req.body.comment;
    let commentObj = {
      comment: comment,
      resources_id: resourceId,
      users_id: currentUser.id
    };

    knex("comments")
      .select("*")
      .insert(commentObj)
      .then((result) => {
        console.log("Inserted a new comment")
        res.redirect(`/resources/${resouceId}`)
        })
  })

  return router;
};

//THIS FILE THE '/'' Represents whatever is mounted in server.js in app.use

