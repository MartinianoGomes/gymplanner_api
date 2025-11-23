import type { FastifyInstance } from "fastify";
import { globalRoutes } from "./globalRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { exerciseRoutes } from "./exerciseRoutes.js";
import { groupMuscleRoutes } from "./groupMuscleRoutes.js";
import { workoutRoutes } from "./workoutRoutes.js";
import { userRoutes } from "./userRoutes.js";

export async function appRoutes(fastify: FastifyInstance) {
    fastify.register(globalRoutes);
    fastify.register(adminRoutes);
    fastify.register(authRoutes);
    fastify.register(userRoutes);
    fastify.register(exerciseRoutes);
    fastify.register(groupMuscleRoutes);
    fastify.register(workoutRoutes);
}