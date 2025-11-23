import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as exerciseController from "../controllers/exerciseController.js";

export async function exerciseRoutes(fastify: FastifyInstance) {
    fastify.register(exerciseModule, { prefix: "/exercise" });
}

async function exerciseModule(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', exerciseController.getAllExercises);
    fastify.get('/:id', exerciseController.getExerciseById);
}
