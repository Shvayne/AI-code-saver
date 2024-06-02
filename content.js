document.addEventListener('click', function(e) {
    /*
    check if the clicked element is a button
    and its text contains "copy code"
    */
    if (e.target && e.target.tagName === 'BUTTON' && /copy code/i.test(e.target.innerText))
        {
        //find the snippet within the closet container
        let codeSnippet = '';
        let parent = e.target.closest('div, section, article');
        if (parent){
            let codeElement = parent.querySelector('pre, code');
            if(codeElement){
                codeSnippet = codeElement.innerText;
            }
        }
        //send a message to the background script with the code snippet
        if (codeSnippet){
            chrome.runtime.sendMessage({ action: "copyCode", code: codeSnippet });
        }
    }
}, false);