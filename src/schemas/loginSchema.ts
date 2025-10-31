import z, { email } from "zod";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export { loginSchema };