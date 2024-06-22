export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {

        const SearchId = getQuery(event).SearchId || null
        const Reload = getQuery(event).reload || false
        const query: any = getQuery(event).page || 1;

        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })

            const currentPage = parseInt(query);
            const itemsPerPage = 5;
            const skip = (currentPage - 1) * itemsPerPage;
            
            const totalItems = await Posts.countDocuments({ UserId: SearchId });
            const posts = await Posts.find({ UserId: SearchId }).sort({ CreatedAt: -1 }).skip(skip).limit(itemsPerPage)
            
            const transformedData = await transformPosts(posts, user.Id);

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
                posts: transformedData,
                currentPage: currentPage,
                totalPages: Math.ceil(totalItems / itemsPerPage)
            });
        }, Reload ? 500 : 0);
    });
});

const transformPosts = async (data: any[], userId: any): Promise<any[]> => {
    const UserData: any = await User.findById(userId)
    const UserLikes = UserData.Likes
    return data.map((item: any) => {
        const itemdata = item.Content.content;
        const liked = UserLikes.includes(item.id)

        const headingItem = itemdata.find((item: any) => item.type === 'heading' && item.attrs.level === 1);
        const title = headingItem && headingItem.content && headingItem.content.length > 0 ? headingItem.content[0].text : '';

        const paragraphItem = itemdata.find((item: any) => item.type === 'paragraph');
        const content = paragraphItem && paragraphItem.content && paragraphItem.content.length > 0 ? paragraphItem.content[0].text : '';
        const media = itemdata.find((item: any) => item.type === 'image')?.attrs.src || null;

        return {
            id: item.id,
            title,
            content,
            media,
            liked,
            meta: item.meta,
            UpdatedAt: item.UpdatedAt,
            CreatedAt: item.CreatedAt,
        };
    });
}