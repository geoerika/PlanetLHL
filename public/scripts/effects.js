$(document).ready(function() {

  $(".Register").click(function(){
    $(".loginForm").hide();
    $(".createForm").hide();
    $(".searchForm").hide();
    $(".registerForm").slideToggle(1000);
  });

  $(".Login").click(function(){
    $(".registerForm").hide();
    $(".createForm").hide();
    $(".searchForm").hide();
    $(".loginForm").slideToggle(1000);
  });

  $(".Create").click(function(){
    $(".registerForm").hide();
    $(".loginForm").hide();
    $(".searchForm").hide();
    $(".createForm").slideToggle(1000);
  });

    $(".Search").click(function(){
      $(".registerForm").hide();
      $(".loginForm").hide();
      $(".createForm").hide();
      $(".searchForm").slideToggle(1000);

    let myResVis = $(".myResources").is(":visible");
    let myLikeVis = $(".myLikes").is(":visible");

    if (!myResVis && !myLikeVis){
      $(".searchFormAlerts1").show();
      $(".searchFormAlerts2").hide();
      $(".searchFormAlerts3").hide();
    } else if(myResVis) {
      $(".searchFormAlerts2").show();
      $(".searchFormAlerts1").hide();
      $(".searchFormAlerts3").hide();
    } else if (myLikeVis) {
      $(".searchFormAlerts3").show();
      $(".searchFormAlerts1").hide();
      $(".searchFormAlerts2").hide();
    }

    });

    $(".pageLinkLiked").click(function(){
      $(".myResources").hide();
      $(".myLikes").slideToggle(1000);

      $(".searchFormAlerts1").hide();
      $(".searchFormAlerts2").hide();
      $(".searchFormAlerts3").show();
    });

  $(".pageLinkCreated").click(function(){
    $(".myLikes").hide();
    $(".myResources").slideToggle(1000);

    $(".searchFormAlerts1").hide();
    $(".searchFormAlerts2").show();
    $(".searchFormAlerts3").hide();
  });

  $(".registerForm").hide();

  $(".loginForm").hide();

  $(".createForm").hide();

  $(".searchForm").hide();

});
