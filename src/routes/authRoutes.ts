import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../controllers/userController.js";

export async function authRoutes(fastify: FastifyInstance) {
    fastify.register(authModule, { prefix: "/gymplanner/auth" });
}

async function authModule(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/register', userController.createUser);
    fastify.post('/login', userController.userLogin);
    fastify.post('/logout', userController.userLogout);
}