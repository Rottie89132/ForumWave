import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import { serverSupabaseServiceRole } from '#supabase/server'

const updateContentSrc = (content: any, files: object[]) => {

	content.content.forEach((item: any) => {
		files.forEach((file: any) => {
			if (item.type === "image" && item.attrs.title === file.title) { item.attrs.src = file.src; }
			else if (item.type === "video" && item.attrs.title === file.title) { item.attrs.src = file.src; }
		});
	});
	return content;
}

export default defineEventHandler(async (event) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const client = serverSupabaseServiceRole(event)
			const SessionId: Record<string, any> | any = getCookie(event, "access-token")
			const user: Record<string, any> | null = await useStorage("Sessions").getItem(SessionId)

			if (!user) return reject({
				statusCode: 401,
				statusMessage: "Unauthorized",
				message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
			})

			const data = await readMultipartFormData(event);
			const readableData = await useReadable(data);
			const PostId = crypto.randomUUID();

			const allowedTypes = [".png", ".jpeg", ".jpg", ".gif", ".mp4"];
			const FilePaths: object[] = [];
			for (const file of readableData.files) {
				const ImageId = crypto.randomUUID();
				let extension = path.extname(file.filename).toLowerCase();
				let buffer: Buffer | void

				if (!allowedTypes.includes(extension)) return reject({
					statusCode: 415,
					statusMessage: "Unsupported Media Type",
					message: "The server is refusing to service the request because the payload is in a format not supported by this method on the target resource."
				})

				if (extension === ".jpeg" || extension === ".jpg" || extension === ".png") {
					buffer = await sharp(file.data).rotate().webp({ quality: 75 }).toBuffer().then(() => {
						extension = ".webp"
					}).catch((err: Error) => {
						return reject({
							statusCode: 500,
							statusMessage: "Internal Server Error",
							message: "Error converting image to WEBP",
						})
					});
					extension = ".webp";
				}

				await client.storage.from('files').upload(`${PostId}/${ImageId}${extension}`, file.data, {
					cacheControl: '3600',
					contentType: extension === ".webp" ? "image/webp" : file.type,
				});

				const src = client.storage.from('files').getPublicUrl(`${PostId}/${ImageId}${extension}`);
				FilePaths.push({
					title: file.filename,
					src: src.data.publicUrl,
					type: extension === ".mp4" ? "video" : "image",
				});
			}

			await Posts.create({
				UserId: user.Id,
				PostId: PostId,
				Content: updateContentSrc(readableData.content, FilePaths)
			}).then(() => {
				return resolve({
					statusCode: 200,
					statusMessage: "OK",
					message: "Post created successfully",
				});
			}).catch((err: Error) => {
				console.error(err);
				return reject({
					statusCode: 500,
					statusMessage: "Internal Server Error",
					message: "Error saving post to database",
				});
			});
		}, 1000);
	});
});
