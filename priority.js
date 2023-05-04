function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function calculatePriority({timestamps}) {
    // Calculate a priority score based on recency and frequency
    const recencyScore = (Date.now() - Math.max(...timestamps)) / (1000 * 60 * 60 * 24); // days ago
    return Math.pow(timestamps.length, 2) / recencyScore;
}

chrome.storage.local.get('readingList', data => {
    const readingList = data.readingList || [];
    const listContainer = document.getElementById('list-container');
    listContainer.classList.add('priority-view')

    const pages = [...readingList]

    const sortedReadingList = pages.sort((a, b) => calculatePriority(b) - calculatePriority(a));

    for (const page of sortedReadingList) {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');

        const timestampContainer = document.createElement('div');
        for (const time of page.timestamps.reverse()) {
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

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '\u2716';

        deleteButton.addEventListener('click', () => {
          const filtered = readingList.filter(item => !(item.url === page.url));
          // const index = readingList.findIndex(item => item.url === page.url && item.time == page.time);
          // readingList.splice(index, 1);
          chrome.storage.local.set({ readingList: filtered });
          listItem.remove();
        });


        listItem.appendChild(deleteButton);
        listItem.appendChild(timestampContainer);
        listItem.appendChild(favicon);
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    }
});
