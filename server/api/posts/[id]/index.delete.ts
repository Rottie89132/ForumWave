import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId)
            const client = serverSupabaseServiceRole(event)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })

            const query = getRouterParams(event).id
            const posts: any = await Posts.findById(query).catch(() => reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The requested resource could not be found but may be available in the future."
            }))

            if (!posts) return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "The requested resource could not be found but may be available in the future."
            })
            
            const PostId = posts.PostId

            if (posts.UserId !== user.Id) return reject({
                statusCode: 403,
                statusMessage: "Forbidden",
                message: "The server understood the request but refuses to authorize it."
            })

            const { data, error }: any = await client.storage.from('files')
                .list(posts.PostId, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                }).catch(() => reject({
                    statusCode: 404,
                    statusMessage: "Not Found",
                    message: "The requested resource could not be found but may be available in the future."
                }))

            data.forEach(async (file: any) => {
                await client.storage.from('files').remove([`${PostId}/${file.name}`]);
            })

            await Posts.findByIdAndDelete(query)
            await Reacties.deleteMany({ ParentId: query })
            await User.find({ Likes: query, Vists: query }).updateMany({ $pull: { Likes: query, Vists: query } })

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded."
            });
        }, 500);
    });
});
