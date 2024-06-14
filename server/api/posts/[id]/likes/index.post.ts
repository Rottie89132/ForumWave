
export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    }

    const query = getRouterParams(event).id
    await Posts.findByIdAndUpdate(query, { $inc: { "meta.Likes": 1 } });
    await User.findByIdAndUpdate(user.Id, { $push: { Likes: query } });
    
    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded."
    };
});
