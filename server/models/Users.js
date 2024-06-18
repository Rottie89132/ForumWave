
import { defineMongooseModel } from "#nuxt/mongoose";

export const User = defineMongooseModel({
    name: 'User',
    schema: {
        CommentsDisliked: { type: Array, required: false, default: [] },
        CommentsLiked: { type: Array, required: false, default: [] },
        Vists: { type: Array, required: false, default: [] },
        Likes: { type: Array, required: false, default: [] },
        Password: { type: String, required: true, unique: false },
        Email: { type: String, required: true, unique: true },
        Username: { type: String, required: true, unique: true },
        CreatedAt: { type: Date, required: false, default: Date.now }
    }
})





