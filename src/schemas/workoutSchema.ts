import z from "zod";

const workoutSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
})

export { workoutSchema };