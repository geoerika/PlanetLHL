
 $(document).ready(function() {

  searchResources();
  createNewResource();
});



// THIS IS A GET TO THE HOMEPAGE
$(() => {
  $.ajax({
    method: "GET",
    url: "/planetLHL"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
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

// function cleanTextbox(textbox, id) { //Creates safe html from form input
//       const safeText = escape(textbox);
//       $('#newCreateForm').children(`#${id}`).val(safeText);
//       let saferText = $('#newCreateForm').children(`#${id}`).val(safeText).serialize();
//       return saferText

// }


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
                  console.log("This is where renderResources will be called")
                  $.getJSON("/planetLHL/create").then(data => {
                    renderResources(data);
                  })
                 }
      });
      $(this).trigger('reset')
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
                  console.log("sent successfully")
                 }
      })
    })
}

function renderResources(data) {
  console.log("DATA IS: ", data)
}

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



//This File THE URL Points to Server.js actual url
