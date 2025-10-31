import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as groupMuscleController from "../controllers/groupMuscleController.js";

async function groupMuscleRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/create', groupMuscleController.createGroupMuscle);
    fastify.get('/', groupMuscleController.getAllGroupMuscles);
    fastify.get('/:id', groupMuscleController.getGroupMuscleById);
    fastify.patch('/update/:id', groupMuscleController.updateGroupMuscle);
    fastify.delete('/delete/:id', groupMuscleController.deleteGroupMuscle);
}

export { groupMuscleRoutes };
