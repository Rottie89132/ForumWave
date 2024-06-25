const extractFormDataWithoutFile = (formData:any) => {
    const newFormData = new FormData();
    for (const [key, value] of formData.entries()) {
        if (key !== 'file') newFormData.append(key, value);
    }
    return newFormData;
};


export default async (url: any, options: any, maxPayloadSize = 3 * 1024 * 1024) => {
    const files = options.body.getAll('file');
    const formDataWithoutFile = extractFormDataWithoutFile(options.body);
    const filesCount = files.length;
    const PostId = Date.now().toString() + Math.random().toString(36)

    let response: any = {
        data: [],
        error: [],
    }

    if (files.length === 0) {
        const { data, error } = await useFetch(url, {
            method: options.method,
            body: options.body,
        });

        if (error.value) response.error = error;
        else response.data = data;
        return response;
    }

    let isFirstIteration = true;

    for (let i : any = 0; i < files.length; i++) {
        const file = files[i];
        const uploadId = Date.now().toString() + Math.random().toString(18)
        const totalChunks: any = Math.ceil(file.size / maxPayloadSize);

        let start = 0;
        let chunkIndex: any = 1;

        while (start < file.size) {
            const chunk = file.slice(start, start + maxPayloadSize);
            const chunkFormData = new FormData();

            if (isFirstIteration) {
                for (const [key, value] of formDataWithoutFile.entries()) chunkFormData.append(key, value);
                isFirstIteration = false;
            }

            chunkFormData.append('file', chunk, file.name);
            chunkFormData.append('uploadId', uploadId);
            chunkFormData.append('PostId', PostId);
            chunkFormData.append('CountIndex', i + 1);
            chunkFormData.append('totalCount', filesCount);
            chunkFormData.append('chunkIndex', chunkIndex);
            chunkFormData.append('totalChunks', totalChunks);

            const { data, error } = await useFetch(url, {
                method: options.method,
                body: chunkFormData,
            });

            if (error.value) return response.error = error;
            else response.data = data;

            start += maxPayloadSize;
            chunkIndex++;
        }
    }

    return response;
};


