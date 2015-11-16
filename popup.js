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

  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  // Create a container for our terms list
  var container = document.getElementById("spoiler-list-container");
  var newList = document.createElement('ul');
  newList.id = "spoiler-list";
  container.appendChild (newList);

  // Popuplate our list of terms
  for (var i = 0; i < terms.length; i++) {
    // Create our list item
    var listItem = document.createElement('li');

    // First insert the delete button
    var deleteBtn = document.createElement('a');
    deleteBtn.title = "delete term";
    deleteBtn.className = "flat-button";
    var deleteIcon = document.createElement('i');
    deleteIcon.className = "red delete-btn";
    deleteIcon.innerHTML = "X";
    deleteBtn.appendChild(deleteIcon);
    listItem.appendChild(deleteBtn);

    // Insert our term
    var newTerm = document.createTextNode(terms[i]);
    listItem.appendChild(newTerm);

    newList.appendChild(listItem);
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
  document.querySelector('#spoiler-textfield').focus ();
  document.querySelector('#submit-btn').addEventListener('click', submitSpoiler);
  document.querySelector('#delete-all-btn').addEventListener('click', removeAllTerms);
});
