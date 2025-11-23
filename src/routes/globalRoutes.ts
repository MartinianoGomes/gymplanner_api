import type { FastifyInstance, FastifyPluginOptions } from "fastify";

export async function globalRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(globalModule);
}

async function globalModule(app: FastifyInstance) {
    app.get("/", async () => {
        return {
            name: "GymPlanner API",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            status: "success"
        };
    });

    app.get("/ping", () => ({ pong: true }));
}