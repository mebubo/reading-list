import { render } from "./render.js"
import { subscribeToReadingList, setReadingList } from "./storage.js"

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

    render('Priority', 'content', sortedUnreadPages, async (page) => {
        const updatedReadingList = readingList.filter(item => item.url !== page.url);
        await setReadingList(updatedReadingList)
    }, async (page, isChecked) => {
        const updatedReadingList = readingList.map(item => item.url === page.url ? {...item, read: isChecked ? new Date().getTime() : null} : item);
        await setReadingList(updatedReadingList)
    });
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

    render('Timeline', 'content', sortedReadingList, async page => {
        const updatedReadingList = readingList.map(item => {
            const filteredTimestamps = item.timestamps.filter(time => !(item.url === page.url && time === page.timestamps[0]));
            return {...item, timestamps: filteredTimestamps};
        }).filter(item => item.timestamps.length > 0);
        await setReadingList(updatedReadingList)
    }, async (page, isChecked) => {
        const updatedReadingList = readingList.map(item => item.url === page.url ? { ...item, read: isChecked ? new Date().getTime() : null } : item);
        await setReadingList(updatedReadingList)
    });
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

    render('Read', 'content', sortedReadPages, async (page) => {
        const updatedReadingList = readingList.filter(item => item.url !== page.url);
        await setReadingList(updatedReadingList)
    }, async (page, isChecked) => {
        const updatedReadingList = readingList.map(item => item.url === page.url ? {...item, read: isChecked ? new Date().getTime() : null} : item);
        await setReadingList(updatedReadingList)
    });
}

function changeTab(tabId) {
    switch (tabId) {
        case 'priority':
            subscribeToReadingList(renderPriority)
            break
        case 'timeline':
            subscribeToReadingList(renderTimeline)
            break
        case 'read':
            subscribeToReadingList(renderReadList)
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