import * as zod from "zod";

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const request = await readBody(event);

      const Schema = zod
        .object({
          username: zod.string().min(5, { message: "Moet langer dan 5 zijn" }),
          email: zod.string().email(),
          wachtwoord: zod.string().min(8, { message: "Moet langer dan 8 zijn" }),
          confirmatie: zod.string(),
        })

        .refine((data) => data.wachtwoord === data.confirmatie, {
          message: "Wachtwoorden komen niet overheen",
          path: ["confirmatie"],
        })

        .refine(async (data) => {
          const NotAvailable: any = await User.findOne({ Email: data.email });
          return !NotAvailable;
        },{
            message: "Het opgegeven email adres is niet beschikbaar",
            path: ["email"],
        })

        .refine(async (data) => {
          const NotAvailable: any = await User.findOne({ Username: data.username });
          return !NotAvailable;
        },{
          message: "Het opgegeven gebruikersnaam is niet beschikbaar",
          path: ["username"],
        })

      const { data, error }: any = await Schema.safeParseAsync(request);

      if (error)
        return reject({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: "Fouten gevonden",
          data: error.formErrors.fieldErrors,
        });

      const user = await User.create({
        Username: data.username,
        Password: bcrypt.hashSync(data.wachtwoord, 10),
        Email: data.email,
      });

      const response = {
        user: {
          Id: user._id,
          Email: user.Email,
          Username: user.Username,
        },
      };

      return resolve({
        statusCode: 200,
        statusMessage: "OK",
        message: "Account aangemaakt",
        data: response,
      });

    }, 1000);
  });
});
