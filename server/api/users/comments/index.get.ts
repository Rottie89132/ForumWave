export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {

        const SearchId = getQuery(event).SearchId || null
        const Reload = getQuery(event).reload || false
        const query: any = getQuery(event).page || 1;

        setTimeout(async () => {
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
            })

            const currentPage = parseInt(query);
            const itemsPerPage = 5;
            const skip = (currentPage - 1) * itemsPerPage;

            const totalItems = await Reacties.countDocuments({ UserId: SearchId });
            const posts = await Reacties.find({ UserId: SearchId }).sort({ CreatedAt: -1 }).skip(skip).limit(itemsPerPage)

            const transformedData = await transformComments(posts, user.Id);

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "The request has succeeded.",
                comments: transformedData,
                currentPage: currentPage,
                totalPages: Math.ceil(totalItems / itemsPerPage)
            });
        }, Reload ? 500 : 0);
    });
});


const transformComments = async (data: any[], userId: any): Promise<any[]> => {
    const UserData: any = await User.findById(userId);
    const promises = data.map(async (item: any) => {

        const ParentPost: any = await Posts.findById(item.ParentId);
        const liked = UserData?.CommentsLiked.includes(item._id) || false;
        const disliked = UserData?.CommentsDisliked.includes(item._id) || false;
        const itemdata = item.Content.content;
        const ParentData = ParentPost.Content.content;

        const headingItem = ParentData.find((item: any) => item.type === 'heading' && item.attrs.level === 1);
        const title = headingItem && headingItem.content && headingItem.content.length > 0 ? headingItem.content[0].text : '';

        const paragraphItem = itemdata.find((item: any) => item.type === 'paragraph');
        const content = paragraphItem && paragraphItem.content && paragraphItem.content.length > 0 ? paragraphItem.content[0].text : '';

        return {
            id: item.id,
            ParentId: item.ParentId,
            title,
            content,
            meta: item.meta,
            liked,
            disliked,
            UpdatedAt: item.UpdatedAt,
            CreatedAt: item.CreatedAt,
        };
    });
    return Promise.all(promises);
}

