
export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {

        const popular = getQuery(event).popular || false;
        const Reload = getQuery(event).reload || false
        const query: any = getQuery(event).page || 1;

        setTimeout( async() => {
            const SessionId: any = getCookie(event, "access-token")
            const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId)

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "De aanvraag is niet geautoriseerd en vereist authenticatie."
            })

            const hoursAgo = 6;
            const thresholdDate = new Date();
            thresholdDate.setHours(thresholdDate.getHours() - hoursAgo);

            const daysAgo = 14; 
            const thresholdWeeksDate = new Date();
            thresholdWeeksDate.setDate(thresholdWeeksDate.getDate() - daysAgo);

            const currentPage = parseInt(query);
            const itemsPerPage = 5;
            const skip = (currentPage - 1) * itemsPerPage;
            let posts: any = [];
        
            const totalItems = popular ? await Posts.countDocuments({ "CreatedAt": { $lt: thresholdDate } }) : await Posts.countDocuments({ "CreatedAt": { $gt: thresholdDate } });
            if (popular) posts = await Posts.find({ "CreatedAt": { $lt: thresholdDate } }).sort({ "meta.points": -1, CreatedAt: -1 }).skip(skip).limit(itemsPerPage);
            else posts = await Posts.find({ "CreatedAt": { $gt: thresholdDate } }).sort({ CreatedAt: -1 }).skip(skip).limit(itemsPerPage);

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
    const promises = data.map( async (item: any) => {
        const itemdata = item.Content.content;
        const liked = UserLikes.includes(item.id)

        const headingItem = itemdata.find((item: any) => item.type === 'heading' && item.attrs.level === 1);
        const title = headingItem && headingItem.content && headingItem.content.length > 0 ? headingItem.content[0].text : '';

        const author: any = await User.findById(item.UserId);

        const paragraphItem = itemdata.find((item: any) => item.type === 'paragraph');
        const content = paragraphItem && paragraphItem.content && paragraphItem.content.length > 0 ? paragraphItem.content[0].text : '';
        const media = itemdata.find((item: any) => item.type === 'image' || item.type === 'video' )?.attrs.src || null;

        return {
            id: item.id,
            title,
            content,
            media,
            liked,
            meta: item.meta,
            author: author.Username,
            UpdatedAt: item.UpdatedAt,
            CreatedAt: item.CreatedAt,
        };
    });
    return Promise.all(promises);
}