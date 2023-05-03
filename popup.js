document.getElementById('save-current-tab').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'saveCurrentTab'});
});

document.getElementById('save-all-tabs').addEventListener('click', () => {
    chrome.runtime.sendMessage({action: 'saveAllTabs'});
});

document.getElementById('show-timeline-view').addEventListener('click', () => {
    chrome.tabs.create({url: 'timeline.html'});
});

document.getElementById('show-priority-view').addEventListener('click', () => {
    chrome.tabs.create({url: 'priority.html'});
});