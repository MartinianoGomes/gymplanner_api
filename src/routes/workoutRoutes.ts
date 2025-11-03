import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as workoutController from "../controllers/workoutController.js";

async function workoutRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/create', workoutController.createWorkout);
    fastify.get('/', workoutController.getAllWorkouts);
    fastify.get('/:id', workoutController.getWorkoutById);
    fastify.patch('/update/:id', workoutController.updateWorkout);
    fastify.delete('/delete/:id', workoutController.deleteWorkout);
    fastify.delete('/delete/exercise/:exerciseInWorkoutId', workoutController.deleteExerciseFromWorkout);
}

export { workoutRoutes };
