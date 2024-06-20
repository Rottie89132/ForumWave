import { defineMongooseModel } from "#nuxt/mongoose";
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    UserId: { type: String, required: true, unique: false },
    PostId: { type: String, required: true, unique: true },
    Content: { type: Object, required: true, unique: false },
    meta: {
        Likes: { type: Number, required: false, default: 0 },
        Comments: { type: Number, required: false, default: 0 },
        views: { type: Number, required: false, default: 0 },
        points: { type: Number, required: false, default: 0 }
    },
    CreatedAt: { type: Date, required: false, default: Date.now },
    UpdatedAt: { type: Date, required: false, default: null }
});


postSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    let isChanged = false;

    if (update['$inc'] && (update['$inc']['meta.Likes'] !== undefined || update['$inc']['meta.Comments'] !== undefined || update['$inc']['meta.views'] !== undefined)) {
        isChanged = true;
    }

    if (isChanged) {

        const docToUpdate = await this.model.findOne(this.getQuery());
        let likes = docToUpdate.meta.Likes;
        let comments = docToUpdate.meta.Comments;
        let views = docToUpdate.meta.views;
        const document = docToUpdate.Content.content.length;

        if (update['$inc']['meta.Likes'] !== undefined) {
            likes += update['$inc']['meta.Likes'];
        }
        if (update['$inc']['meta.Comments'] !== undefined) {
            comments += update['$inc']['meta.Comments'];
        }
        if (update['$inc']['meta.views'] !== undefined) {
            views += update['$inc']['meta.views'];
        }

        const likesWeight = 10;
        const commentsWeight = 5;
        const viewsWeight = 0.1;
        const contentWeight = 1;

        const weightedSum = (likes * likesWeight) + (comments * commentsWeight) + (views * viewsWeight) + (document * contentWeight);
        const totalWeight = likesWeight + commentsWeight + viewsWeight + contentWeight;
        
        const points = (weightedSum / totalWeight) / 100;
        this.set({ 'meta.points': points.toFixed(4) });
    }
    next();
});

export const Posts = defineMongooseModel({
    name: 'Posts',
    schema: postSchema
});