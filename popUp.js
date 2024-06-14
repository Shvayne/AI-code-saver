document.getElementById('save-button').addEventListener('click', function(){
    chrome.runtime.sendMessage( {action: "saveLastSnippet"});
});