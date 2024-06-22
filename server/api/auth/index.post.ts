import { version } from "vue";
import * as zod from "zod";

export default defineEventHandler((event) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            const request = await readBody(event);
            const user: any = await User.findOne({ Email: request.email })

            if (!user) return reject({
                statusCode: 401,
                statusMessage: "Unauthorized",
                message: "The request has not been applied because it lacks valid authentication credentials for the target resource.",
                data: {
                    email: ["Fout email adres of wachtwoord opgegeven"],
                    wachtwoord: ["Fout email adres of wachtwoord opgegeven"]
                },
            });

            const Schema = zod
                .object({
                    email: zod.string().email(),
                    wachtwoord: zod.string().min(8, { message: "Moet langer dan 8 zijn" }),
                })

                .refine(
                    async (data) => {
                        const Available: any = await User.findOne({ Email: data.email });
                        return Available;
                    },
                    {
                        message: "Fout email adres opgegeven",
                        path: ["email"],
                    }
                )
                .refine(
                    async (data) => {
                        const passwordMatch = await bcrypt.compare(data.wachtwoord, user.Password)
                        return passwordMatch;
                    },
                    {
                        message: "Wachtwoord knop niet",
                        path: ["wachtwoord"],
                    }
                );

            const { error }: any = await Schema.safeParseAsync(request);

            if (error)
                return reject({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    message: "Fouten gevonden",
                    data: error.formErrors.fieldErrors,
                });

            const SessionId = crypto.randomUUID()
            await useVercelStorage().setItem(SessionId, {
                Id: user._id,
                Email: user.Email,
                Name: user.Username,
            })

            setTimeout(async () => {
                await useVercelStorage().removeItem(SessionId);
            }, 24 * 60 * 60 * 1000);

            
            setCookie(event, "access-token", SessionId, {
                httpOnly: false, sameSite: false, maxAge: 24 * 60 * 60 * 1000
            });

            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Ingeloged",
                user: {
                    Id: user._id,
                    Email: user.Email,
                    Name: user.Username,
                }
            });
        }, 1000);
    });
});
