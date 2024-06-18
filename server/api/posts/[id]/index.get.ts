export default defineEventHandler(async (event) => {
    return new Promise((resolve, reject) => {
        const Reload = getQuery(event).reload || false
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })

            const query = getRouterParams(event).id
            const posts: any = await Posts.findById(query);
            const author: any = await User.findById(posts.UserId)
            const PostUser: any = await User.findById(user.Id)
            const Comments = await Reacties.find({ ParentId: query }).sort({ CreatedAt: -1 });

            const CommentsArray: object[] = []
            for (const item of Comments) {
                const author: object | any = await User.findById(item.UserId)
                CommentsArray.push({ 
                    ...item.toObject(), 
                    author: author.Username,
                    owned: item.UserId === user?.Id || false
                });
            }

            if (!PostUser?.Vists.includes(query) || posts.UserId != user.Id) {
                await Posts.findByIdAndUpdate(query, { $inc: { "meta.views": 1 } });
                await User.findByIdAndUpdate(user.Id, { $push: { Vists: query } });
            }

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
                posts: posts,
                Comments: CommentsArray,
                Author: author.Username,
                owned: posts.UserId === user?.Id || false,
                liked: PostUser?.Likes.includes(posts._id) || false
            });
        }, Reload ? 500 : 0);
    });

});
