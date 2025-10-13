import fastify from "fastify";
import { createUser } from "../controllers/userController.js";

const routes = fastify();

routes.get('/', async (req, res) => {
    const data = {
        name: "GymPlanner API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        status: "success"
    }

    return res.send(data);
})

routes.get('/ping', (req, res) => res.send({ pong: true }))