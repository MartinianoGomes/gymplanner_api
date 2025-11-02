import 'dotenv/config';

import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCookie from '@fastify/cookie';

import { authRoutes } from "./routes/authRoutes.js";
import { adminRoutes } from './routes/adminRoutes.js';
import { globalRoutes } from "./routes/globalRoutes.js";
import { groupMuscleRoutes } from './routes/groupMuscleRoutes.js';
import { exerciseRoutes } from './routes/exerciseRoutes.js';

const server = fastify({ logger: true })

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    server.log.error("CRITICAL ERROR: JWT_SECRET is not defined in the .env file or the .env file was not loaded.")
    process.exit(1);
}

server.register(fastifyHelmet)
server.register(fastifyCors)
server.register(fastifyCookie);

server.register(fastifyJwt, {
    secret: jwtSecret,
    cookie: {
        cookieName: 'token',
        signed: false
    }
})

server.register(globalRoutes);
server.register(authRoutes);
server.register(adminRoutes, { prefix: '/admin' });
server.register(groupMuscleRoutes, { prefix: '/groupMuscle' })
server.register(exerciseRoutes, { prefix: '/exercise' });

import { workoutRoutes } from "./routes/workoutRoutes.js";
server.register(workoutRoutes, { prefix: '/workout' });

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