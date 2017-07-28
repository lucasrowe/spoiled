var navBar = $("nav");
$(window).scroll(function(){

  // If below certain point on screen
  if($(window).scrollTop() >= 750) {
    if (navBar.hasClass("fadeOutUp")) {
      navBar.addClass("fadeInDown");
      navBar.removeClass("fadeOutUp");
      navBar.removeClass("hidden");
    }
  } else {
    navBar.removeClass("fadeInDown");
    navBar.addClass("fadeOutUp");
  }
});
