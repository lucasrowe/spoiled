
var items = document.getElementsByTagName("p");
for (var i = items.length; i--;) {
    //do stuff
    if (items[i].innerHTML.indexOf("the") != -1) {
      items[i].className += " hidden-spoiler";
      items[i].innerHTML = "TEXT OVERRIDDEN BY SPOILER SPOILER";
    }
}
