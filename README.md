# reading-list

A chrome extension to manage a list of pages to read, with the following features:

- Add url of the current tab to the list and close the tab
- Add urls of all tabs in the current window to the list and close the tabs
- The same url can be added to the list multiple times
- There is a timeline view that lists all saved urls in reverse chronological order
- There is a priority view that lists unread urls in the order based on frecency (frequency: how many times a given url has been saved; recency: how recently)
    - The idea is that items at the top of this list are the ones users may want to read most
- It is possible to mark items as read, those are not displayed in the priority view
- It is possible to delete items (both individual saves if done from the Timeline view, the whole url if done from the Priority or Read view)
- There is a Read view that displays only read items in the reverse chronological order based on when they were marked as read
- Two backends are supported: local storage and Pocketbase

## General principles

- Vanilla javascript
- Use modern javascript features and DOM APIs
- No build step
    - Use ES modules
- Only use small libraries with close to zero dependencies
    - Currently: pocketbase, preact, preact-hooks, htm

## Initial dev setup

Download js:

```sh
bash utils/download-js.sh
```

Install pocketbase.

Start pocketbase:

```sh
pocketbase serve
```

Login to Pocketbase UI and create a user and the 'reading_list' table with 2 non-system columns:
- user_id: a 'single' relation to the users table
- entry: JSON

Load the extension into chrome.

## TODO

- [ ] Unbreak the local storage backend (has been broken when adding pocketbase login)
- [ ] Possibility to manually bump / decrease priority
- [ ] Possibility to switch between backends from the UI
- [ ] More sensible UI for login/logout that is used only when using the Pocketbase backend and hidden when
- [ ] A way to crate the necessary tables in Pocketbase via a script (currently there is only one, reading_list, I have relied on Pocketbase UI to crate it)
- [ ] Figure out how to deploy Pocketbase non-locally (e.g. fly.io: https://github.com/pocketbase/pocketbase/discussions/537)
- [ ] Automate deployment via GitHub actions
- [ ] There needs to be a way to add items from mobile, including iOS
    - Use Shortcuts to be a possible target of a "share" action from a browser on iOS, and then to call the API passing the shared URL as a parameter
    - If we are only using the standard Pocketbase API, there would need to be 2 steps: find the item if it already exists, then either modify or create
        - This logic would be cumbersome to implement in a Shortcut
    - Instead of using only statandard Pocketbase APIs, we can create a simple wrapper for this purpose that impplements the above 2 steps and exposes an endpoint that is much easier to call from Shortcuts
    - We would need to deploy that wrapper alongside Pocketbase, which adds some complexity (but maybe not a big deal, seems like it could be easy with e.g. fly.io and custom Docker containers)
    - Alternatilvely, we could also use a serverless function perhaps?
- [ ] There needs to be a way to view the lists from mobile, including iOS, so no extensions
    - The current views in `readingList.{js,html}` are not really tied to any extension APIs, it's easy to turn them to a web page, just need to figure out how to deploy well
- [ ] Add in-page js filter for lists in every view

## Bigger future features

- Extract the text of every read page, save it together with computed embeddings
    - To enable semantic search over the read content
- Add LLM-based question answering and summarization over the read content
    - "What did I read about X last week?"
- Some form of RSS support?
