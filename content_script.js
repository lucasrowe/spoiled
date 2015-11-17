var cachedTerms = []
var elementsWithInnerHTMLToSearch = "a, p, h1, h2, h3, h4, h5, h6, i, em, strong";

chrome.storage.local.get(['spoilerterms'], function(result) {
  if (!result.spoilerterms)
    return;
  cachedTerms = result.spoilerterms;

  items = document.querySelectorAll(elementsWithInnerHTMLToSearch)
  replaceItemsWithMatchingText (items, result.spoilerterms, "[text overridden by Spoiled]");
});

function replaceItemsWithMatchingText(items, spoilerTerms, replaceString)
{
  for (var i = items.length; i--;) {
    for (var j = 0; j < spoilerTerms.length; j++) {
      var regex = new RegExp(spoilerTerms[j], "i");
      if (regex.test (items[i].innerHTML)) {
        console.log ("replaced: " + items[i].innerHTML);
        items[i].className += " hidden-spoiler";
        items[i].innerHTML = replaceString;
      }
    }
  }
}

// Detecting changed content using Mutation Observers
//
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM%2FMutationObserver
// https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    // console.log(mutations, observer);
    for (var i = 0; i < mutations.length; i++) {
      var newNodes = mutations[i].target.querySelectorAll (elementsWithInnerHTMLToSearch);
      replaceItemsWithMatchingText (newNodes, cachedTerms, "CAUGHT AND HIDDEN");
    }
});

// configuration of the observer:
var config = { attributes: true, subtree: true }

// turn on the observer...unfortunately we target the entire document
observer.observe(document, config);

// disconnecting likely won't work since we need to continuously watch
// observer.disconnect();
