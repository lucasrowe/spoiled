console.log ("POPUP SCRIPT LOADED");

// For now use local but eventually we'll want some syncing
var storage = chrome.storage.local;
var terms = [];

function submitSpoiler(submitButton) {
  if (window.localStorage == null) {
    alert('Local storage is required for changing providers');
    return;
  }
  // Save it using the Chrome extension storage API.
  var newTerm = document.getElementById('spoiler-textfield').value;
  terms.push(newTerm);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
    document.getElementById('spoiler-textfield').value = "";
  });
}

function getSpoilerTerms() {
  storage.get(['spoilerterms'], function(result) {
      // Nothing to change.
      if (!result.spoilerterms)
        return;

      terms = result.spoilerterms;
      generateTermsList (terms);

      console.log (result.spoilerterms);
    });
}

function generateTermsList(terms) {
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  var container = document.getElementById("spoiler-list-container");
  var newList = document.createElement('ul');
  newList.setAttribute ("id", "spoiler-list");
  container.appendChild (newList);

  for (var i = 0; i < terms.length; i++) {
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(terms[i]));
    newList.appendChild(entry);
  }
}

function main() {
  if (window.localStorage == null) {
    alert("LocalStorage must be enabled for changing options.");
    document.getElementById('spoiler-textfield').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    return;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  getSpoilerTerms ();
  document.querySelector('#submit-btn').addEventListener('click', submitSpoiler);
});
