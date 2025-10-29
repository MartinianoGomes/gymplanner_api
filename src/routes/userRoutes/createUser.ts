import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../../controllers/userController.js";

async function createUser(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/register', userController.createUser);
}

export { createUser };