
export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId)

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    }

    const query = getRouterParams(event).id
    const UserById = await User.findById(query)

    if (!UserById) return {
        statusCode: 404,
        statusMessage: "Not Found",
        message: "The server has not found anything matching the Request-URI."
    }

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
        user: {
            Id: UserById._id,
            Username: UserById.Username,
        }
    }
})
