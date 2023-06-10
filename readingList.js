import { h, render } from './vendor/preact-10-15-1.js'
import { useState, useEffect } from './vendor/preact-hooks-10-15-1.js'
import htm from './vendor/htm-3-1-1.js'
import { formatTime } from './lib.js'
import { api } from "./storage.js"
import { calculatePriority, sortByDate } from './lib.js'

const html = htm.bind(h);

function Timestamps(props) {
    return html`
        <div>
            ${props.timestamps.map(t => html`<div class="timestamp">${formatTime(t)}</div>`)}
        </div>
    `
}

function ListItem(props) {
    return html`
    <div class="list-item ${props.read && "read"}">
        <button class="delete-button" onClick="${() => props.onDelete(props)}">\u2716</button>
        <input type="checkbox" class="read-checkbox" checked="${!!props.read}"
            onClick="${e => props.onReadToggle(props, e.target.checked)}"/>
        <${Timestamps} timestamps="${props.timestamps}" />
        <img src=${props.favicon}/>
        <a href="${props.url}">${props.title}</a>
    </div>
    `
}

function ReadingList(props) {
    console.log(props.readingList)
    return html`
    <h1>${props.heading}</h1>
    ${props.readingList.map(i => html`<${ListItem} ...${i}
        onDelete="${props.onDelete}" onReadToggle="${props.onReadToggle}" />`)}
    `;
}

function Priority({ readingList }) {
    console.log("renderPriority", readingList)
    const unreadPages = readingList.filter(page => page.read === null);

    const sortedUnreadPages = unreadPages.sort((a, b) => {
        const priorityA = calculatePriority(a);
        const priorityB = calculatePriority(b);
        return priorityB - priorityA;
    });

    const onDelete = async page => await api.markDeleted(page.url)
    const onReadToggle = async (page, isChecked) => await api.setCheckedStatus(page.url, isChecked)

    return html`
        <${ReadingList} heading="Priority" readingList="${sortedUnreadPages}"
            onDelete="${onDelete}" onReadToggle="${onReadToggle}" />
    `
}

function expand(readingList) {
    const expandedReadingList = [];
    for (const x of readingList) {
        for (const time of x.timestamps) {
            expandedReadingList.push({...x, timestamps: [time]});
        }
    }
    return expandedReadingList
}

function expand2(readingList) {
    const expandedReadingList = [];
    for (const x of readingList) {
        expandedReadingList.push({...x, timestamps: [x.read]});
    }
    return expandedReadingList
}

function Timeline({ readingList }) {
    const sortedReadingList = sortByDate(expand(readingList), false);

    const onDelete = async page => await api.markDeletedAtTimestamp(page.url, page.timestamps[0])
    const onReadToggle = async (page, isChecked) => await api.setCheckedStatus(page.url, isChecked)

    return html`
        <${ReadingList} heading="Timeline" readingList="${sortedReadingList}"
            onDelete="${onDelete}" onReadToggle="${onReadToggle}" />
    `
}


function ReadList({ readingList }) {
    const readPages = readingList.filter(page => page.read !== null);

    const sortedReadPages = sortByDate(expand2(readPages), false);

    const onDelete = async page => await api.markDeleted(page.url)
    const onReadToggle = async (page, isChecked) => await api.setCheckedStatus(page.url, isChecked)

    return html`
        <${ReadingList} heading="Read" readingList="${sortedReadPages}"
            onDelete="${onDelete}" onReadToggle="${onReadToggle}" />
    `
}

function Home() {

    const [activeTab, setActiveTab] = useState("priority")
    const [readingList, setReadingList] = useState([])

    useEffect(() => {
        api.subscribeToReadingList(rl => setReadingList(rl))
        return () => {}
    }, []);

    return html`
        <div class="tabs">
            <button class="tab" id="priority" onClick="${() => setActiveTab("priority")}">Priority</button>
            <button class="tab" id="timeline" onClick="${() => setActiveTab("timeline")}">Timeline</button>
            <button class="tab" id="read" onClick="${() => setActiveTab("read-list")}">Read</button>
        </div>
        ${ activeTab == "priority" && html`<${Priority} readingList="${readingList}"/>`}
        ${ activeTab == "timeline" && html`<${Timeline} readingList="${readingList}"/>`}
        ${ activeTab == "read-list" && html`<${ReadList} readingList="${readingList}"/>`}
    `;
}

function App() {
    const isLoggedIn = api.isLoggedIn()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false)

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        await api.login(username, password)
        setUsername("")
        setPassword("")
        setLoading(false)
    }

    async function handleLogout(e) {
        setLoading(true)
        await api.logout()
        setLoading(false)
    }

    const loginScreen =  html`
        ${isLoading && html`<p>Loading ...</p>`}
        <form onSubmit="${handleLogin}">
            <input type="text" placeholder="user@example.com" value="${username}" onChange="${e => setUsername(e.target.value)}"/>
            <input type="password" value="${password}" onChange="${e => setPassword(e.target.value)}"/>
            <button type="submit" disabled="${isLoading}">${isLoading ? "Loading" : "Login"}</button>
        </form>
    `
    const app = isLoggedIn ? html`<${Home} />` : loginScreen

    return html`
        <h1>Logged in: ${isLoggedIn.toString()}</h1>
        ${isLoggedIn && html`<button onClick="${handleLogout}">Logout</button>`}
        ${app}
    `

}

function renderApp() {
    render(html`<${App} />`, document.getElementById("container"))
}

renderApp()