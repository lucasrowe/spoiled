document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.executeScript(null, {file: "content_script.js"});
});
