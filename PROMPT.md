We are writing a Chrome extension to manage a reading list.

Here is how it should work:

- For now, the reading list is local to the extension, but in the future we may want to store it on a server
- On save, we store the time of the save, the title of the page, the favicon, and the url of the page
- While on any page, it is possible to click on the extension button to save that page to the reading list, and close the tab
- It is also possible to save all currently open tabs to the list, and close them all
- It is possible to save the same page multiple times
- The extension provides a page, "timeline view" (not a popup, but a full page owned by extension) where a user can see all previous saves in reverse chronological order, grouped by date
    - Every item is displayed as timestamp, favicon, a link where the text of the link is the page title, and the target is the url
- The extension also provides another page with a different view, "priority view", where the order is based on priority
    - The priority is determined by frecency: the more recently saved pages, and the pages saved more times get higher priority
- We don't need a content script, and we don't need to access page data
- When a user clicks on the extension icon, there should be a popup with the 4 options: save current tab, save all tabs, show "timeline view", show "priority view"
- We will not specify any icons in the extension, we will let chrome use the default

We will use only vanilla javascript with no dependencies, but we will use all
the modern javascript features and dom apis, we will rely on those to make code
more compact and idiomatic, we assume that the extension will
run only on latest chrome, so there are no concerns about legacy support.

We start with a step-by-step implementation plan, with numbered steps. We list
filenames and function names, so that we can refer to them later when
implementing the plan.

Here is the plan:

1. Manifest File (manifest.json):

Define your manifest file. It's a metadata file in JSON format that contains properties like your extension's name, description, version number and so on. In particular, you need to define:
"permissions": ["tabs", "storage"]
"browser_action": to specify default icon and popup
"background": to specify background scripts
"action": to specify extension's click behavior
"web_accessible_resources": to specify HTML files accessible from extension
"icons": to define extension's icons

2. Background Script (background.js):

Define saveTab(tab) function that saves a given tab's info (title, URL, favicon, and the current time) to the local storage.
Define saveCurrentTab() function that retrieves the current tab and calls saveTab(tab) on it, then closes the tab.
Define saveAllTabs() function that retrieves all open tabs, calls saveTab(tab) on each of them, then closes them.
Listen to chrome.action.onClicked event. When the extension's icon is clicked, open the popup (popup.html).

3. Popup Script (popup.js):

In the popup script, attach event listeners to the buttons for "Save current tab", "Save all tabs", "Show timeline view", "Show priority view".
These event listeners should send messages to the background script to perform the corresponding actions.

4. Popup Page (popup.html):

Define the HTML for the popup, which should contain buttons for the four actions: "Save current tab", "Save all tabs", "Show timeline view", "Show priority view".

5. Timeline View Page (timeline.html) and corresponding script (timeline.js):

Define the HTML for the timeline view, which should be an empty container that will be filled with JavaScript.
In timeline.js, retrieve the list of saved pages from the local storage, sort them in reverse chronological order, group them by date, and display them in the container. Each page should be displayed with its timestamp, favicon, and a link with the page title as its text and the page URL as its target.

6. Priority View Page (priority.html) and corresponding script (priority.js):

Define the HTML for the priority view, which should be an empty container that will be filled with JavaScript.
In priority.js, retrieve the list of saved pages from the local storage, calculate their priority based on recency and frequency, sort them by priority, and display them in the container. Each page should be displayed with its timestamp, favicon, and a link with the page title as its text and the page URL as its target.

7. Storage:

Use Chrome's local storage to store the reading list. The key should be the page URL and the value should be an object containing the page's title, favicon, and an array of timestamps when the page was saved.

What follows are the contents of all the files that we have so far. It is structured as follows:

[filename]:
```
[the contents of the file corresponding to filenam]
```

For example, if we had a file called `a.txt` which contained the string "hello world", it would be represented like this:

a.txt:
```
hello world
```

After the tripple dash, the actual contents of the files follows.

Read them and acknowledge with a simple "ack". I will give you a task later. No handholding. No extra explanations. Short answers and code. We are pros.

---