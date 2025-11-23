import type { FastifyInstance } from "fastify";
import { verifyJwt, verifyRole } from "../hooks/authHooks.js";
import * as adminController from "../controllers/adminController.js"
import * as exerciseController from "../controllers/exerciseController.js";
import * as groupMuscleController from "../controllers/groupMuscleController.js"

export async function adminRoutes(fastify: FastifyInstance) {
    fastify.addHook("onRequest", verifyJwt);
    fastify.addHook("onRequest", verifyRole("ADMIN"));

    fastify.register(adminUserModule, { prefix: "/gymplanner/admin" });
    fastify.register(adminExerciseModule, { prefix: "/gymplanner/admin" });
    fastify.register(adminGroupMuscleModule, { prefix: "/gymplanner/admin" });
}

async function adminUserModule(fastify: FastifyInstance) {
    fastify.delete("/user/delete/:id", adminController.deleteUser);
    fastify.patch("/user/update/:id", adminController.updateUser);
    fastify.get("/user", adminController.getAllUsers);
}

async function adminExerciseModule(fastify: FastifyInstance) {
    fastify.post('/exercise/create', exerciseController.createExercise);
    fastify.delete('/exercise/delete/:id', exerciseController.deleteExercise);
    fastify.patch('/exercise/update/:id', exerciseController.updateExercise);
}

async function adminGroupMuscleModule(fastify: FastifyInstance) {
    fastify.post('/groupMuscle/create', groupMuscleController.createGroupMuscle);
    fastify.patch('/groupMuscle/update/:id', groupMuscleController.updateGroupMuscle);
    fastify.delete('/groupMuscle/delete/:id', groupMuscleController.deleteGroupMuscle);
}