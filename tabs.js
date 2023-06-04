import { api } from "./storage.js"

async function saveTab(tab) {
    await api.saveToReadingList(tab)
}

export async function saveCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, async tabs => {
        const tab = tabs[0];
        await saveTab(tab);
        chrome.tabs.remove(tab.id);
    });
}

export async function openReadingList() {
    const readingListURL = chrome.runtime.getURL("readingList.html");
    await chrome.tabs.create({ url: readingListURL });
}

export async function saveAllTabs() {
    const tabs = await chrome.tabs.query({currentWindow: true});
    // openReadingList()
    for (const tab of tabs) {
        if (!tab.url.startsWith("chrome-extension://") && !tab.url.startsWith("chrome://")) {
            await saveTab(tab);
            chrome.tabs.remove(tab.id);
        }
    }
}