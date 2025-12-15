import { prisma } from "../lib/prisma.js";
import type { AddExerciseData } from "../types/addExerciseData.js";

const addExercise = async ({ workoutId, exerciseId, series, reps }: AddExerciseData) => {
    const exerciseInWorkout = await prisma.exercisesInWorkout.create({
        data: {
            workoutId: workoutId,
            exerciseId: exerciseId,
            series: series,
            reps: reps,
        },
        include: {
            exercise: {
                include: {
                    groupMuscle: true
                }
            }
        }
    });
    return exerciseInWorkout;
};

const removeExercise = async (exerciseInWorkoutId: string) => {
    await prisma.exercisesInWorkout.delete({
        where: { id: exerciseInWorkoutId }
    });
};

export { removeExercise, addExercise };