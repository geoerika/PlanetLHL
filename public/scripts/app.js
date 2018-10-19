
 $(document).ready(function() {

  searchResources();
  createNewResource();
  login();
  register();
});



// THIS IS A GET TO THE HOMEPAGE
$(() => {
  $.ajax({
    method: "GET",
    url: "/planetLHL"
  }).done((users) => {
    // for(user of users) {
    //   $("<div>").text(user.name).appendTo($("body"));
    // }
    renderResources(users);
  });
});

//THIS IS GET TO THE USER PAGE   ** WILL USE /user/:id when user ids are available
$(() => {
  $.ajax({
    method: "GET",
    url: "/planetLHL/users"
  }).done((migrations) => {
    for(migration of migrations) {
      $("<div>").text(migration.name).appendTo($("body"));
    }
  });
});

// This Function creates a new resource
function createNewResource() {
  var $form = $('#newCreateForm');
    $form.on('submit', function (event) {
      event.preventDefault();

      //Create Safe Url
      let url = $(this).children('#Resource-url').val()
      let cleanUrl = escape(url) //escapes and serializes
      let finalUrl = cleanUrl.slice(13) //cuts off name



      // Create Safe Title
      let title = $(this).children('#Resource-title').val()
      let cleanTitle = escape(title)



      //Create Safe Description
      let description = $(this).children('#Resource-description').val()
      let cleanDescription = escape(description)


      //Create Safe Tags
      let tags = $(this).children('#Resource-tags').val()
      let cleanTags= escape(tags)


      $.ajax({
        method: "POST",
        url: "/planetLHL/create",
        data: {
          url: cleanUrl,
          title: cleanTitle,
          description: cleanDescription,
          tags: cleanTags
        },
        success: function(result) {
                  $.getJSON("/planetLHL/create").then(data => {
                    renderResources(data);
                  })
                 }
      });
      $(this).trigger('reset')
    })
}

function register() {
  var $form = $('#newRegisterForm');
    $form.on('submit', function (event) {
      event.preventDefault();

      //Create Safe Url
      let username = $(this).children('#UserName').val()
      console.log(username)
      let cleanUsername = escape(username) //escapes
      console.log(cleanUsername)
      let password = $(this).children('#UserPassword').val()

      $.ajax({
        method: "POST",
        url: "/planetLHL/register",
        data: {
          username: cleanUsername,
          password: password
        },
        success: function(result) {
                  console.log("Register successful")
                 }
      });
      // $(this).trigger('reset')
    })
}

function login() {
  var $form = $('#newLoginForm');
    $form.on('submit', function (event) {
      event.preventDefault();

      //Create Safe Url
      let username = $(this).children('#UserNameLogin').val()
      let password = $(this).children('#UserPasswordLogin').val()
      console.log(password)
      // let finalUrl = cleanUrl.slice(13) //cuts off name

      $.ajax({
        method: "POST",
        url: "/planetLHL/login",
        data: {
          username: username,
          password: password
        },
        success: function(result) {
                  console.log("log in success")
                 }
      });
      // $(this).trigger('reset')
    })
}

//SEARCH REQUEST ENDPOINT

function searchResources() {
  var $form = $('#newSearchForm');
    $form.on('submit', function (event) {
      event.preventDefault();
      let search = $(this).children('#searchFormText').val()
      const safeSearch = escape(search); //Creates safe html from form input
      $(this).children('#searchFormText').val(safeSearch);
      let safeHTML = $(this).serialize();

      $.ajax({
        method: "GET",
        url: `/planetLHL/results/${safeHTML}`,
        success: function(result) {

                  //console.log(result)
                  renderResources(result)
                 }
      })
    })
}

// function renderResources(data) {
//   console.log("DATA IS: ", data)
// }

//Cleans text to avoid Cross-Site Scripting in entered Tweets
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//THESE WILL BE USED LATER
// function loadResources () {
//     $.getJSON('/planetLHL/resources').done(renderResources);
//   }

// function renderResources (data) {    // PLACE HOLDER FUNCTIONS
//   $('#resource-container').empty();
//   for (var resource of data) {
//     var $resource = createNewResource(resource);
//     $('#resource-container').prepend($resource);
//   }
// }


// $(() => {
//   $.ajax({
//     method: "POST",
//     url: "/planetLHL/resource/:id"
//   }).done((resource) => {
//       newResource.appendTo($("body")); //newResource is placeholder html variable thats not yet created
//   });;
// });


function renderResources(resources) {
   $('.col-md-4').empty();
   resources.forEach(function(resource){
      let $resource = createResourceElement(resource);
      $('.col-md-4').prepend($resource);
   });
}

// Function to add the attributes for each tweet to create a dynamic HTML page.
function createResourceElement(resource) {
   let newScript = `
           <div class="card mb-4 shadow-sm">
                <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" style="height: 225px; width: 100%; display: block;" src="https://i.ytimg.com/vi/9NtRJW2dpvo/maxresdefault.jpg" data-holder-rendered="true">
                <div class="card-body">
                  <p class="card-text">${resource.title}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary"><a target="_blank" rel="noopener noreferrer" href="${resource.resource_url}"> Visit</a></button>
                    </div>
                    <small class="text-muted">9 mins</small>
                  </div>
                </div>
            </div>`

  return newScript;

}


//This File THE URL Points to Server.js actual url
