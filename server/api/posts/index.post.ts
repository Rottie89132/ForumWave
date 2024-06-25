import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const client = serverSupabaseServiceRole(event)
			const SessionId: Record<string, any> | any = getCookie(event, "access-token")
			const user: Record<string, any> | null = await useVercelStorage().getItem(SessionId)

			if (!user) return reject({
				statusCode: 401,
				statusMessage: "Unauthorized",
				message: "The request has not been applied because it lacks valid authentication credentials for the target resource."
			})

			const data = await readMultipartFormData(event);
			const readableData = await useReadable(data);
			const PostId = crypto.randomUUID();


			const Error = validateContent(readableData.content);
			if(Error) return reject(Error)

			const allowedTypes = [".png", ".jpeg", ".jpg", ".gif", ".mp4", ".mov"];
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
				}).catch((err: Error) => {
					return reject({
						statusCode: 500,
						statusMessage: "Internal Server Error",
						message: "Fout bij het uploaden van bestand, het bestand is mogelijk te groot (max 50mb).",
					});
				});

				const src = client.storage.from('files').getPublicUrl(`${PostId}/${ImageId}${extension}`);
				FilePaths.push({
					title: file.filename,
					src: src.data.publicUrl,
					type: extension === ".mp4" ? "video" : extension === ".mov" ? "video" : "image",
				});
			}

			const { content, error } = updateContentSrc(readableData.content, FilePaths)
			if (error) return reject(error)
			
			await Posts.create({
				UserId: user.Id,
				PostId: PostId,
				Content: content
			}).then((data) => {
				return resolve({
					statusCode: 200,
					statusMessage: "OK",
					message: "Post created successfully",
					data: {
						PostId: data._id,
					},
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

const updateMediaSources = (content: any, files: any) => {
	content.content.forEach((item: any) => {
		files.forEach((file: any) => {
			if ((item.type === "image" || item.type === "video") && item.attrs.title === file.title) {
				item.attrs.src = file.src + (file.type === "video" ? "#t=0.1" : "")
			}
		});
	});
};

const validateContent = (content: any) => {
    let error = null;
    let hasH1 = false; 
    let hasH2 = false; 

    content.content.forEach((item: any) => {
        if (item.type === "heading") {
            if (item.attrs.level == 1 && item.content !== undefined) hasH1 = true; 
            else if (item.attrs.level == 2) hasH2 = true; 
        }
    });

    if (!hasH1) {
        error = {
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Title is verplicht en moet minstens één H1 bevatten"
        };
    }

    return error;
};

const updateContentSrc = (content: any, files: object[]) => {
	updateMediaSources(content, files);
	let error = validateContent(content);
	return { content, error };
}