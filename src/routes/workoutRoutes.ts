import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as workoutController from "../controllers/workoutController.js";
import { verifyJwt } from "../hooks/authHooks.js";

export async function workoutRoutes(fastify: FastifyInstance) {
    fastify.register(workoutModule, { prefix: "/workout" });
}

async function workoutModule(fastify: FastifyInstance, options: FastifyPluginOptions) {
<<<<<<< Updated upstream
    // Aplica verificação de JWT em todas as rotas de workout
=======
    // Aplicar autenticação a todas as rotas de workout
>>>>>>> Stashed changes
    fastify.addHook("onRequest", verifyJwt);

    fastify.post('/create', workoutController.createWorkout);
    fastify.get('/', workoutController.getMyWorkouts);
    fastify.get('/:id', workoutController.getWorkoutById);
    fastify.patch('/update/:id', workoutController.updateWorkout);
    fastify.delete('/delete/:id', workoutController.deleteWorkout);
    fastify.post('/exercise/add/:workoutId', workoutController.addExerciseToWorkout);
    fastify.delete('/exercise/delete/:exerciseInWorkoutId', workoutController.excludeExerciseFromWorkout);
}
