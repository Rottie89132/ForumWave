import { createStorage } from "unstorage";
import vercelKVDriver from "unstorage/drivers/vercel-kv";

const storage = createStorage({
    driver: vercelKVDriver({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_KEY,
        ttl: 1000 * 60 * 60 * 24,
    }),
})

export default () => storage
