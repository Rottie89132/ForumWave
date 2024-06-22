
export default defineEventHandler(async (event) => {

    const SessionId: any = getCookie(event, "access-token")
    const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId)

    if (!user) return {
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    }

    await useVercelStorage().removeItem(SessionId)
    deleteCookie(event, "access-token")

    return {
        statusCode: 200,
        statusMessage: "OK",
        message: "The request has succeeded.",
    }
})
