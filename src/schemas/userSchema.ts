import z from "zod";

const userSchema = z.object({
    name: z.string().min(1),
    email: z.email().lowercase(),
    password: z.string().min(8)
})

export { userSchema }