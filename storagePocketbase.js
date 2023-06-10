import PocketBase from './vendor/pocketbase-0.15.0.es.js'

const pb = new PocketBase('http://127.0.0.1:8090');

async function login() {
    const authData = await pb.collection('users').authWithPassword('bbb', '11111');
}

async function getReadingList() {
    const items = await pb.collection("reading_list").getFullList()
    console.log(items)
    const entries = items.map(i => i.entry)
    return entries
}

async function subscribeToReadingList(fn) {
    async function refresh() {
        const rl = await getReadingList()
        console.log("nnn", rl)
        fn(rl)
    }
    pb.collection('reading_list').subscribe('*', async e => {
        console.log("eee", e)
        await refresh()
    });
    await refresh()
}

async function createRecord(data) {
    const record = await pb.collection('reading_list').create(data);
    console.log(record)
}

async function saveToReadingList({url, title, favIconUrl}) {
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    console.log(pb.authStore.model?.id);

    const items = await pb.collection("reading_list").getList(1, 50, {
        filter: `entry.url = "${url}"`
    })

    console.log(items)

    if (items.totalItems !== 0) {
        const id = items.items[0].id
        const entry = items.items[0].entry
        const timestamps = [...entry.timestamps, new Date().getTime()]
        const newEntry = {...entry, timestamps}
        console.log(`timestamps`, timestamps)
        console.log(`newEntry`, newEntry)
        const pageData = {
            entry: newEntry
        }
        await pb.collection("reading_list").update(id, pageData)
    } else {
        const entry = {
            title: title,
            url: url,
            favicon: favIconUrl,
            read: null,
            timestamps: [new Date().getTime()]
        };
        const pageData = {
            entry,
            user_id: pb.authStore.model?.id
        }
        await createRecord(pageData);
    }
}

export async function saveEntry(entry) {
    const pageData = {
        entry,
        user_id: pb.authStore.model?.id
    }
    await createRecord(pageData);
}

async function getRecord(url) {
    return await pb.collection('reading_list').getFirstListItem(`entry.url = "${url}"`)
}

async function updateRecord(id, record) {
    return await pb.collection('reading_list').update(id, record)
}

async function deleteRecord(id) {
    return await pb.collection('reading_list').delete(id)
}

async function markDeleted(url) {
    const record = await getRecord(url)
    return await deleteRecord(record.id)
}

async function markDeletedAtTimestamp(url, timestamp) {
    const record = await getRecord(url)
    const item = record.entry
    const filteredTimestamps = item.timestamps.filter(time => !(item.url === url && time === timestamp));
    if (filteredTimestamps.length == 0) {
        return await deleteRecord(record.id)
    } else {
        const entry = {...item, timestamps: filteredTimestamps}
        return await updateRecord(record.id, { entry })
    }
}

async function setCheckedStatus(url, isChecked) {
    const record = await getRecord(url)
    const entry = {...record.entry, read: isChecked ? new Date().getTime() : null }
    return await updateRecord(record.id, { entry })
}

export const api = {
    subscribeToReadingList,
    getReadingList,
    saveToReadingList,
    markDeleted,
    markDeletedAtTimestamp,
    setCheckedStatus
}