import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as groupMuscleController from "../controllers/groupMuscleController.js";

export async function groupMuscleRoutes(fastify: FastifyInstance) {
    fastify.register(groupMuscleModule, { prefix: "/groupMuscle" });
}

async function groupMuscleModule(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', groupMuscleController.getAllGroupMuscles);
    fastify.get('/:id', groupMuscleController.getGroupMuscleById);
}
