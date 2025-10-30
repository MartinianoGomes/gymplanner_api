import { fastify, type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { compare } from "bcryptjs";
import { v4 } from "uuid";
import { error } from "console";

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
            expiresIn: "5s",
            jti: jti
        }
    );

    await prisma.user.update({
        where: { id: user.id },
        data: { token }
    })

    return token;
}

const getUserByToken = async (token: string) => {
    const user = await prisma.user.findFirst({ where: { token } })
    if (!user) return null;

    return user.id;
}

export { login, getUserByToken };