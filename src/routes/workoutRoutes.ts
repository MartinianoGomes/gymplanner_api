import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as workoutController from "../controllers/workoutController.js";

export async function workoutRoutes(fastify: FastifyInstance) {
    fastify.register(workoutModule, { prefix: "/gymplanner/workout" });
}

async function workoutModule(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/create', workoutController.createWorkout);
    fastify.get('/', workoutController.getAllWorkouts);
    fastify.get('/:id', workoutController.getWorkoutById);
    fastify.patch('/update/:id', workoutController.updateWorkout);
    fastify.delete('/delete/:id', workoutController.deleteWorkout);
    fastify.post('/exercise/add/:workoutId', workoutController.addExerciseToWorkout);
    fastify.delete('/exercise/delete/:exerciseInWorkoutId', workoutController.excludeExerciseFromWorkout);
}
