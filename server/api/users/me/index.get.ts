
export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    }


    const posts = await Posts.find({ UserId: user.Id }).countDocuments()
    const comments = await Reacties.find({ UserId: user.Id }).countDocuments()
   
    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        user: user,
        comments,
        posts,
    }
})
