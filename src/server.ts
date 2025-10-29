import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import { userRouter } from "./routes/routes.js";
import { globalRouter } from "./routes/routes.js";

const server = fastify({ logger: true })

server.register(fastifyHelmet)
server.register(fastifyCors)

server.register(globalRouter);
server.register(userRouter);

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