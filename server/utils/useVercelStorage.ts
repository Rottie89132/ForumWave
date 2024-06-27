import { createStorage } from "unstorage";
import vercelKVDriver from "unstorage/drivers/vercel-kv";
import fsDriver from "unstorage/drivers/fs"

let storage : any
if (process.env.production == "1") {
    storage = createStorage({
        driver: vercelKVDriver({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_KEY,
            ttl: 1000 * 60 * 60 * 24,
        }),
    })
} else {
    storage = createStorage({
        driver: fsDriver({
            base: "./server/storage",
        }),
    })
}

export default () => storage
