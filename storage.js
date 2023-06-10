import { api as localStorageAPI } from "./storageLocal.js"
import { api as pocketbaseAPI, saveEntry } from "./storagePocketbase.js"

// export const api = localStorageAPI
export const api = pocketbaseAPI

window.migrateToPocketbase = async function () {
    const rl = await localStorageAPI.getReadingList()
    console.log(rl)
    for (const entry of rl) {
        console.log(entry)
        await saveEntry(entry)
    }
}