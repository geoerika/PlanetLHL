
 $(document).ready(function() {

  searchResources();
  createNewResource();
  login();
  register();
  showCreated();
  logout();
});

// THIS IS A GET TO THE HOMEPAGE
$(() => {
  $.ajax({
    method: "GET",
    url: "/planetLHL"
  }).done((users) => {
    renderResources(users);
  });
});

//THIS IS GET TO THE USER PAGE   ** WILL USE /user/:id when user ids are available

function showCreated () {
  let $button = $('#createdResources')
    $button.on('click', function (event) {
       $.ajax({
          method: "GET",
          url: "/planetLHL/users/:id"
        }).done((results) => {
          renderResources(results)
        });
    })
}

function logout() {
  let $button = $('.Logout')
    $button.on('click', function (event) {
      $.ajax({
          method: "POST",
          url: "/planetLHL/logout"
        }).done((results) => {
          console.log("logout was successful")
        });
    })
  }


function createNewResource() {
  let $form = $('#newCreateForm');
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
                  console.log("This is where renderResources will be called")
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
      let cleanUsername = escape(username) //escapes
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
      $(this).trigger('reset')
    })
}

function login() {
  let $form = $('#newLoginForm');
    $form.on('submit', function (event) {
      event.preventDefault();

      //Create Safe Url
      let username = $(this).children('#UserNameLogin').val()
      let password = $(this).children('#UserPasswordLogin').val()

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
      $(this).trigger('reset')
    })
}

//SEARCH REQUEST ENDPOINT

function searchResources() {
  let $form = $('#newSearchForm');
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

//Cleans text to avoid Cross-Site Scripting in entered Tweets
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function renderResources(resources) {
   $('.row').empty();
   resources.forEach(function(resource){
      let $resource = createResourceElement(resource);
      $('.row').prepend($resource);
   });
    attachLikes();
}

// Function to add the attributes for each tweet to create a dynamic HTML page.
function createResourceElement(resource) {
   let newScript = `
            <div class="col-xl-4">
             <div class="card sm-2 shadow-sm">
                <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" style="height: 50%; width: 100%; display: block;" src=${resource.image_url} data-holder-rendered="true">
                <div class="card-body">
                  <p class="card-text">${resource.title}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    <span class="status" name="notLiked"></span>
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary"><a target="_blank" rel="noopener noreferrer" href="${resource.resource_url}">Visit</a></button>
                      <button type="button" class="btn btn-sm btn-outline-secondary buttonLike" name="${resource.id}">Like</button>
                      <div class="dropdown">
                      <button type="button" class="btn btn-sm btn-outline-secondary buttonRate">Rate</button>
                        <div class="dropdown-content">
                          <form class="newRatingForm" >
                            <textarea class="UserRate" name="UserRate"></textarea>
                            <input class="postRating" type="submit" value="Rate!">
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <small class="textMuted likes-count"> Likes: ${resource.likes} </small>
                  <small class="textMuted"> Avg Rating: ${resource.rating} </small>
                </div>
              </div>
            </div>`

  return newScript;

}

// Function attaches Event Listeners to the like button and sends Ajax Put request
function attachLikes() {
  $(".buttonLike").on('click', function(){
    let resourceId = $(this).attr("name")
    event.preventDefault();
    $(this).css('color', 'red') //Changes heart to red
      //Sends Ajax Request
        $.ajax({
                  url: `planetLHL/resources/${resourceId}/likes`,
                  type: `POST`,
                  data:{
                        resourceId: `${resourceId}`,
                      },
                  success: function(result) {
                  $.getJSON("/planetLHL").then((result) => {
                    renderResources(result)
                  })
                 }
        });
  });
}


//This File THE URL Points to Server.js actual url
