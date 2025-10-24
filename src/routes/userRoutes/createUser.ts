import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as userController from "../../controllers/userController.js";

async function userRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/user/register', userController.createUser);
}

export { userRouter };