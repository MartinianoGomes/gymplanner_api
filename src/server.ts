import 'dotenv/config';

import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";

import { userRoutes } from "./routes/userRoutes.js";
import { globalRouter } from "./routes/globalRoutes.js";

const server = fastify({ logger: true })

server.register(fastifyHelmet)
server.register(fastifyCors)

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    server.log.error("CRITICAL ERROR: JWT_SECRET is not defined in the .env file or the .env file was not loaded.")
    process.exit(1);
}

server.register(fastifyJwt, { secret: jwtSecret })

server.register(globalRouter);
server.register(userRoutes, { prefix: '/user' });

const port = Number(process.env.PORT) || 3000;

const start = async () => {
    try {
        await server.listen({ port: port, host: '0.0.0.0' });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start()