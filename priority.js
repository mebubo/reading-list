function calculatePriority({timestamps}) {
    const recencyScore = (Date.now() - Math.max(...timestamps)) / (1000 * 60 * 60 * 24);
    return Math.pow(timestamps.length, 2) / recencyScore;
}

async function renderPriority() {
    const readingList = await getReadingList();
    const unreadPages = readingList.filter(page => page.read === null);

    render(unreadPages, async (page) => {
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
