import { type FastifyReply, type FastifyRequest } from "fastify";
import { logout } from "../services/userServices.js";

export const verifyJwt = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch {
        await logout(reply);
        return reply.status(401).send({ error: "Authentication required." });
    }
};

export function verifyRole(role: "ADMIN" | "USER") {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user) {
            await logout(reply);
            return reply.status(401).send({ error: "Authentication required." });
        }

        if (request.user.role !== role) {
            return reply.status(403).send({ error: `Access denied. ${role} permission required.` });
        }
    };
}