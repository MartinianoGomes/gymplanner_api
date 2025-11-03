import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

const addExerciseToWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
    const { workoutId } = request.params as { workoutId: string };
    const { exerciseId, series, reps } = request.body as { exerciseId: string, series: number, reps: number };

    if (!workoutId || !exerciseId) {
        return reply.status(400).send({ error: "Workout ID and Exercise ID must be provided." });
    }

    try {
        const exerciseInWorkout = await prisma.exercisesInWorkout.create({
            data: {
                workoutId: workoutId,
                exerciseId: exerciseId,
                series: series,
                reps: reps,
            },
            include: {
                exercise: true
            }
        });

        return reply.status(201).send(exerciseInWorkout);
    } catch (error) {
        return reply.status(500).send({ error, message: "Unable to add exercise to workout." });
    }
};

const deleteExerciseFromWorkout = async (request: FastifyRequest, reply: FastifyReply) => {
    const { exerciseInWorkoutId } = request.params as { exerciseInWorkoutId: string };

    if (!exerciseInWorkoutId) {
        return reply.status(400).send({ error: "ExerciseInWorkout ID must be provided." });
    }

    try {
        await prisma.exercisesInWorkout.delete({
            where: { id: exerciseInWorkoutId }
        });

        return reply.status(200).send({ message: "Exercise removed from workout." });
    } catch (error) {
        return reply.status(404).send({ error, message: "Unable to delete exercise from workout." });
    }
};

export { addExerciseToWorkout, deleteExerciseFromWorkout };