
 $(document).ready(function() {

  searchResources();
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

//SEARCH REQUEST ENDPOINT


function searchResources() {
  var $form = $('#searchForm');
    $form.on('submit', function (event) {
      console.log("IVE BEEN CLICKED")
      event.preventDefault();
      let search = $(this).children('.tweeterText').val()
      const safeSearch = escape(search); //Creates safe html from form input
      $(this).children('.tweeterText').val(safeSearch);
      let safeHTML = $(this).serialize();
      console.log(safeHTML)

      $.ajax({
        method: "GET",
        url: `/planetLHL/results/${safeHTML}`,
        success: function(result) {
                  console.log("send successfully")
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
