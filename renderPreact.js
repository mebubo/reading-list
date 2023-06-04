import { h, render } from './vendor/preact-10-15-1.js';
import htm from './vendor/htm-3-1-1.js';
import { formatTime } from './lib.js'

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

function App(props) {
    console.log(props.readingList)
    return html`
    <h1>${props.heading}</h1>
    ${props.readingList.map(i => html`<${ListItem} ...${i}
        onDelete="${props.onDelete}" onReadToggle="${props.onReadToggle}" />`)}
    `;
}

export function renderPreact(heading, el, readingList, onDelete, onReadToggle) {
    const listContainer = document.getElementById(el);
    render(html`
        <${App} heading="${heading}" readingList="${readingList}"
            onDelete="${onDelete}" onReadToggle="${onReadToggle}" />
    `, listContainer);
}