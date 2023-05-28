let currentSubscriber = null;

async function getReadingList() {
    const { readingList } = await chrome.storage.local.get('readingList');
    return readingList ?? [];
}

async function setReadingList(readingList) {
    return await chrome.storage.local.set({readingList});
}

async function subscribeToReadingList(fn) {
    currentSubscriber = fn;
    fn(await getReadingList())
    onLocalStorageChange();
}

async function saveToReadingList({url, title, favIconUrl}) {
    const readingList = await getReadingList()
    const existingEntryIndex = readingList.findIndex(item => item.url === url);

    if (existingEntryIndex !== -1) {
        readingList[existingEntryIndex].timestamps.push(new Date().getTime());
    } else {
        const pageData = {
            title: title,
            url: url,
            favicon: favIconUrl,
            read: null,
            timestamps: [new Date().getTime()]
        };
        readingList.push(pageData);
    }
    await api.setReadingList(readingList);
}

const localStorageAPI = {
    subscribeToReadingList,
    setReadingList,
    getReadingList,
    saveToReadingList
}

export const api = localStorageAPI

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