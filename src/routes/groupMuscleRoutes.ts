import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as groupMuscleController from "../controllers/groupMuscleController.js";
import { verifyAdmin } from "../hooks/authHooks.js";

async function groupMuscleRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.addHook("onRequest", verifyAdmin);

    fastify.get('/', groupMuscleController.getAllGroupMuscles);
    fastify.post('/create', groupMuscleController.createGroupMuscle);
    fastify.get('/:id', groupMuscleController.getGroupMuscleById);
    fastify.patch('/update/:id', groupMuscleController.updateGroupMuscle);
    fastify.delete('/delete/:id', groupMuscleController.deleteGroupMuscle);
}

export { groupMuscleRoutes };
