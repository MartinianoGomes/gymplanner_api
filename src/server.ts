import 'dotenv/config';

import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCookie from '@fastify/cookie';

import { authRoutes } from "./routes/authRoutes.js";
import { globalRoutes } from "./routes/globalRoutes.js";
import { adminRoutes } from './routes/adminRoutes.js';

const server = fastify({ logger: true })

server.register(fastifyHelmet)
server.register(fastifyCors)
server.register(fastifyCookie);

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    server.log.error("CRITICAL ERROR: JWT_SECRET is not defined in the .env file or the .env file was not loaded.")
    process.exit(1);
}

server.register(fastifyJwt, { secret: jwtSecret })

server.register(globalRoutes);
server.register(authRoutes);
server.register(adminRoutes, { prefix: '/admin' });

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