import 'dotenv/config';

import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import { appRoutes } from './routes/index.js';

const yamlPath = path.resolve(process.cwd(), 'swagger.yaml');
const yamlContent = fs.readFileSync(yamlPath, 'utf8');
const swaggerDocument = yaml.parse(yamlContent);

const server = fastify({ logger: true })

await server.register(fastifySwagger, {
    mode: 'static',
    specification: {
        document: swaggerDocument, // Passa o documento YAML 'parseado'
    },
});

await server.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
    },
});

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

// server.register(globalRoutes);
// server.register(authRoutes);
// server.register(adminRoutes);
// server.register(groupMuscleRoutes, { prefix: '/groupMuscle' });
// server.register(exerciseRoutes, { prefix: '/exercise' });
// server.register(workoutRoutes, { prefix: '/workout' });

server.register(appRoutes);

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