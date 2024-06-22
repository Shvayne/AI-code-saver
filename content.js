function addCopyButton(codeElement){
    //check if a button with text "copy code" already exists on page
    let sibling = codeElement.nextElementSibling;
    let buttonExists = false;
    while(sibling) {
        if (sibling.tagName === 'BUTTON' && sibling.innerText.toLowerCase() === 'copy code') {
            buttonExists = true;
            //call the handler if it exists
            sibling.addEventListener('click', handleButtonClick);
        }
        sibling = sibling.nextElementSibling;
    }

    if (!buttonExists) {
        //ensure code snippet is at least 3 lines long
        let codeLines = codeElement.innerText.split('\n');
        if (codeLines.length < 3) {
            return;
        }
        // create the button
        let button = document.createElement('button');
        button.innerText = 'Copy code';
        button.classList.add('copy-code-button');
        button.style.marginTop = '10px';
        button.style.display = 'inline';

        //insert the button after the code element
        codeElement.parentNode.insertBefore(button, codeElement.nextSibling);
        // add an event listener to the newly created button
        button.addEventListener('click', handleButtonClick);
    }
}

// function to handle click events on "copy code buttons"
function handleButtonClick(event){
    if (event.target && event.target.tagName === 'BUTTON' && event.target.innerText.toLowerCase() === 'copy code'){
        console.log("Copy Code button clicked");
        let codeElement = event.target.previousElementSibling;
        let codeSnippet = codeElement ? codeElement.innerText : '';
        console.log("Extracted code snippet:", codeSnippet);

        if (codeSnippet){
            let userConfirmed = confirm("Do you want to save this code to a file?");
            if (userConfirmed){
                let filename = prompt("input the filename here. (eg: index.html)");

                if (filename){
                    //create a data URL for the code snippet
                    let dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(codeSnippet);

                    //send the data URL and filename to background script
                    chrome.runtime.sendMessage({
                        action: "copyCode",
                        dataUrl: dataUrl,
                        filename: filename
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.error(chrome.runtime.lastError.message);
                        } else {
                            console.log("Download response: ", response);
                        }
                    });
                } else {
                    console.log("Filename input was cancelled or empty");
                }
            } else {
                console.log("User cancelled the save confirmation");
            }
        }
    }
}

//initialize mutation observer

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (node.tagName === 'PRE' || node.tagName === 'CODE')){
                addCopyButton(node);
            }else if (node.nodeType === 1){
                // check if any child nodes are code snippets
                node.querySelectorAll('pre, code').forEach((childNode) => {
                    addCopyButton(childNode);
                });
            }
        });
    });
});

//start observing document body for added nodes
observer.observe(document.body, { childList: true, subtree: true});

//add event listener for button clicks
document.addEventListener('click', handleButtonClick, false);

//initial scan for existing code elements
document.querySelectorAll('pre, code').forEach((codeElement) => {
    addCopyButton(codeElement);
});

//function to save selected text as code snippet
function saveSelectedText(text) {
    if (text.length > 0) {
        let userConfirmed = confirm("Do you want to save the selected text? ");
        if (userConfirmed) {
            let filename = prompt("input the filename here (e.g myFile.txt)");
            if (filename){
                let dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
                chrome.runtime.sendMessage({
                    action: "copyCode",
                    dataUrl: dataUrl,
                    filename: filename
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message)
                    } else {
                        console.log("Download response: ", response);
                    }
                });

            } else {
                console.log("filename input was cancelled or empty");
            }
        } else {
            console.log("User cancelled the save confirmation");
        }
    }
}

// add event listener for copy event to save selected text
document.addEventListener('copy', (event) => {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        setTimeout(() => saveSelectedText(selectedText), 0);
    }
});