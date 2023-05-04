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

We are not starting from scratch. We have already implemented some functionality, there are a bunch of files in the project directory.

It is very imporant that you take into account the contents of those files, and suggest edits based on what's already there.

Because you cannot read the files from the filesystem directly, I will paste them here.

What follows are the contents of all the files that we have so far. The structure is as follows.

[filename]:
```
[the contents of the file corresponding to filename]
```

For example, if we had a file called `a.txt` which contained the string "hello world", it would be represented like this:

a.txt:
```
hello world
```

Read all the code in all the files carefully, it is very important and I know that you can do it. After having finished reading the files, give me the list of the files with an approximate line count next to each filename.

After the tripple dash, the actual contents of the files follows.

---