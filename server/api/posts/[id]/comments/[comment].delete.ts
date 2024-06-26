export default defineEventHandler((event) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const SessionId: any = getCookie(event, "access-token");
			const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId);
			const query = getRouterParams(event).id; 
			const comment = getRouterParams(event).comment;
			
			if (!user) return {
				statusCode: 401,
				statusMessage: "Unauthorized",
				message: "The request has not been applied because it lacks valid authentication credentials for the target resource.",
			};

			const posts: any = await Posts.findById(query).catch(() => reject({
				statusCode: 404,
				statusMessage: "Not Found",
				message: "The requested resource could not be found but may be available in the future.",
			}));

			if (!posts) return reject({
				statusCode: 404,
				statusMessage: "Not Found",
				message: "The server has not found anything matching the Request-URI.",
			});

			const comments: any = await Reacties.findById(comment);

			if (!comments) return reject({
				statusCode: 404,
				statusMessage: "Not Found",
				message: "The server has not found anything matching the Request-URI.",
			});

			await Reacties.findByIdAndDelete(comment);
			await Posts.findByIdAndUpdate(query, { $inc: { "meta.Comments": -1 } });

			const updateUsers: any = await User.find()
			for (const user of updateUsers) {
				if (user.CommentsLiked.includes(comment)) await User.findByIdAndUpdate(user._id, { $pull: { CommentsLiked: comment } });
				if (user.CommentsDisliked.includes(comment)) await User.findByIdAndUpdate(user._id, { $pull: { CommentsDisliked: comment } });
			}

			return resolve({
				statusCode: 200,
				statusMessage: "OK",
				message: "The request has succeeded.",
			});
		}, 500);
	});
});

