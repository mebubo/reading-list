function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function calculatePriority(page, frequency) {
    // Calculate a priority score based on recency and frequency
    const recencyScore = (Date.now() - Math.max(...page.times)) / (1000 * 60 * 60 * 24); // days ago
    return Math.pow(frequency, 2) / recencyScore;
}

chrome.storage.local.get('readingList', data => {
    const readingList = data.readingList || [];
    const listContainer = document.getElementById('list-container');

    // Compute frequency of each page
    const frequencyMap = readingList.reduce((acc, page) => {
        acc[page.url] = (acc[page.url] || 0) + 1;
        return acc;
    }, {});

    // Add a priority property to each page
    for (const page of readingList) {
        page.priority = calculatePriority(page, frequencyMap[page.url]);
    }

    const sortedReadingList = readingList.sort((a, b) => b.priority - a.priority);

    // Remove duplicates
    const uniquePages = sortedReadingList.filter((page, index, self) => {
        return index === self.findIndex(p => p.url === page.url);
    });

    for (const page of uniquePages) {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');

        const timestampContainer = document.createElement('div');
        for (const time of page.times) {
            const timestamp = document.createElement('span');
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
