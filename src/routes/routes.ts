import fastify from "fastify";
import * as userController from "../controllers/userController.js";

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

routes.post('/user/register', userController.createUser);