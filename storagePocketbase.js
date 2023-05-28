import PocketBase from './vendor/pocketbase-0.15.0.es.js'

const pb = new PocketBase('http://127.0.0.1:8090');

async function login() {
    const authData = await pb.collection('users').authWithPassword('bbb', '11111');
}

async function createRecord(data) {
    const record = await pb.collection('reading_list').create(data);
    console.log(record)
}

async function saveToReadingList({url, title, favIconUrl}) {
    await login()

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
            user_id: pb.authStore.model.id
        }
        await createRecord(pageData);
    }
}

const stub = () => {}

export const api = {
    subscribeToReadingList: stub,
    getReadingList: stub,
    saveToReadingList,
    markDeleted: stub,
    markDeletedAtTimestamp: stub,
    setCheckedStatus: stub
}