import z, { ZodObject } from "zod";

const groupMuscleSchema = z.object({
    name: z.string().min(1),
    description: z.string()
})

export { groupMuscleSchema };