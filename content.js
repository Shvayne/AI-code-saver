console.log("loaded content scipt");
function addCopyButton(codeElement){
    //check if the button already exists
    if (codeElement.nextElementSibling && codeElement.nextElementSibling.classList.contains('copy-code-button')){
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
}

// function to handle click events on "copy code buttons"
function handleButtonClick(event){
    if (event.target && event.target.tagName === 'BUTTON' && event.target.innerText === 'Copy code'){
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