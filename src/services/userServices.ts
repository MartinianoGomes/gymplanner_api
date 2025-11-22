import { fastify, type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { compare } from "bcryptjs";
import { v4 } from "uuid";

const login = async (
    fastify: FastifyInstance,
    email: string,
    password: string,
) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const validPassword = await compare(password, user.password);
    if (!validPassword) return null

    const jti = v4();

    const token = fastify.jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role
        },
        {
            sub: user.id,
            expiresIn: "1d",
            jti: jti
        }
    );

    return token;
}

const logout = async (reply: FastifyReply) => {
    reply.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
    });
    
    return true;
}

export { login, logout };