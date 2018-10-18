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
    $(".createForm").hide();
    $(".searchForm").hide();
    $(".createForm").slideToggle(1000);
  });

    $(".Search").click(function(){
      $(".registerForm").hide();
      $(".loginForm").hide();
      $(".createForm").hide();
      $(".searchForm").slideToggle(1000);
    });

$(".registerForm").hide();

$(".loginForm").hide();

$(".createForm").hide();

$(".searchForm").hide();

});
