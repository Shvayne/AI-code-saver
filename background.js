/*
    Will handle the message from the content sctipt and prompt the user to save the code snippet.
 */
/*listen for mesages sent from other parts of the extension */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background script: ", message);
    if (message.action === "copyCode") {
        chrome.downloads.download({
            url: message.dataUrl,
            filename: message.filename,
            saveAs: true
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error("Download failed: ", chrome.runtime.lastError.message);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                console.log("Download started with ID:", downloadId);
                sendResponse({ success: true, downloadId: downloadId });
            }
        });
        return true; // Indicate that the response will be sent asynchronously
    }
});