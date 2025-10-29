import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../controllers/userController.js";

async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/register', userController.createUser);
    fastify.patch('/update/:id', userController.updateUser);
    fastify.get('/', userController.getAllUsers);
}

export { userRoutes };