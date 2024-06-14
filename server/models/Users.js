
import { defineMongooseModel } from "#nuxt/mongoose";

export const User = defineMongooseModel({
    name: 'User',
    schema: {
        Vists: { type: Array, required: false, default: [] },
        Likes: { type: Array, required: false, default: [] },
        Password: { type: String, required: true, unique: false },
        Email: { type: String, required: true, unique: true },
        Username: { type: String, required: true, unique: true },
        CreatedAt: { type: Date, required: false, default: Date.now }
    }
})





