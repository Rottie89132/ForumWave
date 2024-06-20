
export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const SessionId: any = getCookie(event, "access-token")
        const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

        if (!user) return reject({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
        })

        const query = getRouterParams(event).id
        const PostUser: any = await User.findById(user.Id)

        if (PostUser?.Likes.includes(query)) {
            await Posts.findByIdAndUpdate(query, { $inc: { "meta.Likes": -1 } });
            await User.findByIdAndUpdate(user.Id, { $pull: { Likes: query } });
        }

        else return reject({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "The server could not understand the request due to invalid syntax."
        })

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "The request has succeeded."
        });
    });
});
