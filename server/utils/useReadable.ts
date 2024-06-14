export default async (data: any) => {
    const readableData = data.map((item: any) => {
        if (item.name === 'content' && Buffer.isBuffer(item.data)) {
            try {
                const jsonString = item.data.toString('utf8');
                item.data = JSON.parse(jsonString);
            } catch (error) {
                console.error('Invalid JSON:', item.data);
                item.data = [];
            }
        } else if (!item.name.includes('file') && Buffer.isBuffer(item.data)) {
            return { ...item, data: item.data.toString('utf8') };
        }
        return item;
    });

    const result = readableData.reduce((acc: any, curr: any) => {
        if (!curr.name.includes('file')) acc[curr.name] = curr.data;
        return acc;
    }, {});

    return {
        ...result, files: data.filter((item: any) => item.name.includes('file'))
    }
};