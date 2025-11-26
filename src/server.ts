import 'dotenv/config';

import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import fs from 'fs';
import yaml from 'yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const yamlPath = join(__dirname, '..', 'swagger.yaml'); // sobe 1 pasta
const yamlContent = fs.readFileSync(yamlPath, 'utf8');
const swaggerDocument = yaml.parse(yamlContent);

import { appRoutes } from './routes/index.js';

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
server.register(fastifyCors, {
    origin: process.env.NODE_ENV === 'production'
        ? "https://gymplanner-five.vercel.app"
        : "http://localhost:5173",
    credentials: true
})
server.register(fastifyCookie);

server.register(fastifyJwt, {
    secret: jwtSecret,
    cookie: {
        cookieName: 'token',
        signed: false
    }
})

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