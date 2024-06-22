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

			const posts: any = await Posts.findById(query);

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

			const data = await readBody(event);
			const error = validateContent(data);
			if (error) return reject(error);

			await Reacties.findByIdAndUpdate(comment, {
				Content: data,
			})

			return resolve({
				statusCode: 200,
				statusMessage: "OK",
				message: "The request has succeeded.",
			});
		}, 500);
	});
});

const validateContent = (content: any) => {
	let error = null;
	content.content.forEach((item: any) => {
		if (item.type === "paragraph" && item.content === undefined) {
			error = {
				statusCode: 400,
				statusMessage: "Bad Request",
				message: "Het bericht mag niet leeg zijn.",
			};
		}
	});
	return error;
};
