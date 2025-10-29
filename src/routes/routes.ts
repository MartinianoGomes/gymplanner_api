import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { createUser } from "../controllers/userController.js";
import { updateUser } from "./userRoutes/updateUser.js";

async function globalRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', async (req, res) => {
        const data = {
            name: "GymPlanner API",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            status: "success"
        }

        return res.send(data);
    })

    fastify.get('/ping', (req, res) => res.send({ pong: true }))
}

async function userRouter(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/user', async (req, res) => createUser)
    fastify.post('/user', async (req, res) => updateUser)
}

export { globalRouter, userRouter }