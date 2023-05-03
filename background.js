function saveTab(tab, readingList) {
    const pageData = {
        title: tab.title,
        url: tab.url,
        favicon: tab.favIconUrl,
        time: new Date().getTime()
    };

    console.log(`Saving ${JSON.stringify(pageData)}`)

    readingList.push(pageData);

    // Update the storage with the new list
    chrome.storage.local.set({readingList});
}

async function saveCurrentTab() {
    const readingList = await getReadingList()

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const tab = tabs[0];
        saveTab(tab, readingList);
        chrome.tabs.remove(tab.id);
    });
}

async function saveAllTabs() {
    const readingList = await getReadingList()
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            saveTab(tab, readingList);
            chrome.tabs.remove(tab.id);
        });
    });
}

async function getReadingList() {
    const data = await chrome.storage.local.get('readingList')
    console.log(`Initialized: ${JSON.stringify(data)}`)
    return data.readingList || []
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if(request.action === 'saveCurrentTab') {
        await saveCurrentTab();
    } else if(request.action === 'saveAllTabs') {
        await saveAllTabs();
    }
});