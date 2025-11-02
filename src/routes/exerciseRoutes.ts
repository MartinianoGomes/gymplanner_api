import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as exerciseController from "../controllers/exerciseController.js";

async function exerciseRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/create', exerciseController.createExercise);
    fastify.get('/', exerciseController.getAllExercises);
    fastify.get('/:id', exerciseController.getExerciseById);
    fastify.patch('/update/:id', exerciseController.updateExercise);
    fastify.delete('/delete/:id', exerciseController.deleteExercise);
}

export { exerciseRoutes };
