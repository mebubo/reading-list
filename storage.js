async function getReadingList() {
    const { readingList } = await chrome.storage.local.get('readingList');
    return readingList ?? [];
}

function onLocalStorageChange(fn) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            if (changes.readingList) {
                fn(changes.readingList.newValue)
            }
        }
    });
}

export async function setReadingList(readingList) {
    return await chrome.storage.local.set({readingList});
}

export async function subscribeToReadingList(fn) {
    fn(await getReadingList())
    onLocalStorageChange(fn)
}
