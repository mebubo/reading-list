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

    render(sortedReadingList, async (page) => {

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