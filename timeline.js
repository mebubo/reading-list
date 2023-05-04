function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

chrome.storage.local.get('readingList', data => {
    const readingList = data.readingList || [];
    const listContainer = document.getElementById('list-container');
    const expandedReadingList = []
    for (x of readingList) {
        for (time of x.timestamps) {
            expandedReadingList.push({...x, time})
        }
    }
    const sortedReadingList = expandedReadingList.sort((a, b) => b.time - a.time);

    let currentDate = '';

    for (const page of sortedReadingList) {
        const pageDate = formatDate(page.time);
        if (pageDate !== currentDate) {
            currentDate = pageDate;
            const dateHeader = document.createElement('h2');
            dateHeader.textContent = currentDate;
            listContainer.appendChild(dateHeader);
        }

        const listItem = document.createElement('div');
        listItem.classList.add('list-item');

        const favicon = document.createElement('img');
        favicon.src = page.favicon;

        const link = document.createElement('a');
        link.href = page.url;
        link.textContent = page.title;

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        timestamp.textContent = formatTime(page.time);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '\u2716';

        deleteButton.addEventListener('click', () => {
            const filtered = readingList.filter(item => !(item.url === page.url && item.time == page.time));
            chrome.storage.local.set({ readingList: filtered });
            listItem.remove();
        });


        listItem.appendChild(deleteButton);
        listItem.appendChild(timestamp);
        listItem.appendChild(favicon);
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    }
});