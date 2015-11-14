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

  if (newTerm == "") {
    return;
  }

  terms.push(newTerm);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
    document.getElementById('spoiler-textfield').value = "";
  });
}

function removeAllTerms() {
  terms = [];
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
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
  if (terms.length == 0) {
    return;
  } else {
    document.getElementById ("empty-list").remove();
  }

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

    var deleteBtn = document.createElement('button');
    entry.appendChild(deleteBtn);
  }
}

function main() {
  if (window.localStorage == null) {
    alert("LocalStorage must be enabled for changing options.");
    document.getElementById('spoiler-textfield').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('delete-all-btn').disabled = true;
    return;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  getSpoilerTerms ();
  document.querySelector('#submit-btn').addEventListener('click', submitSpoiler);
  document.querySelector('#delete-all-btn').addEventListener('click', removeAllTerms);
});
