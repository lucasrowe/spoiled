var cachedTerms = []
var elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6, i, em, strong";
var containerElements = "span, div, li, th, td, dt, dd";

chrome.storage.sync.get(['spoilerterms'], function(result) {
  if (!result.spoilerterms)
    return;
  cachedTerms = result.spoilerterms;

  // Search innerHTML elements first
  nodes = document.querySelectorAll(elementsWithTextContentToSearch)
  replacenodesWithMatchingText (nodes, result.spoilerterms, "[text overridden by Spoiled]");

  // Now find any container elements that have just text inside them
  nodes = findContainersWithTextInside (document);
  if (nodes && nodes.length != 0) {
    replacenodesWithMatchingText (nodes, result.spoilerterms, "[text overridden by Spoiled]");
  }
});

function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
  for (var i = nodes.length; i--;) {
    for (var j = 0; j < spoilerTerms.length; j++) {
      if (compareForSpoiler (nodes[i], spoilerTerms[j])) {
        nodes[i].className += " hidden-spoiler";
        nodes[i].textContent = replaceString;
        blurNearestChildrenImages(nodes[i]);
      }
    }
  }
}

function compareForSpoiler (nodeToCheck, spoilerTerm) {
  var regex = new RegExp(spoilerTerm, "i");
  return regex.test (nodeToCheck.textContent);
}

function blurNearestChildrenImages (nodeToCheck) {
  // Traverse up a level and look for images, keep going until either
  // an image is found or the top of the DOM is reached.
  // This has a known side effect of blurring ALL images on the page
  // if an early spoiler is found, but ideally will catch the nearest images
  var nextParent = nodeToCheck;
  var childImages;
  var maxIterations = 5;
  var iterationCount = 0;
  do {
    nextParent = nextParent.parentNode;
    childImages = nextParent.parentNode.querySelectorAll('img');
    iterationCount++;
  } while (nextParent && childImages.length == 0 && iterationCount < maxIterations)

  // Now blur all of those images found under the parent node
  if (childImages && childImages.length > 0) {
    for (var imageIndex = 0; imageIndex < childImages.length; imageIndex++) {
      childImages[imageIndex].className += " blurred";
      childImages[imageIndex].parentNode.style.overflow = "hidden";
    }
  }
}

function findContainersWithTextInside (targetNode) {
  var containerNodes = targetNode.querySelectorAll(containerElements);
  var emptyNodes = [];
  for (var i = 0; i < containerNodes.length; i++) {
    var containerChildren = containerNodes[i].childNodes;
    for (var childIndex = 0; childIndex < containerChildren.length; childIndex++) {
      if (containerChildren[childIndex].textContent) {
        emptyNodes.push(containerChildren[childIndex].parentNode);
      }
    }
  }
  return emptyNodes;
}

function applyBlurCSSToMatchingImages(nodes, spoilerTerms) {
  for (var i = 0; i < nodes.length; i++) {
    for (var spoilerIndex = 0; spoilerIndex < spoilerTerms.length; spoilerIndex++) {
      var regex = new RegExp(spoilerTerms[spoilerIndex], "i");
      if (regex.test (nodes[i].title) || regex.test (nodes[i].alt ||
      regex.test (nodes[i].src) || regex.test (nodes[i].name))) {
        nodes[i].className += " blurred";
        nodes[i].parentNode.style.overflow = "hidden";
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
      var newNodes = mutations[i].target.querySelectorAll (elementsWithTextContentToSearch);
      replacenodesWithMatchingText (newNodes, cachedTerms, "[text overridden by Spoiled]");

      newNodes = findContainersWithTextInside (mutations[i].target);
      replacenodesWithMatchingText (newNodes, cachedTerms, "[text overridden by Spoiled]");
    }
});

// configuration of the observer:
var config = { attributes: true, subtree: true }

// turn on the observer...unfortunately we target the entire document
observer.observe(document, config);

// disconnecting likely won't work since we need to continuously watch
// observer.disconnect();
