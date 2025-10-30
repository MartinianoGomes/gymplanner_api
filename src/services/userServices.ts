import { fastify, type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { compare } from "bcryptjs";
import { v4 } from "uuid";

const userLogin = async (
    fastify: FastifyInstance,
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const validPassword = await compare(password, user.password);
    if (!validPassword) return null;

    const jti = v4();

    const token = fastify.jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        {
            sub: user.id,
            expiresIn: "1d",
            jti: jti
        }
    );

    await prisma.user.update({
        where: { email: email },
        data: { token }
    })

    return token;
}

const getUserByToken = async (token: string) => {
    const user = await prisma.user.findFirst({ where: { token } })
    if (!user) return null;

    return user.id;
}

export { userLogin, getUserByToken };