import z from "zod";

const exerciseSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    groupMuscleId: z.string()
})

export { exerciseSchema }