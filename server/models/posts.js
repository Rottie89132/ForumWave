
import { defineMongooseModel } from "#nuxt/mongoose";

export const Posts = defineMongooseModel({
    name: 'Posts',
    schema: {
        UserId: { type: String, required: true, unique: false },
        PostId: { type: String, required: true, unique: true },
        Content: { type: Object, required: true, unique: false },
        meta: {
            Likes: { type: Number, required: false, default: 0 },
            Comments: { type: Number, required: false, default: 0 },
            views: { type: Number, required: false, default: 0 }
        },
        CreatedAt: { type: Date, required: false, default: Date.now },
        UpdatedAt: { type: Date, required: false, default: null }
    }
})





