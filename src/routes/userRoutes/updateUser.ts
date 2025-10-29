import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../../controllers/userController.js";

async function updateUser(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/update', userController.createUser);
}

export { updateUser };