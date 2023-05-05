async function getReadingList() {
    const data = await chrome.storage.local.get('readingList');
    return data.readingList || [];
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

function calculatePriority({timestamps}) {
    const recencyScore = (Date.now() - Math.max(...timestamps)) / (1000 * 60 * 60 * 24);
    return Math.pow(timestamps.length, 2) / recencyScore;
}

async function renderPriority() {
    const readingList = await getReadingList();
    const unreadPages = readingList.filter(page => page.read === null);

    // Sort the unreadPages list based on the priority calculated by the calculatePriority function
    const sortedUnreadPages = unreadPages.sort((a, b) => {
        const priorityA = calculatePriority(a);
        const priorityB = calculatePriority(b);

        // Sort in descending order, so higher priority items come first
        return priorityB - priorityA;
    });

    render('priority', sortedUnreadPages, async (page) => {
        const updatedReadingList = readingList.filter(item => item.url !== page.url);
        await chrome.storage.local.set({readingList: updatedReadingList});
        renderPriority();
    }, async (page, isChecked) => {
        const updatedReadingList = readingList.map(item => item.url === page.url ? {...item, read: isChecked ? new Date().getTime() : null} : item);
        await chrome.storage.local.set({readingList: updatedReadingList});
        renderPriority();
    });
}

renderPriority();

function sortByDate(readingList, ascending = true) {
    const sortedList = [...readingList].sort((a, b) => {
        ad = a.timestamps[0]
        bd = b.timestamps[0]
        if (ad === bd) return 0;
        return ascending ? ad - bd : bd - ad;
    });

    return sortedList;
}

function expand(readingList) {
    const expandedReadingList = [];
    for (x of readingList) {
        for (time of x.timestamps) {
            expandedReadingList.push({...x, timestamps: [time]});
        }
    }
    return expandedReadingList
}

async function renderTimeline() {
    const readingList = await getReadingList();
    const sortedReadingList = sortByDate(expand(readingList), false);

    render('timeline', sortedReadingList, async (page) => {

        const currentReadingList = await getReadingList();

        const filtered = currentReadingList.map(item => {
            const filteredTimestamps = item.timestamps.filter(time => !(item.url === page.url && time === page.timestamps[0]));
            return {...item, timestamps: filteredTimestamps};
        }).filter(item => item.timestamps.length > 0);
        chrome.storage.local.set({ readingList: filtered });
        renderTimeline();
    }, async (page, isChecked) => {
        const currentReadingList = await getReadingList();
        const updatedReadingList = currentReadingList.map(item => item.url === page.url ? { ...item, read: isChecked ? new Date().getTime() : null } : item);
        chrome.storage.local.set({ readingList: updatedReadingList });
        renderTimeline();
    });
}

renderTimeline();

async function renderReadList() {
    const readingList = await getReadingList();
    const readPages = readingList.filter(page => page.read !== null);

    // Sort the readPages list based on the 'read' timestamp
    const sortedReadPages = readPages.sort((a, b) => b.read - a.read);

    render('read', sortedReadPages, async (page) => {
        const updatedReadingList = readingList.filter(item => item.url !== page.url);
        await chrome.storage.local.set({readingList: updatedReadingList});
        renderReadList();
    }, async (page, isChecked) => {
        const updatedReadingList = readingList.map(item => item.url === page.url ? {...item, read: isChecked ? new Date().getTime() : null} : item);
        await chrome.storage.local.set({readingList: updatedReadingList});
        renderReadList();
    });
}

renderReadList();


onLocalStorageChange(renderPriority)
onLocalStorageChange(renderTimeline)
onLocalStorageChange(renderReadList)
