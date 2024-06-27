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
                message: "De aanvraag is niet geautoriseerd en vereist authenticatie."
            })

            const query = getRouterParams(event).id
            const posts: any = await Posts.findById(query).catch(() => reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "De opgevraagde bron kon niet worden gevonden, maar is mogelijk beschikbaar in de toekomst."
            }))

            if (!posts) return reject({
                statusCode: 404,
                statusMessage: "Not Found",
                message: "De opgevraagde bron kon niet worden gevonden, maar is mogelijk beschikbaar in de toekomst."
            })

            const PostId = posts.PostId

            if (posts.UserId !== user.Id) return reject({
                statusCode: 403,
                statusMessage: "Forbidden",
                message: "De server begrijpt de aanvraag, maar weigert deze uit te voeren."
            })

            if (containsMedia(posts.Content.content)) {
                const { data, error }: any = await client.storage.from('files').list(posts.PostId, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' },
                }).catch(() => reject({
                    statusCode: 404,
                    statusMessage: "Not Found",
                    message: "De opgevraagde bron kon niet worden gevonden, maar is mogelijk beschikbaar in de toekomst."
                }))

                if (!error) data.forEach(async (file: any) => await client.storage.from('files').remove([`${PostId}/${file.name}`]))
                else return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "De bestanden konden niet worden verwijderd, probeer het later opnieuw."
                })
            }

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

const containsMedia = (content: any[]): boolean => {
    for (const item of content) {
        if (item.type === 'video' || item.type === 'image') {
            return true;
        }
    }
    return false;
}
