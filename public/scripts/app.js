
 $(document).ready(function() {
 // showResources();
  searchResources();
  createNewResource();
  login();
  register();
  showCreated();
  showLiked();
  logout();

});

$(() => {
  $.ajax({
    method: "GET",
    url: "/planetLHL/resources"
  }).done((users) => {
    renderResources(users);
  });
});


// function showResources(){
// //  let $button = $('#Show')
// //    $button.on('click', function (event) {
//   $.ajax({
//     method: "GET",
//     url: "/planetLHL/resources"
//   }).done((users) => {
//     renderResources(users);
//   });
// //});
// }

//THIS IS GET TO THE USER PAGE   ** WILL USE /user/:id/create when user ids are available

function showCreated () {
  let $button = $('#createdResources')
    $button.on('click', function (event) {
       $.ajax({
          method: "GET",
          url: "/planetLHL/users/:id/created"
        }).done((results) => {
          renderResources(results)
        });
    })
}

//THIS IS A GET TO THE USER PAGE TO SHOW USER LIKES RESOURCES ** WILL USE /user/:id/likes

function showLiked () {
  let $button = $('#likedResources')
    $button.on('click', function (event) {
       $.ajax({
          method: "GET",
          url: "/planetLHL/users/:id/liked"
        }).done((results) => {
          renderResources(results)
        });
    })
}

//Cleans text to avoid Cross-Site Scripting in entered Resource
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
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
                  $.getJSON("/planetLHL/resources").then(data => {
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
                  window.location.reload(true)
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
                  window.location.reload(true)
                  console.log("login successful")
                 }
      });
      $(this).trigger('reset')
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

function renderResources(resources) {
   $('.row').empty();

   resources.sort((a, b) => a.created_at.localeCompare(b.created_at));

   resources.forEach(function(resource){
      let $resource = createResourceElement(resource);
      $('.row').prepend($resource);
   });
    attachLikes();
    attachRating();
    showOneResource();
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
                      <button type="button" class="btn btn-sm btn-outline-secondary buttonView" name="${resource.id}">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary"><a target="_blank" rel="noopener noreferrer" href="${resource.resource_url}">Visit</a></button>
                      <button type="button" class="btn btn-sm btn-outline-secondary buttonLike" name="${resource.id}">Like</button>
                      <div class="dropdown">
                      <button type="button" class="btn btn-sm btn-outline-secondary buttonRate">Rate</button>
                        <div class="dropdown-content">
                          <form class="newRatingForm" name="${resource.id}">
                            <textarea class="UserRating" name="UserRate"></textarea>
                            <input class="postRating"  type="submit" value="Rate!">
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

function renderOneResources(resources) {
   $('.row').empty();
   console.log("ONE RESOURCE IS ", $('#oneResource'))

      resources.forEach(function(resource){
      console.log('comment:',resource.comment)
      if (resource.comment === undefined){
        resource.comment = 'no comments available';
        resource.users_name = '';
        console.log(resource.comment)
      }
      let $resource = createOneUserElement(resource);
      $('.resourceContainer').prepend($resource);
   });

    attachLikes();
    attachComment();
}

function createOneUserElement(resource){

  let newScript = `
        <main role="main">
          <div class="album py-5">
            <div class="container">
            <div class="row tileView">
            <div class="col">
             <div class="card sm-2 shadow-sm">
                <img class="card-img-top imageView" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x300]" display: block;" src=${resource.image_url} data-holder-rendered="true">

                <div class="card-body cardView">
                  <p class="card-text cardTitleView"> Title: ${resource.title}</p>
                  <section class="comment-container">
                    <p class="card-text cardDescrView"> Description: ${resource.description} </p>
                  </section>
                  <section class="comment-container">
                    <p class="card-text cardCommentView"> Comments: ${resource.comment} </p>
                  </section>
                </div>
                <div class="btn-group btnGroupView">
                  <div class="dropdown">
                  <button type="button" class="btn btn-sm btn-outline-secondary buttonComment">Comment</button>
                    <div class="dropdown-content">
                      <form class="newCommentForm" >
                        <textarea class="UserComment" name="UserComment"></textarea>
                        <input class="postComment" type="submit" value="Comment!">
                      </form>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-secondary">Visit</button>
                  </div>
                </div>

              </div>
            </div>
            </div>
            </div>
          </div>
        </main>`

  return newScript
}

function showOneResource(){

    $(".buttonView").on('click', function(){
      console.log('click')
    let resourceId = $(this).attr("name")

    event.preventDefault();
  $.ajax({
           method: "GET",
           url: `/planetLHL/resources/${resourceId}`
         }).done((users) => {
         //console.log('app:',)
         console.log( 'users',users)
          // console.log("This is one html element : " , createOneUserElement(users));
          renderOneResources(users)
         console.log( 'users',users)


  });
       });
}

function attachComment() {
  $(".newCommentForm").on('submit', function(){

    let resourceId = $(this).attr("name") // Need this to be attached on the single rendered resource
    console.log(resourceId)
    let userComment = $(this).children(".UserComment").val()
    event.preventDefault();
      //Sends Ajax Request
        $.ajax({
                  url: `planetLHL/resources/${resourceId}/comments`,
                  type: `POST`,
                  data:{
                        resourceId: `${resourceId}`,
                        comment: `${userComment}`
                      },
                  success: function(result) {
                   $.getJSON("/planetLHL/resources/:id/comments").then((result) => {
                   renderOneResources(result)
                 })
                 }
        });
  });
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
                  $.getJSON("/planetLHL/resources").then((result) => {

                    renderResources(result)


                  })
                 }
        });
  });
}

function attachRating() {
  $(".newRatingForm").on('submit', function(){
    let resourceId = $(this).attr("name")
    let userRating = parseInt($(this).children(".UserRating").val(), 10)
    event.preventDefault();
      //Sends Ajax Request
      if (userRating >= 1 && userRating <= 5) {
        $.ajax({
                  url: `planetLHL/resources/${resourceId}/rating`,
                  type: `POST`,
                  data:{
                        resourceId: `${resourceId}`,
                        rating: `${userRating}`
                      },
                  success: function(result) {
                  $.getJSON("/planetLHL/resources").then((result) => {
                    renderResources(result)
                  })
                 }
        });
      } else {
        console.log("Rating has to be between 1 and 5")
      }
  });
}


//This File THE URL Points to Server.js actual url
