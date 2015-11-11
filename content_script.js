chrome.storage.local.get(['spoilerterms'], function(result) {
  if (!result.spoilerterms)
    return;

  var items = document.getElementsByTagName("p");
  for (var i = items.length; i--;) {

    for (var j = 0; j < result.spoilerterms.length; j++) {
      if (items[i].innerHTML.indexOf(result.spoilerterms[j]) != -1) {
        items[i].className += " hidden-spoiler";
        items[i].innerHTML = "TEXT OVERRIDDEN BY SPOILER SPOILER";
      }
    }
  }
});
