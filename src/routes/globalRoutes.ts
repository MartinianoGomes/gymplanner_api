import type { FastifyInstance, FastifyPluginOptions } from "fastify";

async function globalRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/', async (req, res) => {
        const data = {
            name: "GymPlanner API",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            status: "success"
        }

        return res.send(data);
    })

    fastify.get('/ping', (req, res) => res.send({ pong: true }))
}

export { globalRoutes }