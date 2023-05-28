import { render } from "./render.js"
import { api } from "./storage.js"

function calculatePriority({timestamps}) {
    const recencyScore = (Date.now() - Math.max(...timestamps)) / (1000 * 60 * 60 * 24);
    return Math.pow(timestamps.length, 2) / recencyScore;
}

async function renderPriority(readingList) {
    console.log("renderPriority")
    const unreadPages = readingList.filter(page => page.read === null);

    const sortedUnreadPages = unreadPages.sort((a, b) => {
        const priorityA = calculatePriority(a);
        const priorityB = calculatePriority(b);
        return priorityB - priorityA;
    });

    render('Priority', 'content', sortedUnreadPages,
        async page => await api.markDeleted(page.url),
        async (page, isChecked) => await api.setCheckedStatus(page.url, isChecked)
    );
}

function sortByDate(readingList, ascending = true) {
    const sortedList = [...readingList].sort((a, b) => {
        const ad = a.timestamps[0]
        const bd = b.timestamps[0]
        if (ad === bd) return 0;
        return ascending ? ad - bd : bd - ad;
    });

    return sortedList;
}

function expand(readingList) {
    const expandedReadingList = [];
    for (const x of readingList) {
        for (const time of x.timestamps) {
            expandedReadingList.push({...x, timestamps: [time]});
        }
    }
    return expandedReadingList
}

async function renderTimeline(readingList) {
    console.log("renderTimeline")
    const sortedReadingList = sortByDate(expand(readingList), false);

    render('Timeline', 'content', sortedReadingList,
        async page => await api.markDeletedAtTimestamp(page.url, page.timestamps[0]),
        async (page, isChecked) => await api.setCheckedStatus(page.url, isChecked)
    );
}

function expand2(readingList) {
    const expandedReadingList = [];
    for (const x of readingList) {
        expandedReadingList.push({...x, timestamps: [x.read]});
    }
    return expandedReadingList
}

async function renderReadList(readingList) {
    console.log("renderReadingList")
    const readPages = readingList.filter(page => page.read !== null);

    const sortedReadPages = sortByDate(expand2(readPages), false);

    render('Read', 'content', sortedReadPages,
        async page => await api.markDeleted(page.url),
        async (page, isChecked) => await api.setCheckedStatus(page.url, isChecked)
    );
}

function changeTab(tabId) {
    switch (tabId) {
        case 'priority':
            api.subscribeToReadingList(renderPriority)
            break
        case 'timeline':
            api.subscribeToReadingList(renderTimeline)
            break
        case 'read':
            api.subscribeToReadingList(renderReadList)
            break
        default:
            console.error(`Invalid tabId: ${tabId}`)
            break
    }
}

changeTab('priority');

function handle(id) {
    document.getElementById(id).addEventListener("click", () => changeTab(id))
}

handle('priority')
handle('timeline')
handle('read')