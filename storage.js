let currentSubscriber = null;

export async function getReadingList() {
    const { readingList } = await chrome.storage.local.get('readingList');
    return readingList ?? [];
}

export async function setReadingList(readingList) {
    return await chrome.storage.local.set({readingList});
}

export async function subscribeToReadingList(fn) {
    currentSubscriber = fn;
    fn(await getReadingList())
    onLocalStorageChange();
}

function onLocalStorageChange() {
    chrome.storage.onChanged.removeListener(notifySubscriber);
    chrome.storage.onChanged.addListener(notifySubscriber);
}

function notifySubscriber(changes, areaName) {
    if (areaName === 'local') {
        if (changes.readingList && currentSubscriber) {
            currentSubscriber(changes.readingList.newValue);
        }
    }
}