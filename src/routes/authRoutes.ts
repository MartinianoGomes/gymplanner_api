import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../controllers/userController.js";

async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/register', userController.createUser);
    fastify.post('/login', userController.userLogin);
    fastify.post('/logout', userController.userLogout);
}

export { authRoutes };