export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            await User.find().then((users) => {
                return resolve({
                    statusCode: 200,
                    statusMessage: "OK",
                    message: "The request has succeeded.",
                })
            }).catch((error) => {
                return reject({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                    message: "The server encountered an unexpected condition that prevented it from fulfilling the request."
                })
            })
        }, 500);
    });
});

