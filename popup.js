document.getElementById('save-current-tab').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'saveCurrentTab'});
});

document.getElementById('save-all-tabs').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'saveAllTabs'});
});

document.getElementById('show-reading-list').addEventListener('click', () => {
    chrome.tabs.create({url: 'readingList.html'});
});
