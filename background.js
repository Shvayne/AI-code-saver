/*
    WIll handle the message from the content sctipt and prompt the user to save the code snippet.
 */
/*listen for mesages sent from other parts of the extension */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "copyCode"){
        //ask the user to save or not
        let userConfirmed = confirm("Do you want to save this code snippet to a file?");
        let filename = prompt("input the filename here. dont forget to add the extension eg (.html)");

        if (userConfirmed && filename){
            /*
                create a binary large object with the code snippet
                then a url is created for the blob
            */
            let blob = new Blob([message.code], { type: "text/plain"});
            let url = URL.createObjectURL(blob);

            /*use the downloads api to save the file*/
            chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            });
        }
    }
});