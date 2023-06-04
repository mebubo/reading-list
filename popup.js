import { saveCurrentTab, saveAllTabs, openReadingList } from "./tabs.js"

document.getElementById('save-current-tab').addEventListener('click', async () => await saveCurrentTab());

document.getElementById('save-all-tabs').addEventListener('click', async () => await saveAllTabs());

document.getElementById('show-reading-list').addEventListener('click', async () => await openReadingList());
