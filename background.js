import { getReadingList, setReadingList } from "./storage.js"

function saveTab(tab, readingList) {
    const existingEntryIndex = readingList.findIndex(item => item.url === tab.url);

    if (existingEntryIndex !== -1) {
        readingList[existingEntryIndex].timestamps.push(new Date().getTime());
    } else {
        const pageData = {
            title: tab.title,
            url: tab.url,
            favicon: tab.favIconUrl,
            read: null,
            timestamps: [new Date().getTime()]
        };
        readingList.push(pageData);
    }
    setReadingList(readingList);
}

async function saveCurrentTab() {
    const readingList = await getReadingList()

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        const tab = tabs[0];
        saveTab(tab, readingList);
        chrome.tabs.remove(tab.id);
    });
}

function openReadingList() {
    const readingListURL = chrome.runtime.getURL("readingList.html");
    chrome.tabs.create({ url: readingListURL });
}

async function saveAllTabs() {
    const readingList = await getReadingList()
    const tabs = await chrome.tabs.query({currentWindow: true});
    openReadingList()
    tabs.forEach(tab => {
        if (!tab.url.startsWith("chrome-extension://") && !tab.url.startsWith("chrome://")) {
            saveTab(tab, readingList);
        }
        chrome.tabs.remove(tab.id);
    });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if(request.action === 'saveCurrentTab') {
        await saveCurrentTab();
    } else if(request.action === 'saveAllTabs') {
        await saveAllTabs();
    }
});