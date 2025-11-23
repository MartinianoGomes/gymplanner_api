import type { FastifyInstance, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma.js";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";

export const login = async (
    fastify: FastifyInstance,
    email: string,
    password: string,
) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const validPassword = await compare(password, user.password);
    if (!validPassword) return null;

    const jti = v4();

    const token = fastify.jwt.sign(
        {
            userId: user.id,
            email: user.email.toLowerCase(),
            role: user.role?.toUpperCase()
        },
        {
            sub: user.id,
            expiresIn: "1d",
            jti
        }
    );

    return token;
};

export const logout = async (reply: FastifyReply) => {
    reply.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax"
    });

    return true;
};