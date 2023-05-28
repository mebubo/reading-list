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
    await setReadingList(readingList);
}

async function markDeleted(url) {
    const readingList = await getReadingList()
    const updatedReadingList = readingList.filter(item => item.url !== url);
    await setReadingList(updatedReadingList)
}

async function markDeletedAtTimestamp(url, timestamp) {
    const readingList = await getReadingList()
    const updatedReadingList = readingList.map(item => {
        const filteredTimestamps = item.timestamps.filter(time => !(item.url === url && time === timestamp));
        return {...item, timestamps: filteredTimestamps};
    }).filter(item => item.timestamps.length > 0);
    await setReadingList(updatedReadingList)
}

async function setCheckedStatus(url, isChecked) {
    const readingList = await getReadingList()
    const updatedReadingList = readingList.map(item => item.url === url ? {...item, read: isChecked ? new Date().getTime() : null} : item);
    await setReadingList(updatedReadingList)
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

export const api = {
    subscribeToReadingList,
    getReadingList,
    saveToReadingList,
    markDeleted,
    markDeletedAtTimestamp,
    setCheckedStatus
}