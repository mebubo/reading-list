import { saveCurrentTab, saveAllTabs, openReadingList } from "./tabs.js"

document.getElementById('save-current-tab').addEventListener('click', () => saveCurrentTab());

document.getElementById('save-all-tabs').addEventListener('click', () => saveAllTabs());

document.getElementById('show-reading-list').addEventListener('click', () => openReadingList());
