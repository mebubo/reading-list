function formatDate(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

async function getReadingList() {
    const data = await chrome.storage.local.get('readingList');
    return data.readingList || [];
}

async function render() {
    const readingList = await getReadingList();
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';

    const expandedReadingList = [];
    for (x of readingList) {
        for (time of x.timestamps) {
            expandedReadingList.push({...x, time});
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
        if (page.read !== null) listItem.classList.add('read');

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

        deleteButton.addEventListener('click', async () => {
            const currentReadingList = await getReadingList();

            const filtered = currentReadingList.map(item => {
                const filteredTimestamps = item.timestamps.filter(time => !(item.url === page.url && time === page.time));
                return {...item, timestamps: filteredTimestamps};
            }).filter(item => item.timestamps.length > 0);

            chrome.storage.local.set({ readingList: filtered });
            render();
        });


        const readCheckbox = document.createElement('input');
        readCheckbox.type = 'checkbox';
        readCheckbox.classList.add('read-checkbox');
        readCheckbox.checked = page.read !== null;

        readCheckbox.addEventListener('change', async () => {
            const currentReadingList = await getReadingList();

            const updatedReadingList = currentReadingList.map(item => {
                if (item.url === page.url) {
                    return {...item, read: readCheckbox.checked ? new Date().getTime() : null};
                } else {
                    return item;
                }
            });

            chrome.storage.local.set({ readingList: updatedReadingList });
            render();
        });

        listItem.appendChild(deleteButton);
        listItem.appendChild(readCheckbox);
        listItem.appendChild(timestamp);
        listItem.appendChild(favicon);
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    }
}

render();