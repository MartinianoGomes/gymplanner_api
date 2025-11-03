import z, { positive } from "zod";

const workoutSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    day: z.number().int().min(1).max(7),
    userId: z.string(),
    exercisesInWorkout: z.array(
        z.object({
            exerciseId: z.string(),
            series: z.number().int().positive(),
            reps: z.number().int().positive()
        })
    )
})

export { workoutSchema };