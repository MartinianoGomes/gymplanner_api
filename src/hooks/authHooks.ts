import { type FastifyReply, type FastifyRequest } from "fastify";

export const verifyJwt = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: "Autenticação necessária." });
    }
}


export const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();

        if (request.user.role !== "ADMIN") {
            return reply.status(403).send({ message: "Acesso negado. Requer permissão de administrador." });
        }

    } catch (err) {
        return reply.status(401).send({ message: "Token de autenticação inválido ou expirado." });
    }
}