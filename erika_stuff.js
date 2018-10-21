router.post("/update", (req, res) => {

  let password = req.body.newpassword;
  const hashedPassword = bcrypt.hashSync(password, 10);

   if (!password) {       //Checks to see if password is empty
      console.log("Please insert password!");
    } else {
     knex("users")
      .select("*")
      .where("token", req.params.token)
      .then((user) => {
          knex("users")
            .update("user.password", hashedPassword);
      }
      .catch(e => {
        console.log("Oops something went wrong", e);
      })
    }
});

