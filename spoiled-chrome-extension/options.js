var storage = chrome.storage.sync;

// Delete all terms
function clickRemoveAllTerms() {
  terms = [];
  var feedback = document.querySelector(".delete-feedback");
  feedback.style.display = "none";
  storage.set({'spoilerterms': terms}, function() {
    feedback.style.display = "block";
  });
}

// Get our stored preferences
function restore_options() {
  storage.get(['spoilerterms'], function(result) {
      // Nothing to change.
      if (!result.spoilerterms)
        return;

      terms = result.spoilerterms;
    });
}

document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.querySelector('#delete-all-btn').addEventListener('click', clickRemoveAllTerms);
});
