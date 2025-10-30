import type { FastifyRequest, FastifyReply } from "fastify";
import { getUserByToken } from "../services/userServices.js";

const authHeader = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
        return reply.status(401).send({ error: "Access danied!" });
    }

    const tokenSplit = authHeader.split("Bearer ");

    if (!tokenSplit[1]) {
        return reply.status(401).send({ error: "Access danied!" });
    }

    const token = tokenSplit[1];

    const userToken = await getUserByToken(token);

    if (!userToken) {
        return reply.status(401).send({ error: "Access danied!" });
    }

    (reply as any).userToken = userToken;

    return userToken;
}

export { authHeader }