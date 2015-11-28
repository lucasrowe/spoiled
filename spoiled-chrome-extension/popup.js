// For now use local but eventually we'll want some syncing
var storage = chrome.storage.sync;
var terms = [];

function addTerm () {
  // Save it using the Chrome extension storage API.
  var newTerm = document.getElementById('spoiler-textfield').value;
  document.getElementById('spoiler-textfield').value = "";

  if (newTerm == "") {
    return;
  }
  document.querySelector('#add-btn').disabled = true;

  terms.push(newTerm);
  storage.set({'spoilerterms': terms}, function() {
    if (chrome.runtime.error) {
      console.log("Runtime error.");
    }
    generateTermsList (terms);
  });
}

function removeTerm (deleteBtn)
{
  terms.splice (deleteBtn.id, 1);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsList (terms);
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
    });
}

function generateTermsList(terms) {
  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }


  if (!terms || terms.length == 0) {
    // If it's empty, just add a placeholder tip for the user
    showTipBlock (true);
  } else {
    showTipBlock (false);

    // Start popuplating the list
    var newList = document.createElement('ul');
    newList.id = "spoiler-list";
    newList.className = "spoiler-list";
    // Find our container for our terms list
    document.getElementById("spoiler-list-container").appendChild (newList);

    // Popuplate our list of terms in reverse order so people see their word added
    for(var i=terms.length-1; i >= 0; i--){
      newList.appendChild(generateListItem (i));
    }
  }
}

function showTipBlock(show) {
  var emptyTip = document.getElementById("empty-tip");
  if (show) {
    emptyTip.style.display = "block";
  } else {
    emptyTip.style.display = "none";
  }
}

function generateListItem (index) {
    // Create our list item
    var listItem = document.createElement('li');
    listItem.className = "spoiler-item";

    // Create our delete button
    var deleteBtn = createDeleteButton (index);
    listItem.appendChild(deleteBtn);

    // Insert the term into the list
    var newTerm = document.createElement('span');
    newTerm.className = " search-term";
    newTerm.innerHTML = terms[index];
    listItem.appendChild(newTerm);

    return listItem;
}

function createDeleteButton (index) {
  // Create the button itself
  var deleteBtn = document.createElement('a');
  deleteBtn.title = "Delete";
  deleteBtn.className = "red delete-btn grey-until-hover hover-red";
  deleteBtn.id = index;

  // Create our delete button icon
  var deleteIcon = document.createElement('i');
  deleteIcon.className = "material-icons md-inactive md-24";
  deleteIcon.innerHTML = "highlight_off";
  deleteBtn.appendChild(deleteIcon);

  // Add our removal event
  deleteBtn.addEventListener('click', function() {
    removeTerm(deleteBtn);
  });

  return deleteBtn;
}

function addTermEnter () {
  if (event.keyCode == 13) {
    addTerm ();
  }
  if (document.querySelector('#spoiler-textfield').value.length == 0) {
    document.querySelector('#add-btn').disabled = true;
  } else {
    document.querySelector('#add-btn').disabled = false;
  }
}

// SHOW POP-OVER
function showPopOver() {
	document.getElementById("help-popover").style.display = "block";
  document.getElementById("help-popover-background").style.display = "block";
  document.querySelector(".onoffContainer").style.display = "none";
}

// CLOSE POP-OVER
function closePopOver(divID) {
	document.getElementById("help-popover").style.display = "none";
  document.getElementById("help-popover-background").style.display = "none";
  document.querySelector(".onoffContainer").style.display = "block";
}

// On / Off Switch
function clickOnOff() {
  var isOn = document.getElementById('onoffswitch').checked;
  storage.set({'isOn': isOn}, function() {
    refreshOnOffViews(isOn);
    chrome.tabs.reload();
  });
}

function getOnOffPreferences() {
  storage.get('isOn', function(result) {
    // Default isOn to true
    if (result.isOn == null) {
      result.isOn = true;
    }
    refreshOnOffViews(result.isOn);
  });
}

function refreshOnOffViews(isOn) {
  if (!isOn) {
    var spoilerList = document.getElementById("spoiler-list-container");
    if (spoilerList) {
      spoilerList.display = "none";
    }
    var blockingOff = document.getElementById("blockingOffTip");
    blockingOff.style.display = "block";
  } else {
    var spoilerList = document.getElementById("spoiler-list-container");
    if (spoilerList) {
      spoilerList.display = "block";
    }
    var blockingOff = document.getElementById("blockingOffTip");
    blockingOff.style.display = "none";
  }
  document.getElementById('onoffswitch').checked = isOn;
}

function main() {
  getOnOffPreferences ();
  getSpoilerTerms ();
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  document.querySelector('#spoiler-textfield').focus ();
  document.querySelector('#add-btn').addEventListener('click', addTerm);
  document.querySelector('#add-btn').disabled = true;
  document.querySelector('#spoiler-textfield').addEventListener("keyup", addTermEnter);
  document.querySelector('#delete-all-btn').addEventListener('click', removeAllTerms);
  document.querySelector('#help-icon').addEventListener('click', showPopOver);
  document.querySelector('#help-popover-background').addEventListener('click', closePopOver);
  document.querySelector('#onoffswitch').addEventListener('click', clickOnOff);
});
