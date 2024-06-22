export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token");
            const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId);
            const query = getRouterParams(event).id;
            const comment = getRouterParams(event).comment;
            const isDownVote = getQuery(event).DownVote || false

            if (!user) return {
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource.",
            };

            const posts: any = await Posts.findById(query);

            if (!posts) return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The server has not found anything matching the Request-URI.",
            });

            const comments: any = await Reacties.findById(comment);

            if (!comments) return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The server has not found anything matching the Request-URI.",
            });

            const PostUser: any = await User.findById(user.Id)

            const hasLiked = PostUser.CommentsLiked.includes(comment);
            const hasDisliked = PostUser.CommentsDisliked.includes(comment);

            if (comments.UserId === user.Id) return reject({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "The request could not be understood by the server due to malformed syntax.",
            });

            if (isDownVote) {
                if (!hasDisliked) {
                    if (hasLiked) {
                        await updateLikes(comment, -1);
                        await pullFromUserList(user.Id, 'CommentsLiked', comment);
                    }
                    await updateLikes(comment, -1);
                    await updateUserLists(user.Id, comment, 'dislike');
                } else {
                    await updateLikes(comment, 1);
                    await pullFromUserList(user.Id, 'CommentsDisliked', comment);
                }
            } else {
                if (!hasLiked) {
                    if (hasDisliked) {
                        await updateLikes(comment, 1);
                        await pullFromUserList(user.Id, 'CommentsDisliked', comment);
                    }
                    await updateLikes(comment, 1);
                    await updateUserLists(user.Id, comment, 'like');
                } else {
                    await updateLikes(comment, -1);
                    await pullFromUserList(user.Id, 'CommentsLiked', comment);
                }
            }

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
            });
        }, 500);
    });
});

const updateLikes = async (commentId: string, increment: number): Promise<void> => {
    await Reacties.findByIdAndUpdate(commentId, { $inc: { "meta.Likes": increment } });
};

const updateUserLists = async (userId: string, commentId: string, action: string): Promise<void> => {
    if (action === 'like') {
        await User.findByIdAndUpdate(userId, { $push: { CommentsLiked: commentId }, $pull: { CommentsDisliked: commentId } });
    } else if (action === 'dislike') {
        await User.findByIdAndUpdate(userId, { $push: { CommentsDisliked: commentId }, $pull: { CommentsLiked: commentId } });
    }
};

const pullFromUserList = async (userId: string, listName: string, commentId: string): Promise<void> => {
    const update: any = {};
    update[listName] = commentId;
    await User.findByIdAndUpdate(userId, { $pull: update });
};