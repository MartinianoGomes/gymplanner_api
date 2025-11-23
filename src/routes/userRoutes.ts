import type { FastifyInstance } from "fastify";
import { verifyJwt } from "../hooks/authHooks.js";
import * as userController from "../controllers/userController.js";

async function userRoutes(fastify: FastifyInstance) {
    fastify.register(userModule, { prefix: "/gymplanner" });
}

async function userModule(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);

    app.get("/me", userController.getMe);
    app.patch("/updateProfile", userController.updateProfile);
    app.delete("/deleteProfile", userController.deleteProfile);
}

export { userRoutes };