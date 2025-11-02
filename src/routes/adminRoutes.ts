import type { FastifyInstance } from "fastify";
import { verifyAdmin } from "../hooks/authHooks.js";
import * as userController from "../controllers/userController.js";

const adminRoutes = (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", verifyAdmin);

    fastify.delete('/delete/:id', userController.deleteUser);
    fastify.patch('/update/:id', userController.updateUser);
    fastify.get('/', userController.getAllUsers);
}

export { adminRoutes };