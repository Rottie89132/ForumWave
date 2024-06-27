const streamMap: any[] = []
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
                message: "De aanvraag is niet geautoriseerd en vereist authenticatie."
            })

            const data = await readMultipartFormData(event);
            const readableData = await useReadable(data);
            const PostDataId = crypto.randomUUID();

            streamMap.push(readableData)
            const { uploadId, PostId, chunkIndex, totalChunks, totalCount, CountIndex, } = readableData;

            if (CountIndex == totalCount) {
                if (chunkIndex == totalChunks) {
                    const { content: RawContent, files }: any = mergeDataByPostId(PostId, uploadId)

                    const Error = validateContent(RawContent);
                    if (Error) return reject(Error)

                    const allowedTypes = [".png", ".jpeg", ".jpg", ".gif", ".mp4", ".mov"];
                    const FilePaths: object[] = [];

                    cleanByPostId(PostId)

                    for (const file of files) {
                        const ImageId = crypto.randomUUID();
                        let extension = path.extname(file.filename).toLowerCase();
						let buffer: Buffer = file.data;

                        if (file.data.length > 50000000) return reject({
                            statusCode: 413,
                            statusMessage: "Payload Too Large",
                            message: "Fout bij het uploaden van bestand, het bestand is mogelijk te groot (max 4.45mb)."
                        })

                        if (!allowedTypes.includes(extension)) return reject({
                            statusCode: 415,
                            statusMessage: "Unsupported Media Type",
                            message: "Fout bij het uploaden van bestand, het bestandstype wordt niet ondersteund."    
                        })

                        
						if (extension === ".jpeg" || extension === ".jpg" || extension === ".png") {
							await sharp(file.data).rotate().webp({ quality: 10 }).toBuffer().then((data) => {
								buffer = data;
								extension = ".webp"
							})
							.catch((err: Error) => {
								return reject({
									statusCode: 500,
									statusMessage: "Internal Server Error",
									message: "Fout bij het omzetten van bestand naar webp",
								})
							});
						}

                        try {
							await client.storage.from('files').upload(`${PostDataId}/${ImageId}${extension}`, buffer, {
                                cacheControl: '3600',
                                contentType: extension === ".webp" ? "image/webp" : file.type,
                            });

                            const src = client.storage.from('files').getPublicUrl(`${PostDataId}/${ImageId}${extension}`);
                            FilePaths.push({
                                title: file.filename,
                                src: src.data.publicUrl,
                                type: extension === ".mp4" ? "video" : extension === ".mov" ? "video" : "image",
                            });
                        } catch (err) {
                            return reject({
                                statusCode: 500,
                                statusMessage: "Internal Server Error",
                                message: "Fout bij het uploaden van bestand",
                            });
                        }
                    }

                    const { content, error } = updateContentSrc(RawContent, FilePaths)
                    if (error) return reject(error)

					await Posts.create({
						UserId: user.Id,
						PostId: PostDataId,
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
							message: "Fout bij het uploaden van de post",
						});
					});
                }
            }
            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Chunk uploaded successfully",
            });
        }, 50);
    });
});

const mergeDataByPostId = (postId: string, uploadId: string) => {
	const filteredStreams = streamMap.filter(stream => stream.PostId === postId);
	const uniqueUploadIds = Array.from(new Set(filteredStreams.map(item => item.uploadId)));

	const mergedData: any = {
		content: {},
		files: []
	};

	const mimeTypeMap: any = {
		".png": "image/png",
		".jpeg": "image/jpeg",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".mp4": "video/mp4",
		".mov": "video/quicktime"
	};

	uniqueUploadIds.forEach((uploadId) => {
		const streams = filteredStreams.filter(stream => stream.uploadId === uploadId);
		const sortedStreams = streams.sort((a, b) => parseInt(a.chunkIndex) - parseInt(b.chunkIndex));
		sortedStreams.forEach((stream: any) => {
			if (stream.content) mergedData.content = stream.content;
			stream.files.forEach((file: any) => {
				const extension: string = path.extname(file.filename).toLowerCase();
				const existingFileIndex = mergedData.files.findIndex((f: any) => f.filename === file.filename);
				if (existingFileIndex !== -1) {
					const existingFile = mergedData.files[existingFileIndex];
					existingFile.data = Buffer.concat([existingFile.data, file.data]);
				} else {
					file.type = mimeTypeMap[extension] || file.type
					mergedData.files.push({ ...file, type: file.type });
				}
			});
		});
	});
	return mergedData;
};

const cleanByPostId = (postId: string) => {
	const filteredStreams = streamMap.filter(stream => stream.PostId !== postId);
	streamMap.length = 0;
	streamMap.push(...filteredStreams);
}

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


