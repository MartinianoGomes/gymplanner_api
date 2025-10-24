import fastify from "fastify";
import "express-async-errors"
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import { userRouter } from "./routes/userRoutes/createUser.js";
import { globalRouter } from "./routes/routes.js";

const server = fastify()

server.register(fastifyHelmet)
server.register(fastifyCors)

server.register(globalRouter);
server.register(userRouter);

server.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});