let readingList = [];

function saveTab(tab) {
    const pageData = {
        title: tab.title,
        url: tab.url,
        favicon: tab.favIconUrl,
        time: new Date().getTime()
    };

    console.log(`Saving ${JSON.stringify(pageData)}`)

    readingList.push(pageData);

    // Update the storage with the new list
    chrome.storage.local.set({readingList: readingList});
}

function saveCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const tab = tabs[0];
        saveTab(tab);
        chrome.tabs.remove(tab.id);
    });
}

function saveAllTabs() {
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            saveTab(tab);
            chrome.tabs.remove(tab.id);
        });
    });
}

// Initialize the reading list from storage
chrome.storage.local.get('readingList', data => {
    console.log(`Initializing: ${JSON.stringify(data)}`)
    readingList = data.readingList || [];
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === 'saveCurrentTab') {
        saveCurrentTab();
    } else if(request.action === 'saveAllTabs') {
        saveAllTabs();
    }
});