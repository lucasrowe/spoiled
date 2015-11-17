chrome.storage.local.get(['spoilerterms'], function(result) {
  if (!result.spoilerterms)
    return;

  var items = document.getElementsByTagName("p");
  replaceItemsWithMatchingText (items, result.spoilerterms, "[text overridden by Spoiled]");

  items = document.getElementsByTagName("a");
  replaceItemsWithMatchingText (items, result.spoilerterms, "[link overridden by Spoiled]");

  items = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
  replaceItemsWithMatchingText (items, result.spoilerterms, "[text overridden by Spoiled]");

  items = document.getElementsByTagName("span");
  replaceItemsWithMatchingText (items, result.spoilerterms, "[text overridden by Spoiled]");
});

function replaceItemsWithMatchingText(items, spoilerTerms, replaceString)
{
  for (var i = items.length; i--;) {
    for (var j = 0; j < spoilerTerms.length; j++) {
      var regex = new RegExp(spoilerTerms[j], "i");
      if (regex.test (items[i].innerHTML)) {
        items[i].className += " hidden-spoiler";
        items[i].innerHTML = replaceString;
      }
    }
  }
}
