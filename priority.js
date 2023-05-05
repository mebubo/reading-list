function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function calculatePriority({timestamps}) {
    const recencyScore = (Date.now() - Math.max(...timestamps)) / (1000 * 60 * 60 * 24);
    return Math.pow(timestamps.length, 2) / recencyScore;
}

async function getReadingList() {
    const data = await chrome.storage.local.get('readingList');
    return data.readingList || [];
}

async function render() {
    const readingList = await getReadingList();
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';
    listContainer.classList.add('priority-view');

    const sortedPages = readingList.sort((a, b) => calculatePriority(b) - calculatePriority(a));
    const unreadPages = sortedPages.filter(page => page.read === null);

    for (const page of unreadPages) {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');

        const readCheckbox = document.createElement('input');
        readCheckbox.type = 'checkbox';
        readCheckbox.addEventListener('change', async () => {
            const updatedReadingList = readingList.map(item => item.url === page.url ? {...item, read: readCheckbox.checked ? new Date().getTime() : null} : item);
            await chrome.storage.local.set({readingList: updatedReadingList});
            render();
        });

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
        deleteButton.textContent = '\u2716';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', async () => {
            const updatedReadingList = readingList.filter(item => item.url !== page.url);
            await chrome.storage.local.set({readingList: updatedReadingList});
            render();
        });

        listItem.appendChild(deleteButton);
        listItem.appendChild(readCheckbox);
        listItem.appendChild(timestampContainer);
        listItem.appendChild(favicon);
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    }
}

render();
