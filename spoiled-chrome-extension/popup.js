var storage = chrome.storage.sync;
var terms = [];
var snoozeTime = 1000 * 60 * 10;

function addTermToList () {
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
    generateTermsListHTML (terms);
  });
}

function removeTermFromList (deleteBtn)
{
  terms.splice (deleteBtn.id, 1);
  storage.set({'spoilerterms': terms}, function() {
    generateTermsListHTML (terms);
  });
}

function getSpoilerTerms() {
  storage.get(['spoilerterms'], function(result) {
      // Nothing to change.
      if (!result.spoilerterms)
        return;

      terms = result.spoilerterms;
      generateTermsListHTML (terms);
    });
}

function generateTermsListHTML(terms) {
  // Refresh the list if it exists
  var oldList = document.getElementById("spoiler-list");
  if (oldList) {
    oldList.remove();
  }

  if (!terms || terms.length == 0) {
    // If it's empty, just add a placeholder tip for the user
    showEmptyListBlock (true);
    document.querySelector('#snooze-btn').disabled = true;
  } else {
    showEmptyListBlock (false);
    document.querySelector('#snooze-btn').disabled = false;

    // Start popuplating the list
    var newList = document.createElement('ul');
    newList.id = "spoiler-list";
    newList.className = "spoiler-list";
    // Find our container for our terms list
    document.getElementById("spoiler-list-container").appendChild (newList);

    // Popuplate our list of terms in reverse order so people see their word added
    for(var i=terms.length-1; i >= 0; i--) {
      newList.appendChild(generateListItem (i));
    }
  }
}

// CONDITIONAL HTML (List, Empty Block, etc.)

function showEmptyListBlock(show) {
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
    removeTermFromList(deleteBtn);
  });

  return deleteBtn;
}

function addTermToListEnter () {
  if (event.keyCode == 13) {
    addTermToList ();
  }
  if (document.querySelector('#spoiler-textfield').value.length == 0) {
    document.querySelector('#add-btn').disabled = true;
  } else {
    document.querySelector('#add-btn').disabled = false;
  }
}

// POP-OVER HELP

function clickHelpPopoverIcon() {
  var tintedBackground = document.querySelector('#help-popover-background');
  tintedBackground.addEventListener('click', closePopOver);
  document.querySelector('#snooze-btn').addEventListener('click', closePopOver);
  tintedBackground.style.display = "block";
	document.getElementById("help-popover").style.display = "block";
}

function closePopOver(divID) {
  var tintedBackground = document.querySelector('#help-popover-background');
  tintedBackground.removeEventListener('click', closePopOver);
  document.querySelector('#snooze-btn').removeEventListener('click', closePopOver);
  tintedBackground.style.display = "none";
  document.getElementById("help-popover").style.display = "none";
}

// SNOOZE BEHAVIOR

function displaySnoozeScreen(snoozeOn, timeToUnsnooze) {
  if (snoozeOn) {
    document.getElementById("snoozing-text").style.display = "block";
    // Set the "until X:XX PM string"
    var unsnoozeTime = new Date(timeToUnsnooze);
    var str = "until " + stripSecondsFromTimeString(unsnoozeTime.toLocaleTimeString());
    document.querySelector(".snooze-time-remaining").innerHTML = str;
  } else {
    document.querySelector(".snooze-text").style.display = "none";
  }
  showBackgroundTint(snoozeOn);
  toggleSnoozeButton(!snoozeOn);
}

function stripSecondsFromTimeString (timeString) {
  var splitTime = timeString.split(":");
  var strippedTime = splitTime[0] + ":" + splitTime[1];
  var strippedAMPM = splitTime[2].split(" ")[1];
  return strippedTime + " " + strippedAMPM;
}

function showBackgroundTint(doShow) {
  if (doShow) {
    document.querySelector(".modal-background").style.display = "block";
  } else {
    document.querySelector(".modal-background").style.display = "none";
  }
}

function clickSnooze(snoozeOn) {
  setSnoozePrefs(snoozeOn)

  // Always refresh the page. Either the user wants content hidden now
  // (snooze) or revealed (unsnooze)
  chrome.tabs.reload();
}

function setSnoozePrefs(snoozeOn) {
  var timeToUnsnooze = new Date().getTime() + snoozeTime
  storage.set({'isSnoozeOn': snoozeOn, 'timeToUnsnooze': timeToUnsnooze},
    function() {
      if (chrome.runtime.error) {
        console.log("Runtime error.");
      }
    displaySnoozeScreen(snoozeOn, timeToUnsnooze);
  });
}

function getSnoozePrefs() {
  storage.get(['isSnoozeOn', 'timeToUnsnooze'], function(result) {
    // Default isSnoozeOn to false
    if (result.isSnoozeOn == null) {
      result.isSnoozeOn = false;
    }

    // Display the snooze screen (or turn snooze off)
    if (result.isSnoozeOn && isSnoozeTimeUp(result.timeToUnsnooze)) {
      // Time is up, turn off snooze
      setSnoozePrefs(false);
    } else {
      displaySnoozeScreen(result.isSnoozeOn, result.timeToUnsnooze);
    }
  });
}

function isSnoozeTimeUp(timeToUnsnooze) {
  var now = new Date();
  var isPastSnoozeTime = now.getTime() > timeToUnsnooze;
  return isPastSnoozeTime;
}

function toggleSnoozeButton(doShow) {
  var snoozeBtn = document.getElementById("snooze-btn");
  var unSnoozeBtn = document.getElementById("unsnooze-btn");

  if (doShow) {
    snoozeBtn.style.display = "block";
    unSnoozeBtn.style.display = "none";
  } else {
    snoozeBtn.style.display = "none";
    unSnoozeBtn.style.display = "block";
  }
}

// MAIN

function main() {
  getSpoilerTerms ();
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  getSnoozePrefs();
  document.querySelector('#spoiler-textfield').focus ();
  document.querySelector('#add-btn').addEventListener('click', addTermToList);
  document.querySelector('#add-btn').disabled = true;
  document.querySelector('#spoiler-textfield').addEventListener("keyup", addTermToListEnter);
  document.querySelector('#help-icon').addEventListener('click', clickHelpPopoverIcon);
  document.querySelector('#snooze-btn').addEventListener('click', function() { clickSnooze(true); } );
  document.querySelector('#unsnooze-btn').addEventListener('click', function() { clickSnooze(false); });
});
