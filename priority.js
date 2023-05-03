function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function calculatePriority({times}) {
    // Calculate a priority score based on recency and frequency
    const recencyScore = (Date.now() - Math.max(...times)) / (1000 * 60 * 60 * 24); // days ago
    return Math.pow(times.length, 2) / recencyScore;
}

chrome.storage.local.get('readingList', data => {
    const readingList = data.readingList || [];
    const listContainer = document.getElementById('list-container');
    listContainer.classList.add('priority-view')

    // Group pages by URL and compute frequency and timestamps of each page
    const pageGroups = readingList.reduce((acc, page) => {
        if (!acc[page.url]) {
            acc[page.url] = {
                title: page.title,
                url: page.url,
                favicon: page.favicon,
                times: [],
            };
        }
        acc[page.url].times.push(page.time);
        return acc;
    }, {});

    // Convert to array and add a priority property to each page
    const pages = Object.values(pageGroups);

    // Add a priority property to each page
    for (const page of pages) {
        page.priority = calculatePriority(page);
    }

    const sortedReadingList = pages.sort((a, b) => b.priority - a.priority);

    for (const page of sortedReadingList) {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');

        const timestampContainer = document.createElement('div');
        for (const time of page.times.reverse()) {
            const timestamp = document.createElement('div');
            timestamp.classList.add('timestamp');
            timestamp.textContent = formatTime(time);
            timestampContainer.appendChild(timestamp);
        }

        const favicon = document.createElement('img');
        favicon.src = page.favicon;

        const link = document.createElement('a');
        link.href = page.url;
        link.textContent = page.title;

        listItem.appendChild(timestampContainer);
        listItem.appendChild(favicon);
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    }
});
