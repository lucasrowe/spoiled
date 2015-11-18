var cachedTerms = []
var elementsWithInnerHTMLToSearch = "a, p, h1, h2, h3, h4, h5, h6, i, em, strong";
var containerElements = "span, div, li, th, td, dt, dd";

chrome.storage.sync.get(['spoilerterms'], function(result) {
  if (!result.spoilerterms)
    return;
  cachedTerms = result.spoilerterms;

  // Find any images
  items = document.querySelectorAll('img');
  applyBlurCSSToMatchingImages (items, result.spoilerterms);

  // Search innerHTML elements first
  items = document.querySelectorAll(elementsWithInnerHTMLToSearch)
  replaceItemsWithMatchingText (items, result.spoilerterms, "[text overridden by Spoiled]");

  // Now find any container elements that have just text inside them
  items = findContainersWithTextInside (document);
  if (items && items.length != 0) {
    replaceItemsWithMatchingText (items, result.spoilerterms, "[text overridden by Spoiled]");
  }
});

function replaceItemsWithMatchingText(items, spoilerTerms, replaceString) {
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

function findContainersWithTextInside (target) {
  var containerNodes = target.querySelectorAll(containerElements);
  var emptyNodes = [];
  for (var i = 0; i < containerNodes.length; i++) {
    if (containerNodes[i].childNodes.length == 0 || containerNodes[i].childNodes[0].nodeType == 3) {
      emptyNodes.push(containerNodes[i]);
    }
  }
  return emptyNodes;
}

function applyBlurCSSToMatchingImages(items, spoilerTerms) {
  for (var i = 0; i < items.length; i++) {
    for (var spoilerIndex = 0; spoilerIndex < spoilerTerms.length; spoilerIndex++) {
      var regex = new RegExp(spoilerTerms[spoilerIndex], "i");
      if (regex.test (items[i].title) || regex.test (items[i].alt ||
      regex.test (items[i].src) || regex.test (items[i].name))) {
        items[i].className += " blurred";
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
      replaceItemsWithMatchingText (newNodes, cachedTerms, "[text overridden by Spoiled]");

      newNodes = findContainersWithTextInside (mutations[i].target);
      replaceItemsWithMatchingText (newNodes, cachedTerms, "[text overridden by Spoiled]");
    }
});

// configuration of the observer:
var config = { attributes: true, subtree: true }

// turn on the observer...unfortunately we target the entire document
observer.observe(document, config);

// disconnecting likely won't work since we need to continuously watch
// observer.disconnect();
