function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${formatDate(timestamp)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

async function getReadingList() {
    const data = await chrome.storage.local.get('readingList');
    return data.readingList || [];
}

function render(readingList, onDelete, onReadToggle) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    for (const page of readingList) {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        if (page.read !== null) listItem.classList.add('read');

        const favicon = document.createElement('img');
        favicon.src = page.favicon;

        const link = document.createElement('a');
        link.href = page.url;
        link.textContent = page.title;

        const timestampContainer = document.createElement('div');
        for (const time of page.timestamps.reverse()) {
            const timestamp = document.createElement('div');
            timestamp.classList.add('timestamp');
            timestamp.textContent = formatTime(time);
            timestampContainer.appendChild(timestamp);
        }

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '\u2716';
        deleteButton.addEventListener('click', () => onDelete(page));

        const readCheckbox = document.createElement('input');
        readCheckbox.type = 'checkbox';
        readCheckbox.classList.add('read-checkbox');
        readCheckbox.checked = page.read !== null;
        readCheckbox.addEventListener('change', () => onReadToggle(page, readCheckbox.checked));

        listItem.appendChild(deleteButton);
        listItem.appendChild(readCheckbox);
        listItem.appendChild(timestampContainer);
        listItem.appendChild(favicon);
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    }
}
