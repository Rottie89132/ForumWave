
import { defineMongooseModel } from "#nuxt/mongoose";

export const Reacties = defineMongooseModel({
    name: 'Reacties',
    schema: {
        UserId: { type: String, required: true, unique: false },
        ParentId: { type: String, required: true, unique: false },
        Content: { type: Object, required: true, unique: false },
        meta: {
            Likes: { type: Number, required: false, default: 0 },
            Dislikes: { type: Number, required: false, default: 0 },
        },
        CreatedAt: { type: Date, required: false, default: Date.now },
        UpdatedAt: { type: Date, required: false, default: null }
    }
})





