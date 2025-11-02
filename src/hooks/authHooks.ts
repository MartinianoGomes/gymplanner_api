import { type FastifyReply, type FastifyRequest } from "fastify";

export const verifyJwt = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: "Authentication required." });
    }
}


export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await verifyJwt(request, reply);

        if (reply.sent) return;

        if (request.user.role !== "admin") {
            return reply.status(403).send({ message: "Access denied. Administrator permission required." });
        }
    } catch (err) {
        return reply.status(401).send({ message: "Invalid or expired authentication token." });
    }
}